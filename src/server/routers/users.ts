import messages from '../messages.js'
import express from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/userService.js';
import { checkPermissions, hashData, incorrectData } from '../functions.js';
import { ActiveUser, Results, Token, User, UserRoles } from '../../types/server.js';
import { JWT_SECRET, userServiceProvider } from '../options.js';

const router = express.Router();
export default router

router.get("/hash", async (req, res) => {
  const result = await hashData(req.query.data as string);
  res.json(result);
});

router.post("/login", async (req, res) => {
  const user = req.body;
  if (!user.name) user.name = "";
  if (!user.password) user.password = "";
  const userService = new UserService(userServiceProvider)
  const result = await loginUser(user);
  if (result.success) userService.addToken({ token: result.data as string, userName: user.name })
  res.json(result);
});

router.post("/logout", async (req, res) => {
  const user = req.body;
  const userService = new UserService(userServiceProvider)
  userService.deleteToken(user.token)
  res.json({ success: true });
});

router.post("/active", async (req, res) => {
  if (!checkPermissions(req, res, [UserRoles.SUPERADMIN])) return
  const userService = new UserService(userServiceProvider)
  const result: ActiveUser[] = []
  const tokens = await userService.getTokens();
  const users = await userService.getUsers();
  (tokens.data as Token[]).forEach((t: Token) => {
    const user = (users.data as User[]).find((u: User) => u.name === t.username)
    if (user) result.push({ token: t.token, name: user.name, role: user.role, time: t.time })
  })
  res.json(result);
});

router.post("/logoutall", async (req, res) => {
  if (!checkPermissions(req, res, [UserRoles.SUPERADMIN])) return
  const userService = new UserService(userServiceProvider)
  userService.clearAllTokens()
  res.json({ success: true });
});

router.post("/register", async (req, res) => {
  if (!checkPermissions(req, res, [UserRoles.SUPERADMIN])) return
  const user = req.body;
  if (!user.name || !user.password) return res.json({ success: false, errCode: messages.INVALID_USER_DATA });
  const result = await registerUser(user);
  res.json(result);
});

router.post("/all", async (req, res) => {
  if (!checkPermissions(req, res, [UserRoles.SUPERADMIN])) return
  const userService = new UserService(userServiceProvider)
  let result = await userService.getUsers()
  if (!result.success) return res.json(result)
  const users = result.data
  res.json((users as User[]).map(u => ({ name: u.name, role: u.role })));
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
