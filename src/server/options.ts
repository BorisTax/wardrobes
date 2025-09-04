import fs from 'fs'
import { UserService } from './services/userService.js'
import { MyRequest, RequestBody } from '../types/server.js'
import { Response, NextFunction, Request } from "express"
import UserServiceSQLite from './services/userServiceSQLite.js'
import path from 'path'
import { fileURLToPath } from 'url'
import PermissionServiceSQLite from './services/permissionServiceSQLite.js'
import DataBaseServiceSQLite from './services/dataBaseServiceSQLite.js'
import { Template } from '../types/templates.js'

export const JWT_SECRET = "secretkey"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const databaseZipFile = path.resolve(__dirname, 'database.zip')
export const databaseFolder = path.resolve(__dirname, 'database')
export const usersPath = path.resolve(__dirname, 'database/users/users.db')
export const dataPath = path.resolve(__dirname, 'database/wardrobes/data.db')
export const templatePath = path.resolve(__dirname, 'database/wardrobes/templates.db')
export const userServiceProvider = new UserServiceSQLite(usersPath)
export const permissionServiceProvider = new PermissionServiceSQLite(usersPath)

export function getDataBaseProvider<T>() {
  return new DataBaseServiceSQLite<T>(dataPath)
}
export function getDataBaseUserProvider<T>() {
  return new DataBaseServiceSQLite<T>(usersPath)
}
export function getDataBaseTemplateProvider() {
  return new DataBaseServiceSQLite<Template>(templatePath)
}
export const userRoleParser = async (req: Request, res: Response, next: NextFunction) => {
  const userService = new UserService(userServiceProvider)
  let token = req.query.token as string
  token = (req.body as RequestBody).token || token || "";
  (req as MyRequest).token = token
  const result = await userService.getUser(token)
  const user = result.data && result.data[0]
  if (user) {
    const roleId = await userService.getUserRoleId(user?.name);
    (req as MyRequest).userRoleId = roleId
  }
  next()
}

function readFile(file: string) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) reject(err); else resolve(data);
    })
  })
}

