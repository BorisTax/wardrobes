import fs from 'fs'
import bcrypt from "bcrypt";
import sqlite3 from "sqlite3";
import messages from './messages.js';
import { Response } from "express"
import { MyRequest, Results, UserRoles } from '../types/server.js';

export function dataBaseQuery(dbFile: string, query: string, { successStatusCode = 200, errorStatusCode = 500, successMessage = messages.NO_ERROR, }): Promise<Results> {
    return new Promise((resolve) => {
        const db = new sqlite3.Database(dbFile, (err) => {
            if (err) { resolve({ success: false, status: errorStatusCode, message: messages.DATABASE_OPEN_ERROR, error: err }); db.close(); return }
            if (!query) { resolve({ success: false, status: errorStatusCode, message: messages.SQL_QUERY_ERROR }); db.close(); return }
            db.all(query, (err: Error, rows: []) => {
                if (err) { resolve({ success: false, status: errorStatusCode, message: messages.SQL_QUERY_ERROR, error: err }); db.close() }
                else { resolve({ success: true, status: successStatusCode, data: rows, message: successMessage }) }
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
    return new Promise((resolve) => {
        bcrypt.hash(data, 10, (err, hash) => {
            if (err) resolve({ success: false, err });
            else resolve({ success: true, data: hash });
        });
    });
}

export function incorrectData(message: string) {
    return { success: false, status: 400, message }
}
export function noExistData(message: string) {
    return { success: false, status: 404, message }
}
export function accessDenied(res: Response) {
    res.status(403).json({ success: false, message: messages.ACCESS_DENIED })
}