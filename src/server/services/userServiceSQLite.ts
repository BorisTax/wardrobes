import messages from '../messages.js'
import sqlite3 from "sqlite3";
import jwt from "jsonwebtoken";
import { hashData } from '../functions.js'
import { IUserServiceProvider } from '../../types/services.js';
import { Result, Token, User } from '../../types/server.js';

export default class UserServiceSQLite implements IUserServiceProvider {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getUsers(): Promise<Result<User[]>> {
        return new Promise((resolve) => {
            const db = new sqlite3.Database(this.dbFile, (err) => {
                if (err) { resolve({ success: false, message: messages.DATABASE_OPEN_ERROR, error: err }); db.close() }
                db.all("select * from 'users'", (err, rows: User[]) => {
                    if (err) { resolve({ success: false, message: messages.SQL_QUERY_ERROR, error: err }); db.close() }
                    else resolve({ success: true, data: rows })
                    db.close()
                });
            });
        }
        )
    }
    async getTokens(): Promise<Result<Token[]>> {
        return new Promise((resolve) => {
            const db = new sqlite3.Database(this.dbFile, (err) => {
                if (err) { resolve({ success: false, message: messages.DATABASE_OPEN_ERROR, error: err }); db.close() }
                db.all("select * from 'tokens'", (err, rows: Token[]) => {
                    if (err) { resolve({ success: false, message: messages.SQL_QUERY_ERROR, error: err }); }
                    else resolve({ success: true, data: rows })
                    db.close()
                });
            });
        }
        )
    }
    async addToken({ token, userName }: { token: string, userName: string }): Promise<Result<null>> {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbFile, (err) => {
                if (err) { resolve({ success: false, message: messages.DATABASE_OPEN_ERROR, error: err }); db.close() }
                const time = Date.now()
                db.all(`INSERT INTO tokens VALUES(?, ?, ?)`, [token, userName, time], (err) => {
                    if (err) { resolve({ success: false, message: messages.SQL_QUERY_ERROR, error: err }); db.close() }
                    else {
                        resolve({ success: true })
                    }
                    db.close()
                });
            });

        }
        )
    }
    async deleteToken(token: string): Promise<Result<null>> {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbFile, (err) => {
                if (err) { resolve({ success: false, message: messages.DATABASE_OPEN_ERROR, error: err }); db.close() }
                db.all(`DELETE FROM tokens WHERE token='${token}'`, (err, rows) => {
                    if (err) { resolve({ success: false, message: messages.SQL_QUERY_ERROR, error: err }); db.close() }
                    else {
                        resolve({ success: true })
                    }
                    db.close()
                });
            });

        }
        )
    }
    async clearAllTokens(): Promise<Result<null>> {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbFile, (err) => {
                if (err) { resolve({ success: false, message: messages.DATABASE_OPEN_ERROR, error: err }); db.close() }
                db.all(`DELETE FROM tokens`, (err, rows) => {
                    if (err) { resolve({ success: false, message: messages.SQL_QUERY_ERROR, error: err }); db.close() }
                    else {
                        resolve({ success: true })
                    }
                    db.close()
                });
            });

        }
        )
    }
    async registerUser(user: User): Promise<Result<string>> {
        const hash = await hashData(user.password);
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbFile, (err) => {
                if (err) { console.error(err); reject(err); db.close() }
                db.all(`INSERT INTO users VALUES(?, ?, ?)`, [user.name, user.role, hash], (err, rows) => {
                    if (err) { console.error(err); reject({ success: false, message: messages.SERVER_ERROR }); db.close() }
                    else {
                        const token = jwt.sign({ name: user.name, role: user.role }, "secretkey", { expiresIn: 1440 });
                        resolve({ success: true, data: token, message: messages.REG_SUCCEED })
                    }
                    db.close()
                });
            });

        }
        )
    }

}
