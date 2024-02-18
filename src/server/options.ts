import fs from 'fs'
import { UserService } from './services/userService.js'
import { MyRequest, RequestBody, Results, Token } from '../types/server.js'
import { Response, NextFunction } from "express"
import UserServiceSQLite from './services/userServiceSQLite.js'
import MaterialServiceSQLite from './services/materialServiceSQLite.js'
import path from 'path'
import { fileURLToPath } from 'url'
import PriceServiceSQLite from './services/priceServiceSQLite.js'

export const JWT_SECRET = "secretkey"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersPath = path.resolve(__dirname, 'database/users.db')
const databasePath = path.resolve(__dirname, 'database/database.db')
const pricePath = path.resolve(__dirname, 'database/prices.db')
export const userServiceProvider = new UserServiceSQLite(usersPath)
export const materialServiceProvider = new MaterialServiceSQLite(databasePath)
export const priceServiceProvider = new PriceServiceSQLite(pricePath)

const expiredInterval = 3600 * 24 * 1000
const clearExpiredTokens = () => {
  const userService = new UserService(userServiceProvider)
  const tokens = userService.getTokens()
  tokens.then((tokenList: Results) => {
    if (!tokenList.success) {
      console.error(tokenList)
      return
    }
    (tokenList.data as Token[]).forEach((t: Token) => {
      if (Date.now() - t.time > expiredInterval) userService.deleteToken(t.token)
    })
  })
}
setInterval(clearExpiredTokens, 60000)

export const userRoleParser = async (req: MyRequest, res: Response, next: NextFunction) => {
  const userService = new UserService(userServiceProvider)
  let token = req.query.token as string
  token = (req.body as RequestBody).token || token || ""
  const user = await userService.getUser(token)
  if (user) {
    req.userRole = user.role
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

