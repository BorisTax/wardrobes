import messages from '../messages.js'
import express from "express";
import bcrypt from 'bcrypt';
import { UserService, events, getTokens, logoutUser, notifyActiveUsers } from '../services/userService.js';
import { accessDenied, hashData, incorrectData } from '../functions/database.js';
import { MyRequest, Result, Token } from '../../types/server.js';
import { ActiveUser, PERMISSION, User, UserLoginResult } from "../../types/user.js";
import {  userServiceProvider } from '../options.js';
import { SERVER_EVENTS } from "../../types/enums.js";
import { RESOURCE } from '../../types/user.js';
import { StatusCodes } from 'http-status-codes';
import { getAllUserPermissions, getPermissions } from './permissions.js';
import { randomUUID } from 'crypto';

const router = express.Router();
export default router

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
  const userService = new UserService(userServiceProvider)
  const tokens = await userService.getTokens();
  const tokenData = (tokens.data as Token[]).find((t: Token) => t.token === token)
  if (!tokenData) return res.json({ success: false });
  const roleId = await userService.getUserRoleId(tokenData?.userName)
  const permissions = await getAllUserPermissions(roleId)
  const result = await userService.updateToken(token)
  notifyActiveUsers(SERVER_EVENTS.UPDATE_ACTIVE_USERS)
  res.status(result.status).json({ ...result, data: [{ name: tokenData.userName, userId: tokenData.userId, roleId, permissions }], success: true });
});

router.post("/login", async (req, res) => {
  const user = req.body;
  if (!user.name) user.name = "";
  if (!user.password) user.password = "";
  const userService = new UserService(userServiceProvider)
  const result = await loginUser(user);
  const time = Date.now()
  const lastActionTime = time
  if (result.success) {
    userService.addToken({ token: result.token as string, userName: user.name, userId: result.data[0].userId, time, lastActionTime })
    notifyActiveUsers(SERVER_EVENTS.UPDATE_ACTIVE_USERS)
    //const userRoleId = await userService.getUserRoleId(user.name)
    //const permissions = await getAllUserPermissions(userRoleId)
    res.cookie('token', result.token, { httpOnly: true })
  }
  result.token = undefined
  res.status(result.status).json(result);
});

router.post("/logout", async (req, res) => {
  const token = (req as MyRequest).token as string;
  const userService = new UserService(userServiceProvider)
  const result = await userService.deleteToken(token)
  res.cookie('token', "")
  res.status(result.status).json(result);
});

router.post("/logoutuser", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.UPDATE]))) return accessDenied(res)
  const userService = new UserService(userServiceProvider)
  const {userId} = req.body;
  const {token} = await userService.getTokenByUserId(userId)
  const result = await userService.deleteToken(token)
  if(result.success) logoutUser(token)
  res.status(result.status).json(result);
});

router.get("/active", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.READ]))) return accessDenied(res)
  const userService = new UserService(userServiceProvider)
  const result: Result<ActiveUser> = { success: true, status: StatusCodes.OK, data: [] }
  const tokens = await getTokens();
  const users = await userService.getUsers();
  for (let t of tokens){
    const user = (users.data as User[]).find((u: User) => u.name === t.userName)
    if (user) {
      const userRoleId = await userService.getUserRoleId(user.name)
      const role = (await userService.getRoles()).data.find(r => r.id === userRoleId) || { name: "", id: 0 }
      result.data.push({ userId: t.userId, name: user.name, roleId: role.id, time: t.time, lastActionTime: t.lastActionTime })
    }
  }
  res.status(result.status).json(result);
});

router.post("/logoutall", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.UPDATE]))) return accessDenied(res)
  const userService = new UserService(userServiceProvider)
  userService.clearAllTokens()
  notifyActiveUsers(SERVER_EVENTS.UPDATE_ACTIVE_USERS)
  events.clear()
  res.status(StatusCodes.OK).json({ success: true });
});

router.post("/add", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.CREATE]))) return accessDenied(res)
  const userService = new UserService(userServiceProvider)
  const user = req.body;
  if (!user.name || !user.password) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: messages.INVALID_USER_DATA });
  const result = await userService.registerUser(user.name, user.password, user.roleId);
  res.status(result.status).json(result);
});
router.post("/update", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.UPDATE]))) return accessDenied(res)
  const userService = new UserService(userServiceProvider)
  const user = req.body;
  if (!user.name) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: messages.INVALID_USER_DATA });
  const result = await userService.updateUser({userName: user.name, password: user.password, roleId: user.roleId});
  res.status(result.status).json(result);
});
router.delete("/delete", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.DELETE]))) return accessDenied(res)
  const userService = new UserService(userServiceProvider)
  const user = req.body;
  if (!user.name) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: messages.INVALID_USER_DATA });
  const result = await userService.deleteUser(user);
  res.status(result.status).json(result);
});

router.get("/users", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.READ]))) return accessDenied(res)
  const userService = new UserService(userServiceProvider)
  const users = (await userService.getUsers()).data
  const roles = (await userService.getRoles()).data
  const result = []
  for(let u of users){
    const userRoleId = await userService.getUserRoleId(u.name)
    const role = roles.find(r => r.id === userRoleId) || { name: "", id: 0 }
    result.push({ name: u.name, roleId: role.id })
  }
  res.status(StatusCodes.OK).json({ success: true, data: result })
});

router.get("/roles", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.READ]))) return accessDenied(res)
  const userService = new UserService(userServiceProvider)
  let result = await userService.getRoles()
  res.status(result.status).json(result)
});

router.post("/addRole", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.CREATE]))) return accessDenied(res)
  const userService = new UserService(userServiceProvider)
  const { name } = req.body;
  if (!name) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: messages.INVALID_USER_DATA });
  const result = await userService.addRole(name);
  res.status(result.status).json(result);
});

router.delete("/deleteRole", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.DELETE]))) return accessDenied(res)
  const userService = new UserService(userServiceProvider)
  const { id } = req.body;
  if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: messages.INVALID_USER_DATA });
  const result = await userService.deleteRole(id);
  res.status(result.status).json(result);
});

async function loginUser(user: User): Promise<Result<UserLoginResult>> {
  const userService = new UserService(userServiceProvider)
  const result = await userService.getUsers()
  if (!result.success) return { success: false, status: StatusCodes.NOT_FOUND, data: [] };
  const userList = result.data
  const foundUser = (userList as User[]).find(u => (user.name === u.name))
  if (!foundUser) return incorrectData(messages.INVALID_USER_DATA)
  if (!bcrypt.compareSync(user.password, foundUser.password)) return incorrectData(messages.INVALID_USER_DATA)
  const userRoleId = await userService.getUserRoleId(foundUser.name)
  const permissions = await getAllUserPermissions(userRoleId)
  const userId = randomUUID()
  const token = randomUUID();
  return { success: true, status: StatusCodes.OK, message: messages.LOGIN_SUCCEED, token, data: [{ permissions, roleId: userRoleId, userId, name: user.name }] };
}

export async function hasPermission(req: MyRequest, resource: RESOURCE, permissions: PERMISSION[]): Promise<boolean>{
  const userRoleId = req.userRoleId as number;
  const { read: Read, create: Create, update: Update, delete: Delete } = (await getPermissions(userRoleId, resource)).data[0] ||{ read: 0, create: 0, update: 0, delete: 0 }
  return permissions.every(p => {
    if (p === PERMISSION.CREATE) return Create
    if (p === PERMISSION.READ) return Read
    if (p === PERMISSION.UPDATE) return Update
    if (p === PERMISSION.DELETE) return Delete
  })
}