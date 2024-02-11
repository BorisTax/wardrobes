import messages from '../messages.js'
import express from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRoles, userServiceProvider } from '../options.js';
import { UserService } from '../services/userService.js';
import { checkPermissions } from '../functions.js';

const router = express.Router();
export default router

router.post("/login", async (req, res) => {
  const user = req.body;
  if (!user.name) user.name = "";
  if (!user.password) user.password = "";
  const userService = new UserService(userServiceProvider)
  const result = await loginUser(user);
  if (result.success) userService.addToken({token: result.token, username: user.name})
  //res.cookie('token',result.token,{httpOnly:false})
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
  const result = []
  const tokens = await userService.getTokens()
  const users = await userService.getUsers()
  tokens.forEach(t => {
    const user = users.find(u => u.name === t.username)
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
  result = await registerUser(user);
  res.json(result);
});

router.post("/userlist", async (req, res) => {
  let result
  if (!checkPermissions(req, res, [UserRoles.SUPERADMIN])) return
  result = (await getUsers()).map(u => ({ name: u.name, role: u.role }));
  res.json(result);
});


async function loginUser(user) {
  let message = messages.LOGIN_SUCCEED
  const userService = new UserService(userServiceProvider)
  var userList
  try {
    userList = await userService.getUsers()
  } catch (e) {
    return { success: false, message: messages.SERVER_ERROR };
  }
  const foundUser = userList.find(u => (user.name === u.name))
  if (!foundUser) return { success: false, message: messages.INVALID_USER_DATA };
  if (!bcrypt.compareSync(user.password, foundUser.password)) return { success: false, message: messages.INVALID_USER_DATA };
  const token = jwt.sign({ name: foundUser.name, role: foundUser.role }, "secretkey", { expiresIn: 1440 });
  return { success: true, message, token, name: foundUser.name, role: foundUser.role };
}

async function getUsers() {
  const userService = new UserService(userServiceProvider)
  let userList
  try {
    userList = await userService.getUsers()
  } catch (e) {
    return { success: false, message: messages.SERVER_ERROR };
  }
  return userList
}

async function isUserNameExist(name) {
  const userService = new UserService(userServiceProvider)
  try {
    return userService.isUserNameExist(name)
  } catch (e) {
    return { success: false, message: messages.SERVER_ERROR };
  }
}

async function registerUser(user) {
  const userService = new UserService(userServiceProvider)
  try {
    var result = await userService.registerUser(user)
  } catch (e) {
    return { success: false, message: messages.SERVER_ERROR };
  }
  return result
}
