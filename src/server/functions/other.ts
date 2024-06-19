import fs from 'fs'
import bcrypt from "bcrypt";
import sqlite3 from "sqlite3";
import messages from '../messages.js';
import { Response } from "express"
import { MyRequest, Result } from '../../types/server.js';
import { UserRoles } from "../../types/user.js";

export enum MAT_TABLE_NAMES {
    MATERIALS = 'materials',
    EXTMATERIALS = 'extmaterials',
    PROFILE_COLORS = 'profilecolors',
    BRUSH = 'brush',
    EDGE = 'edge',
    TREMPEL = 'trempel',
    ZAGLUSHKA = 'zaglushka',
    UPLOTNITEL = 'uplotnitel'
}

export enum SPEC_TABLE_NAMES {
    PRICELIST = 'pricelist',
    MATERIALS = 'materials',
    UNITS = 'units',
    WARDROBES = 'wardrobes',
    DETAILS = 'details',
    DETAIL_TABLE = 'detail_table',
    DVP_TEMPLATES = 'dvp_templates',
    FURNITURE = 'furniture',
}

export enum USER_TABLE_NAMES {
    USERS = 'users',
    USERROLES = 'userroles',
    TOKENS = 'tokens',
    ROLES = 'roles',
    RESOURCES = 'resources',
    PERMISSIONS = 'permissions',
    USER_ROLES = 'user_roles',
}
export function dataBaseQuery<T>(dbFile: string, query: string, { successStatusCode = 200, errorStatusCode = 500, successMessage = messages.NO_ERROR, }): Promise<Result<T>> {
    return new Promise((resolve) => {
        const db = new sqlite3.Database(dbFile, (err) => {
            if (err) { resolve({ success: false, status: errorStatusCode, message: messages.DATABASE_OPEN_ERROR, error: err }); db.close(); return }
            if (!query) { resolve({ success: false, status: errorStatusCode, message: messages.SQL_QUERY_ERROR }); db.close(); return }
            try {
                db.all(query, (err: Error, rows: []) => {
                    if (err) {
                        resolve({ success: false, status: errorStatusCode, message: messages.SQL_QUERY_ERROR, error: err });
                        console.log(query)
                        console.log(err.message)
                        db.close();
                        return
                    }
                    else { resolve({ success: true, status: successStatusCode, data: rows as T, message: successMessage }) }
                    db.close()
                });
            } catch (e: any) {
                resolve({ success: false, status: errorStatusCode, message: messages.SQL_QUERY_ERROR, error: e });
                console.log(query)
                db.close();
            }
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

export function hashData(data: string): Promise<Result<string>> {
    return new Promise((resolve) => {
        bcrypt.hash(data, 10, (err, hash) => {
            if (err) resolve({ success: false, status: 500, error: err });
            else resolve({ success: true, status: 200, data: hash });
        });
    });
}

export function incorrectData(message: string): Result<null> {
    return { success: false, status: 400, message }
}
export function noExistData(message: string): Result<null> {
    return { success: false, status: 404, message }
}
export function accessDenied(res: Response) {
    res.status(403).json({ success: false, message: messages.ACCESS_DENIED })
}