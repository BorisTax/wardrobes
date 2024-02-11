import fs from 'fs'
import bcrypt from "bcrypt";
import messages from './messages.js';
import { Request, Response } from "express"
import { MyRequest, UserRoles } from '../types/server.js';

export async function moveFile(sourcefile: string, destfile: string): Promise<{ copy: boolean, delete: boolean }> {
    const result = { copy: false, delete: false }
    return new Promise((resolve) => {
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

export const checkPermissions = (req: MyRequest, res: Response, roles: UserRoles[]) => {
    if (!roles.some(r => r === req.userRole)) {
        res.status(403).json({ success: false, message: messages.ACCESS_DENIED })
        return false
    }
    return true
}

export function hashData(data: string) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(data, 10, (err, hash) => {
            if (err) reject(err);
            else resolve(hash);
        });
    });
}