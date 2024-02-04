import messages from './messages.js'
import { dbOptions } from "./options.js";
import { UserService } from './userService.js'
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import MaterialServiceSQLite from "./materialServiceSQLite.js";
import { MaterialService } from './materialService.js';

const materialServiceProvider = new MaterialServiceSQLite('./database.db')

export async function getExtMaterials(baseMaterial) {
  const materialService = new MaterialService(materialServiceProvider)
  let matList
  try {
    matList = await materialService.getExtMaterials(baseMaterial)
  } catch (e) {
    return { success: false, message: messages.SERVER_ERROR };
  }
  return matList
}

export async function getProfiles() {
  const materialService = new MaterialService(materialServiceProvider)
  let matList
  try {
    matList = await materialService.getProfiles()
  } catch (e) {
    return { success: false, message: messages.SERVER_ERROR };
  }
  return matList
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
