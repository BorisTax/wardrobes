import fs from 'fs'
import { MyRequest } from '../types/server.js'
import { Response, NextFunction, Request } from "express"
import UserServiceSQLite from './services/userServiceSQLite.js'
import path from 'path'
import { fileURLToPath } from 'url'
import PermissionServiceSQLite from './services/permissionServiceSQLite.js'
import DataBaseServiceSQLite from './services/dataBaseServiceSQLite.js'
import { Template } from '../types/templates.js'
import SettingsServiceSQLite from './services/settingsServiceSQLite.js'

export const JWT_SECRET = "secretkey"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const databaseZipFile = path.resolve(__dirname, 'database.zip')
export const databaseFolder = path.resolve(__dirname, 'database')
export const usersPath = path.resolve(__dirname, 'database/users/users.db')
export const dataPath = path.resolve(__dirname, 'database/wardrobes/data.db')
export const skladPath = path.resolve(__dirname, 'database/sklad/sklad.db')
export const templatePath = path.resolve(__dirname, 'database/wardrobes/templates.db')
export const settingsPath = path.resolve(__dirname, 'database/settings/settings.db')

export function getDataBaseSkladService<T>() {
  return new DataBaseServiceSQLite<T>(skladPath)
}
export function getDataBaseService<T>() {
  return new DataBaseServiceSQLite<T>(dataPath)
}

export function getDataBaseTemplateService() {
  return new DataBaseServiceSQLite<Template>(templatePath)
}
export function getSettingsService() {
  return new SettingsServiceSQLite(settingsPath)
}
export function getUserService(){
  return new UserServiceSQLite(usersPath)
}
export function getPermissionService(){
  return new PermissionServiceSQLite(usersPath)
}
export const userRoleParser = async (req: Request, res: Response, next: NextFunction) => {
  const userService = getUserService()
  let token = req.cookies.token as string
  (req as MyRequest).token = token
  await userService.updateToken(token)
  const user = await userService.getUser(token)
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

