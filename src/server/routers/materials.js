import messages from '../messages.js'
import path from 'path'
import { fileURLToPath } from 'url';
import express from "express";

import { UserRoles } from '../options.js';
import { moveFile } from '../functions.js';
import MaterialServiceSQLite from "../services/materialServiceSQLite.js";
import { MaterialService } from '../services/materialService.js';

const materialServiceProvider = new MaterialServiceSQLite('./database/database.db')

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
export default router

router.post("/list", async (req, res) => {
  //if (!checkPermissions(req, res, [UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.MANAGER])) return
  //const baseMaterial = req.body.baseMaterial
  const result = await getExtMaterials();
  res.json(result);
});

router.post("/profiles", async (req, res) => {
  //if (!checkPermissions(req, res, [UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.MANAGER])) return
  const result = await getProfiles();
  res.json(result);
});

router.delete("/delete", async (req, res) => {
  if (!checkPermissions(req, res, [UserRoles.SUPERADMIN, UserRoles.ADMIN])) return
  const { name, material } = req.body
  let result
  try {
    result = await deleteExtMaterial(name, material);
  } catch (e) { console.error(e) }
  const status = result.success ? 200 : 404
  res.status(status).json(result);
});

router.post("/add", async (req, res) => {
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
    result = await addExtMaterial({name, material, imageurl, code});
  } catch (e) { console.error(e) } 
  const status = result.success ? 201 : 409
  res.status(status).json(result);
});

router.put("/update", async (req, res) => {
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
    result = await updateExtMaterial({ name, material, newName, imageurl, code });
  } catch (e) { console.error(e) }
  res.json(result);
});



export async function getExtMaterials() {
  const materialService = new MaterialService(materialServiceProvider)
  let materials
  try {
    materials = await materialService.getExtMaterials()
  } catch (e) {
    return { success: false, message: messages.SERVER_ERROR };
  }
  return { success: true, materials }
}

export async function addExtMaterial({ name, material, imageurl, code }) {
  const materialService = new MaterialService(materialServiceProvider)
  let materials
  try {
    materials = await materialService.getExtMaterials()
    if (materials.find(m => m.name === name && m.material === material)) return { success: false, message: messages.MATERIAL_EXIST }
    await materialService.addExtMaterial({ name, material, imageurl, code })
  } catch (e) {
    return { success: false, message: messages.SERVER_ERROR };
  }
  return { success: true }
}
export async function updateExtMaterial({ name, material, newName, imageurl, code }) {
  const materialService = new MaterialService(materialServiceProvider)
  let materials
  try {
    materials = await materialService.getExtMaterials()
    if (!materials.find(m => m.name === name && m.material === material)) return { success: false, message: messages.MATERIAL_NO_EXIST }
    await materialService.updateExtMaterial({ name, material, newName, imageurl, code })
  } catch (e) {
    return { success: false, message: messages.SERVER_ERROR };
  }
  return { success: true }
}
export async function deleteExtMaterial(name, material) {
  const materialService = new MaterialService(materialServiceProvider)
  let materials
  try {
    materials = await materialService.getExtMaterials()
    if (!materials.find(m => m.name === name && m.material === material)) return { success: false, message: messages.MATERIAL_NO_EXIST }
    await materialService.deleteExtMaterial(name, material)
  } catch (e) {
    return { success: false, message: messages.SERVER_ERROR };
  }
  return { success: true }
}
export async function getProfiles() {
  const materialService = new MaterialService(materialServiceProvider)
  let profiles
  try {
    profiles = await materialService.getProfiles()
  } catch (e) {
    return { success: false, message: messages.SERVER_ERROR };
  }
  return { success: true, profiles }
}
