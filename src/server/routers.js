import messages from './messages.js'
import jwt from 'jsonwebtoken'
//import {captions as ruCaptions} from './locale/ru.js';
//import {captions as uaCaptions} from './locale/ua.js';
import express from "express";
import {
  getUsers,
  loginUser,
  registerUser,
  isUserNameExist
} from "./users.js";
import { UserRoles } from './options.js';
import { getExtMaterials, getProfiles } from './materials.js';

//import { getCaptions } from "./options.js";

//const captions = {"ru": ruCaptions, "ua": uaCaptions}
export const router = express.Router();
const activeTokens = new Map()
const expiredInterval = 3600 * 1000
const clearExpiredTokens = () => {
  activeTokens.forEach((v, t) => { if (Date.now() - v.time > expiredInterval) activeTokens.delete(t) })
}
setInterval(clearExpiredTokens, 60000)

router.post("/activeUsers", async (req, res) => {
  const result = []
  activeTokens.forEach((v, token) => result.push({ token, name: v.name, role: v.role }))
  res.json(result);
});

router.post("/login", async (req, res) => {
  const user = req.body;
  if (!user.name) user.name = "";
  if (!user.password) user.password = "";
  const result = await loginUser(user);
  if (result.success)
    activeTokens.set(result.token, { name: result.name, role: result.role, time: Date.now() })
  //res.cookie('token',result.token,{httpOnly:false})
  res.json(result);
});

router.post("/logout", async (req, res) => {
  const user = req.body;
  const result = activeTokens.delete(user.token)
  res.json({ success: result });
});

router.use((req, res, next) => {
  const user = activeTokens.get(req.body.token)
  if (user) {
    req.userRole = user.role
  }
  next()
})

router.post("/lang", async (req, res) => {
  let lang = req.body.lang;
  const result = captions[lang]
  if (!result) res.sendStatus(500);
  else res.json(result);
});

router.post("/register", async (req, res) => {
  if (!checkPermissions(req, res, [UserRoles.SUPERADMIN])) return
  const user = req.body;
  if (!user.name || !user.password) return res.json({ success: false, errCode: messages.INVALID_USER_DATA });
  result = await registerUser(user);
  res.json(result);
});

router.post("/users", async (req, res) => {
  let result
  if (!checkPermissions(req, res, [UserRoles.SUPERADMIN])) return
  result = (await getUsers()).map(u => ({ name: u.name, role: u.role }));
  res.json(result);
});

router.post("/extmaterials", async (req, res) => {
  if (!checkPermissions(req, res, [UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.MANAGER])) return
  const baseMaterial = req.body.baseMaterial
  const result = await getExtMaterials(baseMaterial);
  res.json(result);
});

router.post("/profiles", async (req, res) => {
  if (!checkPermissions(req, res, [UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.MANAGER])) return
  const result = await getProfiles();
  res.json(result);
});

const checkPermissions = (req, res, roles) => {
  if (!roles.some(r => r === req.userRole)) {
    res.status(403).json({ message: messages.ACCESS_DENIED })
    return false
  }
  return true
}