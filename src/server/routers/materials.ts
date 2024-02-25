import messages from '../messages.js'
import path from 'path'
import { fileURLToPath } from 'url';
import express from "express";
import { accessDenied, checkPermissions, moveFile } from '../functions/other.js';
import { MaterialService } from '../services/materialService.js';
import { MyRequest, Results, UserRoles } from '../types/server.js';
import { ExtMaterial, ExtNewMaterial, NewProfile, Profile } from '../types/materials.js';
import { materialServiceProvider } from '../options.js';
import { isAdminAtLeast } from '../functions/user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
export default router

router.get("/profiles", async (req, res) => {
  const result = await getProfiles();
  if (!result.success) return res.json(result)
  res.status(result.status).json(result);
});
router.delete("/profile", async (req: MyRequest, res) => {
  if (!isAdminAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { name, type } = req.body
  let result
  result = await deleteProfile(name, type);
  const status = result.success ? 200 : 404
  res.status(status).json(result);  
});

router.post("/profile", async (req: MyRequest, res) => {
  if (!isAdminAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { name, type, code } = req.body
  const result = await addProfile({ name, type, code });
  const status = result.success ? 201 : 409
  res.status(status).json(result);
});

router.put("/profile", async (req: MyRequest, res) => {
  if (!isAdminAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { name, type, newName, code } = req.body
  const result = await updateProfile({ name, type, newName, code });
  res.status(result.status).json(result);
});


router.get("/materials", async (req, res) => {
  const result = await getExtMaterials();
  if (!result.success) return res.sendStatus(result.status)
  res.status(result.status).json(result);
});

router.delete("/material", async (req: MyRequest, res) => {
  if (!isAdminAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { name, material } = req.body
  const result = await deleteExtMaterial(name, material);
  res.status(result.status).json(result)
});

router.post("/material", async (req: MyRequest, res) => {
  if (!isAdminAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { name, material, code } = req.body
  const image = req.files?.image
  let imageurl = material + " " + name + ".jpg"
  const sourcefile = image ? image.path : ""
  const destfile = path.join(__dirname, '../database/images/' + imageurl)
  const moveResult: { copy: boolean, delete: boolean } = await moveFile(sourcefile, destfile)
  imageurl = moveResult.copy ? imageurl : ""
  const result = await addExtMaterial({ name, material, image: imageurl, code });
  res.sendStatus(result.status)
});

router.put("/material", async (req: MyRequest, res) => {
  if (!isAdminAtLeast(req.userRole as UserRoles)) return accessDenied(res)
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
  return await materialService.getExtMaterials()
}

export async function addExtMaterial({ name, material, image, code }: ExtMaterial) {
  const materialService = new MaterialService(materialServiceProvider)
  const result = await materialService.getExtMaterials()
  if (!result.success) return result
  const materials = result.data
  if ((materials as ExtMaterial[]).find(m => m.name === name && m.material === material)) return { success: false, status: 409, message: messages.MATERIAL_EXIST }
  return await materialService.addExtMaterial({ name, material, image, code })
}

export async function updateExtMaterial({ name, material, newName, image, code }: ExtNewMaterial) {
  const materialService = new MaterialService(materialServiceProvider)
  const result = await materialService.getExtMaterials()
  if (!result.success) return result
  const materials = result.data
  if (!(materials as ExtMaterial[]).find(m => m.name === name && m.material === material)) return { success: false, status: 404, message: messages.MATERIAL_NO_EXIST }
  return await materialService.updateExtMaterial({ name, material, newName, image, code })
}

export async function deleteExtMaterial(name: string, material: string) {
  const materialService = new MaterialService(materialServiceProvider)
  const result = await materialService.getExtMaterials()
  if (!result.success) return result
  const materials = result.data
  if (!(materials as ExtMaterial[]).find(m => m.name === name && m.material === material)) return { success: false, status: 404, message: messages.MATERIAL_NO_EXIST }
  return await materialService.deleteExtMaterial(name, material)
}



export async function getProfiles() {
  const materialService = new MaterialService(materialServiceProvider)
  return await materialService.getProfiles()
}

export async function addProfile({ name, type, code }: Profile) {
  const materialService = new MaterialService(materialServiceProvider)
  const result = await materialService.getProfiles()
  if (!result.success) return result
  const profiles = result.data
  if ((profiles as Profile[]).find(m => m.name === name && m.type === type)) return { success: false, status: 409, message: messages.PROFILE_EXIST }
  return await materialService.addProfile({ name, type, code })
}

export async function updateProfile({ name, newName, type, code }: NewProfile) {
  const materialService = new MaterialService(materialServiceProvider)
  const result = await materialService.getProfiles()
  if (!result.success) return result
  const profiles = result.data
  if (!(profiles as Profile[]).find(m => m.name === name && m.type === type)) return { success: false, status: 404, message: messages.PROFILE_NO_EXIST }
  return await materialService.updateProfile({ name, type, newName, code })
}

export async function deleteProfile(name: string, type: string) {
  const materialService = new MaterialService(materialServiceProvider)
  const result = await materialService.getProfiles()
  if (!result.success) return result
  const profiles = result.data
  if (!(profiles as Profile[]).find(m => m.name === name && m.type === type)) return { success: false, status: 404, message: messages.PROFILE_NO_EXIST }
  return await materialService.deleteProfile(name, type)
}