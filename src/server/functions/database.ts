import fs from 'fs'
import bcrypt from "bcrypt";
import sqlite3 from "sqlite3";
import messages from '../messages.js';
import { Response } from "express"
import { Result } from '../../types/server.js';
import { StatusCodes } from 'http-status-codes';
import { Query } from '../../types/schemas.js';

type QuerySettings<T> = {
    successStatusCode?: StatusCodes,
    errorStatusCode?: StatusCodes,
    successMessage?: string
}

export function dataBaseQuery<T>(dbFile: string, query: string, params: any[], {successStatusCode = StatusCodes.OK, errorStatusCode = StatusCodes.INTERNAL_SERVER_ERROR, successMessage = messages.NO_ERROR }: QuerySettings<T>): Promise<Result<T>> {
    return new Promise((resolve) => {
        const db = new sqlite3.Database(dbFile, (err) => {
            if (err) { 
                console.log(query, err)
                resolve({ success: false, status: errorStatusCode, data: [], message: messages.DATABASE_OPEN_ERROR, error: err }); 
                db.close(); 
                return 
            }
            if (!query) { resolve({ success: false, data: [], status: errorStatusCode, message: messages.SQL_QUERY_ERROR }); db.close(); return }
            try {
                db.all(query, params, (err: Error, rows: []) => {
                    if (err) {
                        resolve({ success: false, data: [], status: errorStatusCode, message: messages.SQL_QUERY_ERROR, error: err });
                        console.log(query, err.message)
                        db.close();
                        return
                    }
                    else { resolve({ success: true, status: successStatusCode, data: rows as T[], message: successMessage }) }
                    db.close()
                });
            } catch (e: any) {
                resolve({ success: false, data: [], status: errorStatusCode, message: messages.SQL_QUERY_ERROR, error: e });
                console.log(query, e)
                db.close();
            }
        });
    }
    )
}

export function dataBaseTransaction<T>(dbFile: string, queries: Query[], { successStatusCode = StatusCodes.OK, errorStatusCode = StatusCodes.INTERNAL_SERVER_ERROR, successMessage = messages.NO_ERROR, }): Promise<Result<T>> {
    return new Promise((resolve) => {
        const db = new sqlite3.Database(dbFile, (err) => {
            if (err) { resolve({ success: false, data: [], status: errorStatusCode, message: messages.DATABASE_OPEN_ERROR, error: err }); db.close(); return }
            db.serialize(()=>{
                db.run("BEGIN TRANSACTION");
                queries.forEach((query, index) => {
                    if (!query) { resolve({ success: false, data: [], status: errorStatusCode, message: messages.SQL_QUERY_ERROR }); db.run("ROLLBACK"); db.close(); return }
                    try {
                        db.all(query.query, query.params, (err: Error, rows: []) => {
                            if (err) {
                                resolve({ success: false, data: [], status: errorStatusCode, message: messages.SQL_QUERY_ERROR, error: err });
                                console.log(query, err.message)
                                db.run("ROLLBACK");
                                db.close();
                                return
                            }
                            else { 
                                if (index === queries.length - 1) {
                                    db.run("COMMIT");
                                    resolve({ success: true, status: successStatusCode, data: rows as T[], message: successMessage })
                                    db.close()
                                }
                            }
                        });
                    } catch (e: any) {
                        db.run("ROLLBACK");
                        resolve({ success: false, data: [], status: errorStatusCode, message: messages.SQL_QUERY_ERROR, error: e });
                        console.log(query)
                        db.close();
                    }
                })
            })

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


export function hashData(data: string): Promise<Result<string>> {
    return new Promise((resolve) => {
        bcrypt.hash(data, 10, (err, hash) => {
            if (err) resolve({ success: false, data: [], status: StatusCodes.INTERNAL_SERVER_ERROR, error: err });
            else resolve({ success: true, status: StatusCodes.OK, data: [hash] });
        });
    });
}

export function incorrectData<T>(message: string): Result<T> {
    return { success: false, data: [], status: StatusCodes.BAD_REQUEST, message }
}
export function noExistData(message: string): Result<null> {
    return { success: false, data: [], status: StatusCodes.NOT_FOUND, message }
}
export function accessDenied(res: Response) {
    res.status(StatusCodes.FORBIDDEN).json({ success: false, message: messages.ACCESS_DENIED })
}