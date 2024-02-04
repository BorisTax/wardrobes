import messages from './messages.js'
import sqlite3 from "sqlite3";
import keygen from "keygenerator";
import jwt from "jsonwebtoken";
import { hashData } from './userService.js'
export default class UserServiceSQLite {
    constructor(dbFile) {
        this.dbFile = dbFile
    }
    async getUsers() {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbFile, (err) => {
                if (err) { console.error(err); reject(err); db.close() }
                db.all("SELECT * FROM users", (err, rows) => {
                    if (err) { console.error(err); reject(err); db.close()  }
                    else resolve(rows)
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
                db.all(`INSERT INTO users VALUES(?, ?, ?, ?, ?)`,[user.name, user.email, hash, 'FALSE', code], (err, rows) => {
                    if (err) { console.error(err); reject({ success: false, message: messages.SERVER_ERROR }); db.close()  }
                    else {
                        const token = jwt.sign({ name: user.name, activated: user.activated }, "secretkey", { expiresIn: 1440 });
                        resolve({ success: true, token, activationCode: code, message: messages.REG_SUCCEED })
                    }
                    db.close()
                });
            });

        }
        )
    }

    async activateUser(userName, code) {
        const res = await this.getUsers()
        const user = res.find(u => (userName === u.name && u.activationCode === code))
        if (user !== undefined) {
            return new Promise((resolve, reject) => {
                const db = new sqlite3.Database(this.dbFile, (err) => {
                    if (err) { console.error(err); reject(err); db.close() }
                    db.all("UPDATE users SET activated=?, activationCode=? WHERE name=?", ['TRUE', 'NULL', userName], (err, rows) => {
                        if (err) { console.error(err); reject({ success: false, message: messages.SERVER_ERROR }); db.close()  }
                        else {
                            const token = jwt.sign({ name: user.name, activated: true }, "secretkey", { expiresIn: 1440 });
                            resolve({ success: true, token, message: messages.ACTIVATION_SUCCEED })
                        }
                        db.close()
                    });
                });
            }
            )
        }
        return { success: false, message: messages.INVALID_ACTIVATION_CODE }
    }
}
