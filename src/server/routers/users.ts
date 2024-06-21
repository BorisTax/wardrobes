import messages from '../messages.js'
import express from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserService, events, getTokens, logoutUser, notifyActiveUsers } from '../services/userService.js';
import { accessDenied, hashData, incorrectData } from '../functions/other.js';
import { MyRequest, Result, Token } from '../../types/server.js';
import { ActiveUser, PERMISSION, User, UserData } from "../../types/user.js";
import { JWT_SECRET, userServiceProvider } from '../options.js';
import EventEmitter from 'events';
import { SERVER_EVENTS } from "../../types/enums.js";
import { RESOURCE } from '../../types/user.js';
import { UserState } from '../../atoms/users.js';

const router = express.Router();
export default router

router.get("/hash", async (req, res) => {
  const result = await hashData(req.query.data as string);
  res.json(result);
});

router.get("/standby", async (req, res) => {
  const token = (req as MyRequest).token as string;
  const userService = new UserService(userServiceProvider)
  const result = await userService.updateToken(token)
  res.json(result);
});

router.get("/events", async (req, res) => {
  const token = (req as MyRequest).token as string;
  const event = events.set(token, new EventEmitter()).get(token) as EventEmitter
  event.removeAllListeners("message")
  event.on("message", (message: SERVER_EVENTS, data: string) => {
    try{
      if (!res.headersSent) res.status(200).json({ success: true, message, data })
    } catch (e) { console.error(e)}
  })
});

router.get("/verify", async (req, res) => {
  const token = (req as MyRequest).token as string;
  const userService = new UserService(userServiceProvider)
  const tokens = await userService.getTokens();
  const result = (tokens.data as Token[]).find((t: Token) => t.token === token)
  res.json({ success: !!result });
});

router.post("/login", async (req, res) => {
  const user = req.body;
  if (!user.name) user.name = "";
  if (!user.password) user.password = "";
  const userService = new UserService(userServiceProvider)
  const result = await loginUser(user);
  const time = Date.now()
  const lastActionTime = time
  if (result.success) userService.addToken({ token: result.data as string, username: user.name, time, lastActionTime })
  if (result.success) notifyActiveUsers()
  res.json(result);
});

router.post("/logout", async (req, res) => {
  const user = req.body;
  const userService = new UserService(userServiceProvider)
  const result = await userService.deleteToken(user.token)
  res.json(result);
});

router.post("/logoutuser", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.UPDATE]))) return accessDenied(res)
  const userService = new UserService(userServiceProvider)
  const user = req.body;
  const result = await userService.deleteToken(user.usertoken, () => { logoutUser(user.usertoken) })
  res.json(result);
});

router.get("/active", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.READ]))) return accessDenied(res)
  const userService = new UserService(userServiceProvider)
  const result: Result<ActiveUser[]> = { success: true, status: 200, data: [] }
  const tokens = await getTokens();
  const users = await userService.getUsers();
  for (let t of tokens){
    const user = (users.data as User[]).find((u: User) => u.name === t.username)
    if (user) {
      const userRole = await userService.getUserRole(user.name)
      const role = (await userService.getRoles()).data?.find(r => r.name === userRole) || { name: "" }
      result.data?.push({ token: t.token, name: user.name, role, time: t.time, lastActionTime: t.lastActionTime })
    }
  }
  res.status(result.status).json(result);
});

router.post("/logoutall", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.UPDATE]))) return accessDenied(res)
  const userService = new UserService(userServiceProvider)
  userService.clearAllTokens()
  notifyActiveUsers()
  events.clear()
  res.json({ success: true });
});

router.post("/add", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.CREATE]))) return accessDenied(res)
  const userService = new UserService(userServiceProvider)
  const user = req.body;
  if (!user.name || !user.password) return res.status(400).json({ success: false, message: messages.INVALID_USER_DATA });
  const result = await userService.registerUser(user.name, user.password, user.role);
  res.json(result);
});

router.delete("/delete", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.REMOVE]))) return accessDenied(res)
  const userService = new UserService(userServiceProvider)
  const user = req.body;
  if (!user.name) return res.status(400).json({ success: false, message: messages.INVALID_USER_DATA });
  const result = await userService.deleteUser(user);
  res.json(result);
});

router.get("/users", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.READ]))) return accessDenied(res)
  const userService = new UserService(userServiceProvider)
  const users = (await userService.getUsers()).data || []
  const roles = (await userService.getRoles()).data || []
  const result: UserData[] = []
  for(let u of users){
    const userRole = await userService.getUserRole(u.name)
    const role = roles.find(r => r.name === userRole) || { name: "" }
    const permissions = await userService.getAllUserPermissions(userRole)
    result.push({ name: u.name, role, permissions })
  }
  res.status(200).json({ success: true, data: result })
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
  if (!name) return res.status(400).json({ success: false, message: messages.INVALID_USER_DATA });
  const result = await userService.addRole(name);
  res.json(result);
});

router.delete("/deleteRole", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.REMOVE]))) return accessDenied(res)
  const userService = new UserService(userServiceProvider)
  const { name } = req.body;
  if (!name) return res.status(400).json({ success: false, message: messages.INVALID_USER_DATA });
  const result = await userService.deleteRole(name);
  res.json(result);
});

async function loginUser(user: User): Promise<Result<string | null>> {
  const userService = new UserService(userServiceProvider)
  const result = await userService.getUsers()
  if (!result.success) return { success: false, status: 404, data: null };
  const userList = result.data
  const foundUser = (userList as User[]).find(u => (user.name === u.name))
  if (!foundUser) return incorrectData(messages.INVALID_USER_DATA)
  if (!bcrypt.compareSync(user.password, foundUser.password)) return incorrectData(messages.INVALID_USER_DATA)
  const userRole = await userService.getUserRole(foundUser.name)
  const role = (await userService.getRoles()).data?.find(r => r.name === userRole) || ""
  const permissions = await userService.getAllUserPermissions(userRole)
  const token = jwt.sign({ name: foundUser.name, role, permissions }, JWT_SECRET, { expiresIn: 1440 });
  return { success: true, status: 200, message: messages.LOGIN_SUCCEED, data: token };
}


export async function hasPermission(req: MyRequest, resource: RESOURCE, permissions: PERMISSION[]): Promise<boolean>{
  const userRole = req.userRole as string;
  const userService = new UserService(userServiceProvider)
  const { read, create, update, remove } = (await userService.getPermissions(userRole, resource))
  return permissions.every(p => {
    if (p === PERMISSION.CREATE) return create
    if (p === PERMISSION.READ) return read
    if (p === PERMISSION.UPDATE) return update
    if (p === PERMISSION.REMOVE) return remove
  })
}