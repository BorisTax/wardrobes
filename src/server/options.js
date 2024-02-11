import fs from 'fs'
import UserServiceSQLite from './services/userServiceSQLite.js'
import { UserService } from './services/userService.js'

export const userServiceProvider = new UserServiceSQLite('./database/database.db')

const expiredInterval = 3600 * 1000
const clearExpiredTokens = () => {
  const userService = new UserService(userServiceProvider)
  userService.getTokens().then(tokenList => {
    tokenList.forEach(t => { 
      if (Date.now() - t.time > expiredInterval) userService.deleteToken(t.token) })
  })
}
setInterval(clearExpiredTokens, 60000)

export const userRoleParser = async (req, res, next) => {
  const userService = new UserService(userServiceProvider)
  const user = await userService.getUser(req.body.token)
  if (user) {
    req.userRole = user.role
  }
  next()
}

export const UserRoles = {
  SUPERADMIN: 'SUPERADMIN',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
}
function readFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) reject(err); else resolve(data);
    })
  })
}

