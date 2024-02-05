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
