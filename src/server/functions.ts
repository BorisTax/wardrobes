import fs from 'fs'
import bcrypt from "bcrypt";
import sqlite3 from "sqlite3";
import messages from './messages.js';
import { Response } from "express"
import { MyRequest, Results, UserRoles } from '../types/server.js';

export function dataBaseQuery(dbFile: string, query: string): Promise<Results>{
    return new Promise((resolve) => {
        const db = new sqlite3.Database(dbFile, (err) => {
            if (err) { resolve({ success: false, message: messages.DATABASE_OPEN_ERROR, error: err }); db.close() }
            db.all(query, (err: Error, rows: []) => {
                if (err) { resolve({ success: false, message: messages.SQL_QUERY_ERROR, error: err }); db.close() }
                else { resolve({success: true, data: rows}) }
                db.close()
            });
        });
    }
    )
}

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
