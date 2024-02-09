import messages from './messages.js'
import path from 'path'
import { fileURLToPath } from 'url';
import express from "express";

import {
  getUsers,
  loginUser,
  registerUser
} from "./users.js";
import { UserRoles } from './options.js';
import { addExtMaterial, deleteExtMaterial, getExtMaterials, getProfiles, updateExtMaterial } from './materials.js';
import { moveFile } from './functions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const router = express.Router();
const activeTokens = new Map()
const expiredInterval = 3600 * 1000
const clearExpiredTokens = () => {
  activeTokens.forEach((v, t) => { if (Date.now() - v.time > expiredInterval) activeTokens.delete(t) })
}
setInterval(clearExpiredTokens, 60000)

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
  activeTokens.delete(user.token)
  res.json({ success: true });
});

router.use((req, res, next) => {
  const user = activeTokens.get(req.body.token)
  if (user) {
    req.userRole = user.role
  }
  next()
})

router.post("/activeUsers", async (req, res) => {
  if (!checkPermissions(req, res, [UserRoles.SUPERADMIN])) return
  const result = []
  activeTokens.forEach((v, token) => result.push({ token, name: v.name, role: v.role }))
  res.json(result);
});

router.post("/logoutall", async (req, res) => {
  if (!checkPermissions(req, res, [UserRoles.SUPERADMIN])) return
  activeTokens.clear()
  res.json({ success: true });
});

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

router.post("/getmaterials", async (req, res) => {
  //if (!checkPermissions(req, res, [UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.MANAGER])) return
  //const baseMaterial = req.body.baseMaterial
  const result = await getExtMaterials();
  res.json(result);
});

router.post("/getprofiles", async (req, res) => {
  //if (!checkPermissions(req, res, [UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.MANAGER])) return
  const result = await getProfiles();
  res.json(result);
});

router.delete("/deletematerial", async (req, res) => {
  if (!checkPermissions(req, res, [UserRoles.SUPERADMIN, UserRoles.ADMIN])) return
  const { name, material } = req.body
  let result
  try {
    result = await deleteExtMaterial(name, material);
  } catch (e) { console.error(e) }
  const status = result.success ? 200 : 404
  res.status(status).json(result);
});

router.post("/addmaterial", async (req, res) => {
  if (!checkPermissions(req, res, [UserRoles.SUPERADMIN, UserRoles.ADMIN])) return
  const { name, material, code1c } = req.body
  const image = req.files.image
  let imageurl = material + " " + name + ".jpg"
  const sourcefile = image ? image.path : ""
  const destfile = path.join(__dirname, 'images/' + imageurl)
  let result = {}
  try {
    result = await moveFile(sourcefile, destfile)
    imageurl = result.copy ? imageurl : ""
    result = await addExtMaterial({name, material, imageurl, code1c});
  } catch (e) { console.error(e) } 
  const status = result.success ? 201 : 409
  res.status(status).json(result);
});

router.put("/updatematerial", async (req, res) => {
  if (!checkPermissions(req, res, [UserRoles.SUPERADMIN, UserRoles.ADMIN])) return
  const { name, material, newName, code1c } = req.body
  const image = req.files.image
  let imageurl = material + " " + name + ".jpg"
  const sourcefile = image ? image.path : ""
  const destfile = path.join(__dirname, 'images/' + imageurl)
  let result = {}
  try {
    result = await moveFile(sourcefile, destfile)
    imageurl = result.copy ? imageurl : ""
    result = await updateExtMaterial({ name, material, newName, imageurl, code1c });
  } catch (e) { console.error(e) }
  res.json(result);
});

const checkPermissions = (req, res, roles) => {
  if (!roles.some(r => r === req.userRole)) {
    res.status(403).json({ success: false, message: messages.ACCESS_DENIED })
    return false
  }
  return true
}
