import messages from '../messages.js'
import express from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserService, events, getTokens } from '../services/userService.js';
import { accessDenied, hashData, incorrectData } from '../functions.js';
import { ActiveUser, MyRequest, Result, Results, Token, User, UserRoles } from '../../types/server.js';
import { JWT_SECRET, userServiceProvider } from '../options.js';
import { isSuperAdminAtLeast } from '../../functions/user.js';
import { SERVER_EVENTS } from '../../types/enums.js';
import EventEmitter from 'events';

const router = express.Router();
export default router

router.get("/hash", async (req, res) => {
  const result = await hashData(req.query.data as string);
  res.json(result);
});

router.get("/events", async (req: MyRequest, res) => {
  const event = events.set(req.token as string, new EventEmitter()).get(req.token as string) as EventEmitter
  event.removeAllListeners("message")
  event.on("message", (message: SERVER_EVENTS, data: string) => {
    try{
      if (!res.headersSent) res.status(200).json({ success: true, message, data })
    } catch (e) { console.error(e)}
  })
});

router.get("/verify", async (req: MyRequest, res) => {
  const userService = new UserService(userServiceProvider)
  const tokens = await userService.getTokens();
  const result = (tokens.data as Token[]).find((t: Token) => t.token === req.query.token)
  res.json({ success: !!result });
}); 

router.post("/login", async (req, res) => {
  const user = req.body;
  if (!user.name) user.name = "";
  if (!user.password) user.password = "";
  const userService = new UserService(userServiceProvider)
  const result = await loginUser(user);
  if (result.success) userService.addToken({ token: result.data as string, userName: user.name })
  if (result.success) events.forEach(emitter => emitter.emit('message', SERVER_EVENTS.UPDATE_ACTIVE_USERS))
  res.json(result);
});

router.post("/logout", async (req, res) => {
  const user = req.body;
  const userService = new UserService(userServiceProvider)
  const result = await userService.deleteToken(user.token, () => { events.forEach(emitter => emitter.emit('message', SERVER_EVENTS.UPDATE_ACTIVE_USERS)) })
  res.json(result);
});

router.post("/logoutuser", async (req: MyRequest, res) => {
  if (!isSuperAdminAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const user = req.body;
  const userService = new UserService(userServiceProvider)
  const result = await userService.deleteToken(user.usertoken, () => { events.forEach(emitter => emitter.emit('message', SERVER_EVENTS.LOGOUT,  user.usertoken)) })
  res.json(result);
});

router.get("/active", async (req: MyRequest, res) => {
  if (!isSuperAdminAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const userService = new UserService(userServiceProvider)
  const result: Result<ActiveUser[]> = { success: true, status: 200, data: [] }
  const tokens = await getTokens();
  const users = await userService.getUsers();
  tokens.forEach((t: Token) => {
    const user = (users.data as User[]).find((u: User) => u.name === t.username)
    if (user) result.data?.push({ token: t.token, name: user.name, role: user.role, time: t.time })
  })
  res.status(result.status).json(result);
});

router.post("/logoutall", async (req: MyRequest, res) => {
  if (!isSuperAdminAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const userService = new UserService(userServiceProvider)
  userService.clearAllTokens()
  events.forEach(emitter => emitter.emit('message', SERVER_EVENTS.UPDATE_ACTIVE_USERS))
  events.clear()
  res.json({ success: true });
});

router.post("/register", async (req: MyRequest, res) => {
  if (!isSuperAdminAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const user = req.body;
  if (!user.name || !user.password) return res.json({ success: false, errCode: messages.INVALID_USER_DATA });
  const result = await registerUser(user);
  res.json(result);
});

router.get("/users", async (req: MyRequest, res) => {
  if (!isSuperAdminAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const userService = new UserService(userServiceProvider)
  let result = await userService.getUsers()
  res.status(result.status).json(result)
});

async function loginUser(user: User): Promise<Results> {
  const userService = new UserService(userServiceProvider)
  const result = await userService.getUsers()
  if (!result.success) return result;
  const userList = result.data
  const foundUser = (userList as User[]).find(u => (user.name === u.name))
  if (!foundUser) return incorrectData(messages.INVALID_USER_DATA)
  if (!bcrypt.compareSync(user.password, foundUser.password)) return incorrectData(messages.INVALID_USER_DATA)
  const token = jwt.sign({ name: foundUser.name, role: foundUser.role }, JWT_SECRET, { expiresIn: 1440 });
  return { success: true, status: 200, message: messages.LOGIN_SUCCEED, data: token };
}

async function isUserNameExist(name: string) {
  const userService = new UserService(userServiceProvider)
  try {
    return userService.isUserNameExist(name)
  } catch (e) {
    return { success: false, message: messages.SERVER_ERROR };
  }
}

async function registerUser(user: User) {
  const userService = new UserService(userServiceProvider)
  try {
    var result = await userService.registerUser(user)
  } catch (e) {
    return { success: false, message: messages.SERVER_ERROR };
  }
  return result
}
