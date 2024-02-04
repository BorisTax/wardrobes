import messages from './messages.js'
import { dbOptions } from "./options.js";
import { UserService } from './userService.js'
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserServiceSQLite from "./userServiceSQLite.js";

const userServiceProvider = new UserServiceSQLite('./users.db')


export async function loginUser(user) {
  let message = messages.LOGIN_SUCCEED
  const userService = new UserService(userServiceProvider)
  var userList
  try{
    userList = await userService.getUsers()
  }catch(e){
    return { success: false, message: messages.SERVER_ERROR};
  }
  const foundUser = userList.find(u => (user.name === u.name || user.name === u.email))
  if(!foundUser) return { success: false, message: messages.INVALID_USER_DATA};
  if (!bcrypt.compareSync(user.password, foundUser.password)) return { success: false, message: messages.INVALID_USER_DATA};
  const token = jwt.sign({ name: foundUser.name, activated:foundUser.activated }, "secretkey", {expiresIn: 1440});
  return { success: true, message, token};
}

export async function getUsers() {
  const userService = new UserService(userServiceProvider)
  let userList
  try{
    userList = await userService.getUsers()
  }catch(e){
    return { success: false, message: messages.SERVER_ERROR};
  }
  return userList
}

export async function isUserNameExist(name){
  const userService = new UserService(userServiceProvider)
  try{
    return userService.isUserNameExist(name)
  }catch(e){
    return { success: false, message: messages.SERVER_ERROR };
  }
}


export async function activate(userName, code) {
  const userService = new UserService(userServiceProvider)
  try{
    const result = await userService.activateUser(userName, code)
    return result;
  }catch(e){
    return { success: false, message: messages.SERVER_ERROR };
  }
}

export async function registerUser(user) {
  const userService = new UserService(userServiceProvider)
  try{
    var result = await userService.registerUser(user)
  }catch(e){
    return { success: false, message: messages.SERVER_ERROR };
  }

  //if(result.message === messages.USER_EMAIL_NOT_EXIST) {result.success = true; result.message = messages.REG_SUCCEED}
  if(result.success) await sendMail(user.email, result.activationCode);
  return result
}
