import messages from './messages.js'
import { UserService } from './userService.js'

import MaterialServiceSQLite from "./materialServiceSQLite.js";
import { MaterialService } from './materialService.js';

const materialServiceProvider = new MaterialServiceSQLite('./database.db')

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
export async function addExtMaterial({ name, material, imageurl, code1c }) {
  const materialService = new MaterialService(materialServiceProvider)
  let materials
  try {
    materials = await materialService.getExtMaterials()
    if (materials.find(m => m.name === name && m.material === material)) return { success: false, message: messages.MATERIAL_EXIST }
    await materialService.addExtMaterial({ name, material, imageurl, code1c })
  } catch (e) {
    return { success: false, message: messages.SERVER_ERROR };
  }
  return { success: true }
}
export async function updateExtMaterial({ name, material, newName, imageurl, code1c }) {
  const materialService = new MaterialService(materialServiceProvider)
  let materials
  try {
    materials = await materialService.getExtMaterials()
    if (!materials.find(m => m.name === name && m.material === material)) return { success: false, message: messages.MATERIAL_NO_EXIST }
    await materialService.updateExtMaterial({ name, material, newName, imageurl, code1c })
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


export async function registerUser(user) {
  const userService = new UserService(userServiceProvider)
  try {
    var result = await userService.registerUser(user)
  } catch (e) {
    return { success: false, message: messages.SERVER_ERROR };
  }
  return result
}
