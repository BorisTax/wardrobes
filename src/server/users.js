import messages from './messages.js'
import { dbOptions } from "./options.js";
import { UserService } from './userService.js'
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserServiceSQLite from "./userServiceSQLite.js";

const userServiceProvider = new UserServiceSQLite('./database.db')


export async function loginUser(user) {
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

export async function getUsers() {
  const userService = new UserService(userServiceProvider)
  let userList
  try {
    userList = await userService.getUsers()
  } catch (e) {
    return { success: false, message: messages.SERVER_ERROR };
  }
  return userList
}

export async function isUserNameExist(name) {
  const userService = new UserService(userServiceProvider)
  try {
    return userService.isUserNameExist(name)
  } catch (e) {
    return { success: false, message: messages.SERVER_ERROR };
  }
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
