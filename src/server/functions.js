import { hashData } from "./services/userService.js";
import fs from 'fs'
import multiparty from 'multiparty'
hashData("manager123").then(p => console.log(p))

export async function moveFile(sourcefile, destfile) {
    const result = { copy: false, delete: false }
    return new Promise((resolve, reject) => {
        fs.copyFile(sourcefile, destfile, function (err) {
            if (err) resolve(result); else {
                result.copy = true
                fs.unlink(sourcefile, (err) => {
                    if (err) resolve(result); else {
                        result.delete = true
                        resolve(result)
                    }
                })
            }
        })
    })
}
export async function getParams(req) {
    const form = new multiparty.Form();
    return new Promise((resolve, reject) => {
        form.parse(req, function (err, fields, files) {
            if (err) reject(err); else resolve({ fields, files })
        });
    })
}

export const checkPermissions = (req, res, roles) => {
    if (!roles.some(r => r === req.userRole)) {
      res.status(403).json({ success: false, message: messages.ACCESS_DENIED })
      return false
    }
    return true
  }