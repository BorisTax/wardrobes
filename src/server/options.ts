import fs from 'fs'
import { MyRequest } from '../types/server.js'
import { Response, NextFunction, Request } from "express"
import { getTokenData, getUserByToken, getUserRolesByUserId, updateToken } from './routers/functions/users.js'
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
export const modulePath = path.resolve(__dirname, 'database/modules/module.db')
export const templatePath = path.resolve(__dirname, 'database/wardrobes/templates.db')
export const settingsPath = path.resolve(__dirname, 'database/settings/settings.db')

export function getDataBaseModuleService<T>() {
  return new DataBaseServiceSQLite<T>(modulePath)
}
export function getDataBaseSkladService<T>() {
  return new DataBaseServiceSQLite<T>(skladPath)
}
export function getDataBaseUserService<T>() {
  return new DataBaseServiceSQLite<T>(usersPath)
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

export function getPermissionService(){
  return new PermissionServiceSQLite(usersPath)
}
export const userRoleParser = async (req: Request, res: Response, next: NextFunction) => {
  let token = req.cookies.token as string
  (req as MyRequest).token = token
  const tokenData = await getTokenData(token)
  const user = await getUserByToken(token)
  if (user) {
    await updateToken(tokenData)
    const roles = (await getUserRolesByUserId(user.id)).map(r => r.roleId);
    (req as MyRequest).roles = roles
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

