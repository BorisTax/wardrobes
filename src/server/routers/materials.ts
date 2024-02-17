import messages from '../messages.js'
import path from 'path'
import { fileURLToPath } from 'url';
import express from "express";
import { checkPermissions, moveFile } from '../functions.js';
import { MaterialService } from '../services/materialService.js';
import { MyRequest, UserRoles } from '../../types/server.js';
import { ExtMaterial, ExtNewMaterial } from '../../types/materials.js';
import { materialServiceProvider } from '../options.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
export default router

router.post("/list", async (req, res) => {
  const result = await getExtMaterials();
  if (!result.success) return res.json(result)
  res.json(result.materials);
});

router.post("/profiles", async (req, res) => {
  const result = await getProfiles();
  if (!result.success) return res.json(result)
  res.json(result.profiles);
});

router.delete("/delete", async (req, res) => {
  if (!checkPermissions(req, res, [UserRoles.SUPERADMIN, UserRoles.ADMIN])) return
  const { name, material } = req.body
  let result
  result = await deleteExtMaterial(name, material);
  const status = result.success ? 200 : 404
  res.status(status).json(result);
});

router.post("/add", async (req: MyRequest, res) => {
  if (!checkPermissions(req, res, [UserRoles.SUPERADMIN, UserRoles.ADMIN])) return
  const { name, material, code } = req.body
  const image = req.files?.image
  let imageurl = material + " " + name + ".jpg"
  const sourcefile = image ? image.path : ""
  const destfile = path.join(__dirname, '../database/images/' + imageurl)
  const moveResult: { copy: boolean, delete: boolean } = await moveFile(sourcefile, destfile)
  imageurl = moveResult.copy ? imageurl : ""
  const result = await addExtMaterial({ name, material, image: imageurl, code });
  const status = result.success ? 201 : 409
  res.status(status).json(result);
});

router.put("/update", async (req: MyRequest, res) => {
  if (!checkPermissions(req, res, [UserRoles.SUPERADMIN, UserRoles.ADMIN])) return
  const { name, material, newName, code } = req.body
  const image = req.files?.image

  let imageurl = material + " " + name + ".jpg"
  const sourcefile = image ? image.path : ""
  const destfile = path.join(__dirname, '../database/images/' + imageurl)
  const moveResult: { copy: boolean, delete: boolean } = await moveFile(sourcefile, destfile)
  imageurl = moveResult.copy ? imageurl : ""
  const result = await updateExtMaterial({ name, material, newName, image: imageurl, code });
  res.json(result);
});

export async function getExtMaterials() {
  const materialService = new MaterialService(materialServiceProvider)
  const result = await materialService.getExtMaterials()
  if (!result) return result
  return { success: true, materials: result.data }
}

export async function addExtMaterial({ name, material, image, code }: ExtMaterial) {
  const materialService = new MaterialService(materialServiceProvider)
  const result = await materialService.getExtMaterials()
  if (!result.success) return result
  const materials = result.data
  if ((materials as ExtMaterial[]).find(m => m.name === name && m.material === material)) return { success: false, message: messages.MATERIAL_EXIST }
  const res = await materialService.addExtMaterial({ name, material, image, code })
  if (!res.success) return res
  return { success: true }
}

export async function updateExtMaterial({ name, material, newName, image, code }: ExtNewMaterial) {
  const materialService = new MaterialService(materialServiceProvider)
  const result = await materialService.getExtMaterials()
  if (!result.success) return result
  const materials = result.data
  if (!(materials as ExtMaterial[]).find(m => m.name === name && m.material === material)) return { success: false, message: messages.MATERIAL_NO_EXIST }
  const res = await materialService.updateExtMaterial({ name, material, newName, image, code })
  if (!res.success) return res
  return { success: true }
}

export async function deleteExtMaterial(name: string, material: string) {
  const materialService = new MaterialService(materialServiceProvider)
  const result = await materialService.getExtMaterials()
  if (!result.success) return result
  const materials = result.data
  if (!(materials as ExtMaterial[]).find(m => m.name === name && m.material === material)) return { success: false, message: messages.MATERIAL_NO_EXIST }
  const res = await materialService.deleteExtMaterial(name, material)
  if (!res.success) return res
  return { success: true }
}
export async function getProfiles() {
  const materialService = new MaterialService(materialServiceProvider)
  const result = await materialService.getProfiles()
  if (!result) return result
  return { success: true, profiles: result.data }
}
