import messages from '../messages.js'
import sqlite3 from "sqlite3";
import jwt from "jsonwebtoken";
import { hashData } from '../functions.js'

export default class UserServiceSQLite {
    constructor(dbFile) {
        this.dbFile = dbFile
    }
    async getUsers() {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbFile, (err) => {
                if (err) { console.error(err); reject(err); db.close() }
                db.all("select * from 'users'", (err, rows) => {
                    if (err) { console.error(err); reject(err); db.close()  }
                    else resolve(rows)
                    db.close()
                });
            });
        }
        )
    }
    async getTokens() {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbFile, (err) => {
                if (err) { console.error(err); reject(err); db.close() }
                db.all("select * from 'tokens'", (err, rows) => {
                    if (err) { console.error(err); reject(err); db.close()  }
                    else resolve(rows)
                    db.close()
                });
            });
        }
        )
    }
    async addToken({token, username}){
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbFile, (err) => {
                if (err) { console.error(err); reject(err); db.close() }
                const time = Date.now()
                db.all(`INSERT INTO tokens VALUES(?, ?, ?)`,[token, username, time], (err, rows) => {
                    if (err) { console.error(err); reject({ success: false, message: messages.SERVER_ERROR }); db.close()  }
                    else {
                        resolve({ success: true })
                    }
                    db.close()
                });
            });

        }
        )
      }
      async deleteToken(token){
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbFile, (err) => {
                if (err) { console.error(err); reject(err); db.close() }
                db.all(`DELETE FROM tokens WHERE token='${token}'`, (err, rows) => {
                    if (err) { console.error(err); reject({ success: false, message: messages.SERVER_ERROR }); db.close()  }
                    else {
                        resolve({ success: true })
                    }
                    db.close()
                });
            });

        }
        )
      }
      async clearAllTokens(){
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbFile, (err) => {
                if (err) { console.error(err); reject(err); db.close() }
                db.all(`DELETE FROM tokens`, (err, rows) => {
                    if (err) { console.error(err); reject({ success: false, message: messages.SERVER_ERROR }); db.close()  }
                    else {
                        resolve({ success: true })
                    }
                    db.close()
                });
            });

        }
        )
      }
    async registerUser(user) {
        const hash = await hashData(user.password);
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbFile, (err) => {
                if (err) { console.error(err); reject(err); db.close() }
                db.all(`INSERT INTO users VALUES(?, ?, ?)`,[user.name, user.role, hash], (err, rows) => {
                    if (err) { console.error(err); reject({ success: false, message: messages.SERVER_ERROR }); db.close()  }
                    else {
                        const token = jwt.sign({ name: user.name, role: user.role }, "secretkey", { expiresIn: 1440 });
                        resolve({ success: true, token, message: messages.REG_SUCCEED })
                    }
                    db.close()
                });
            });

        }
        )
    }

}
