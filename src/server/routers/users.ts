import messages from '../messages.js'
import express, { Response } from "express";
import bcrypt from 'bcrypt';
import { accessDenied, hashData, incorrectData } from '../functions/database.js';
import { MyRequest, Result } from '../../types/server.js';
import { Action, ActiveUser, PERMISSION, PermissionSchema, User, UserLoginResult } from "../../types/user.js";
import { SERVER_EVENTS } from "../../types/enums.js";
import { RESOURCE } from '../../types/user.js';
import { StatusCodes } from 'http-status-codes';
import { getAllUserPermissions, getPermissions } from './permissions.js';
import { randomUUID } from 'crypto';
import { getDataBaseUserService } from '../options.js';
import { ROLES_ROUTE, USER_ACTIONS_ROUTE, USER_ROLES_ROUTE } from '../../types/routes.js';
import { RolesSchema, UserLogSchema, UserRolesSchema, UserSchema, UserTokenSchema } from '../../types/schemas/userSchemas.js';
import { USER_TABLE_NAMES } from '../../types/schemas/schemas.js';
import { addRole, addToken, addUserLog, addUserRole, clearUserLog, deleteRole, deleteToken, deleteUserRole, getRoles, getTokenByUserSessionId, getTokenData, getTokens, getUserIdByName, getUserIdByToken, getUserLog, getUserName, getUserPermissions, getUserRoles, getUserRolesByUserId, getUsers, updateRole, updateToken, updateUserRole } from './functions/users.js';

const router = express.Router();
export default router

export const events: Map<string, Response> = new Map()


const expiredInterval = 3600 * 1000
const clearExpiredTokens = async () => {
  const tokens = await getTokens()
  for (let t of tokens) {
    if (Date.now() - t.lastActionTime > expiredInterval) {
      await deleteToken(t.token)
      addUserLog({userId: t.userId, action: Action.EXPIRE_LOGOUT, time: Date.now()})
      //console.log('Token was deleted by expiration', t.userName, t.userId, t.token)
      events.forEach((v, k) => {
        try {
          if (k === t.token) {
            logoutUser(t.token, SERVER_EVENTS.EXPIRE)
            v.end()
            events.delete(k)
          }
        } catch (e) { 
          console.error(e)
        }
      })
    }
  }
}

setInterval(clearExpiredTokens, 60000)

export async function notifyActiveUsers(message: SERVER_EVENTS) {
  const tokens = await getTokens()
  events.forEach(async (v, k) => {
    const userId = tokens.find(t => t.token === k)?.userId || 0
    const perm = await getUserPermissions(userId, RESOURCE.USERS)
    if (!perm.Read) return
    try {
      v.write(getEventSourceMessage(message))
    } catch (e) {
      console.error(e)
    }
  })
}

export function logoutUser(token: string, message: SERVER_EVENTS) {
  events.forEach((v, k) => {
    try {
      if (k === token) {
        v.write(getEventSourceMessage(message))
        events.delete(k)
      }
    } catch (e) {
      console.error(e)
    }
  })
}

router.get("/hash", async (req, res) => {
  const result = await hashData(req.query.data as string);
  res.json(result);
});

router.get("/events", async (req, res) => {
  const token = (req as MyRequest).token as string;
  const tokens = await getTokens()
  if (!tokens.find(t => token)) return accessDenied(res)
  events.set(token, res)
  res.writeHead(200, {
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache'
  })
});

router.get("/verify", async (req, res) => {
  const token = (req as MyRequest).token as string;
  const tokenData = await getTokenData(token)
  if (!tokenData) return res.json({ success: false });
  const roles = (await getUserRolesByUserId(tokenData?.userId)).map(r => r.roleId)
  const permissions  = await getAllUserPermissions(roles)
  const result = await updateToken(tokenData)
  const userName = await getUserName(tokenData.userId)
  notifyActiveUsers(SERVER_EVENTS.UPDATE_ACTIVE_USERS)
  res.status(result.status).json({ ...result, data: [{ name: userName, userSessionId: tokenData.userSessionId, roles, permissions }], success: true });
});

router.post("/login", async (req, res) => {
  const user = req.body;
  if (!user.name) user.name = "";
  if (!user.password) user.password = "";
  const result = await loginUser(user);
  const loginTime = Date.now()
  const lastActionTime = loginTime
  if (result.success) {
    const userId = await getUserIdByName(user.name) || 0
    await addToken({ token: result.token as string, userId, userSessionId: result.data[0].userSessionId, loginTime, lastActionTime })
    await notifyActiveUsers(SERVER_EVENTS.UPDATE_ACTIVE_USERS)
    res.cookie('token', result.token, { httpOnly: true })
  }
  result.token = undefined
  res.status(result.status).json(result);
});

router.post("/logout", async (req, res) => {
  const token = (req as MyRequest).token as string;
  const userId = await getUserIdByToken(token)
  const result = await deleteToken(token)
  if (userId) await addUserLog({userId, action: Action.LOGOUT, time: Date.now()})
  res.cookie('token', "")
  res.status(result.status).json(result);
});

router.post("/logoutuser", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.UPDATE]))) return accessDenied(res)
  const { userSessionId } = req.body;
  const tokenData = await getTokenByUserSessionId(userSessionId)
  const userId = await getUserIdByToken(tokenData.token)
  const result = await deleteToken(tokenData.token)
  if(result.success) {
    logoutUser(tokenData.token, SERVER_EVENTS.LOGOUT)
    await notifyActiveUsers(SERVER_EVENTS.UPDATE_ACTIVE_USERS)
    if (userId) await addUserLog({userId, action: Action.FORCE_LOGOUT, time: Date.now()})
  }
  res.status(result.status).json(result);
});

router.get("/active", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.READ]))) return accessDenied(res)
  const result: Result<ActiveUser> = { success: true, status: StatusCodes.OK, data: [] }
  const tokens = await getTokens();
  const users = (await getUsers()).data;
  for (let t of tokens){
    const user = users.find(u => u.id === t.userId)
    if (user) {
      result.data.push({ userSessionId: t.userSessionId, name: user.name, loginTime: t.loginTime, lastActionTime: t.lastActionTime })
    }
  }
  res.status(result.status).json(result);
});

router.post("/logoutall", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.UPDATE]))) return accessDenied(res)
  const service = getDataBaseUserService<UserTokenSchema>()
  await service.clearData(USER_TABLE_NAMES.TOKENS)
  await notifyActiveUsers(SERVER_EVENTS.UPDATE_ACTIVE_USERS)
  events.clear()
  res.status(StatusCodes.OK).json({ success: true });
});

router.post("/", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.CREATE]))) return accessDenied(res)
  const user = req.body;
  if (!user.name || !user.password) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: messages.INVALID_USER_DATA });
  const password = (await hashData(user.password)).data[0]
  const service = getDataBaseUserService<UserSchema>()
  const result = await service.addData(USER_TABLE_NAMES.USERS, {name: user.name, password});
  res.status(result.status).json(result);
});
router.put("/", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.UPDATE]))) return accessDenied(res)
  const user = req.body as UserSchema;
  if (!user.name) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: messages.INVALID_USER_DATA });
  const password = (await hashData(user.password)).data[0]
  const service = getDataBaseUserService<UserSchema>()
  const result = await service.updateData(USER_TABLE_NAMES.USERS, {id: user.id},{name: user.name, password});
  res.status(result.status).json(result);
});
router.delete("/", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id } = req.body as UserSchema;
  const service = getDataBaseUserService<UserSchema>()
  const result = await service.deleteData(USER_TABLE_NAMES.USERS, { id });
  res.status(result.status).json(result);
});

router.get("/", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getUsers()
  res.status(result.status).json(result);
});


router.get(USER_ACTIONS_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.READ]))) return accessDenied(res)
    const result = await getUserLog()
  res.status(result.status).json(result)
});
router.delete(USER_ACTIONS_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.DELETE]))) return accessDenied(res)
    const result = await clearUserLog()
  res.status(result.status).json(result)
});

router.get(ROLES_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.READ]))) return accessDenied(res)
  let result = await getRoles()
  res.status(result.status).json(result)
});

router.post(ROLES_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.CREATE]))) return accessDenied(res)
  const { name } = req.body;
  if (!name) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: messages.INVALID_USER_DATA });
  const result = await addRole({ name });
  res.status(result.status).json(result);
});

router.put(ROLES_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.CREATE]))) return accessDenied(res)
  const { id, name } = req.body as RolesSchema;
  if (!name) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: messages.INVALID_USER_DATA });
  const result = await updateRole({id, name});
  res.status(result.status).json(result);
});

router.delete(ROLES_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id } = req.body;
  if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: messages.INVALID_USER_DATA });
  const result = await deleteRole(id);
  res.status(result.status).json(result);
});


router.get(USER_ROLES_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.READ]))) return accessDenied(res)
  let result = await getUserRoles()
  res.status(result.status).json(result)
});

router.post(USER_ROLES_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.CREATE]))) return accessDenied(res)
  const { roleId, userId } = req.body as UserRolesSchema;
  const result = await addUserRole({ roleId, userId });
  res.status(result.status).json(result);
});

router.put(USER_ROLES_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.CREATE]))) return accessDenied(res)
  const { id, roleId, userId } = req.body as UserRolesSchema;
  const result = await updateUserRole({id, roleId, userId});
  res.status(result.status).json(result);
});

router.delete(USER_ROLES_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id } = req.body;
  if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: messages.INVALID_USER_DATA });
  const result = await deleteUserRole(id);
  res.status(result.status).json(result);
});

async function loginUser(user: User): Promise<Result<UserLoginResult>> {
  const result = await getUsers()
  if (!result.success) return { success: false, status: StatusCodes.NOT_FOUND, data: [] };
  const userList = result.data
  const foundUser = userList.find(u => (user.name === u.name))
  if (!foundUser) return incorrectData(messages.INVALID_USER_DATA)
  if (!bcrypt.compareSync(user.password, foundUser.password)) return incorrectData(messages.INVALID_USER_DATA)
  const roles = (await getUserRolesByUserId(foundUser.id)).map(r => r.roleId)
  const permissions = await getAllUserPermissions(roles)
  const userSessionId = randomUUID()
  const token = randomUUID();
  addUserLog({ userId: foundUser.id, action: Action.LOGIN, time: Date.now() })
  return { success: true, status: StatusCodes.OK, message: messages.LOGIN_SUCCEED, token, data: [{ permissions, roles, userSessionId, name: user.name }] };
}

export async function hasPermission(req: MyRequest, resource: RESOURCE, permissions: PERMISSION[]): Promise<boolean> {
  const roles = req.roles as number[];
  let ok = false; 
  for (let role of roles) {
    const { read: Read, create: Create, update: Update, delete: Delete } = (await getPermissions(role, resource)).data[0] || { read: 0, create: 0, update: 0, delete: 0 }
    ok = ok || permissions.every(p => {
      if (p === PERMISSION.CREATE) return Create
      if (p === PERMISSION.READ) return Read
      if (p === PERMISSION.UPDATE) return Update
      if (p === PERMISSION.DELETE) return Delete
    })
  }
  return ok
}


function getEventSourceMessage(message: string, comment: string = ""){
  return `data: {"message":"${message}", "comment":"${comment}"}\n\n`
}
