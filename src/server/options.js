import fs from 'fs'
export const activeTokens = new Map()
const expiredInterval = 3600 * 1000
const clearExpiredTokens = () => {
  activeTokens.forEach((v, t) => { if (Date.now() - v.time > expiredInterval) activeTokens.delete(t) })
}
setInterval(clearExpiredTokens, 60000)

export const userRoleParser = (req, res, next) => {
  const user = activeTokens.get(req.body.token)
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

