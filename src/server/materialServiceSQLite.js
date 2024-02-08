import messages from './messages.js'
import sqlite3 from "sqlite3";
export default class UserServiceSQLite {
    constructor(dbFile) {
        this.dbFile = dbFile
    }
    async getExtMaterials() {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbFile, (err) => {
                if (err) { console.error(err); reject(err); db.close() }
                db.all("select * from 'extmaterials';", (err, rows) => {
                    if (err) { console.error(err); reject(err); db.close() }
                    else { resolve(rows) }
                    db.close()
                });
            });
        }
        )
    }
    async addExtMaterial(name, material, imageurl, code1c) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbFile, (err) => {
                if (err) { console.error(err); reject(err); db.close() }
                db.all(`insert into extmaterials (name, material, imageurl, code1c) values('${name}', '${material}', '${imageurl}', '${code1c}');`, (err, rows) => {
                    if (err) { console.error(err); reject(err); db.close() }
                    else { resolve(rows) }
                    db.close()
                });
            });
        }
        )
    }
    async deleteExtMaterial(name, material) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbFile, (err) => {
                if (err) { console.error(err); reject(err); db.close() }
                db.all(`DELETE FROM extmaterials WHERE name='${name}' and material='${material}';`, (err, rows) => {
                    if (err) { console.error(err); reject(err); db.close() }
                    else { resolve(rows) }
                    db.close()
                });
            });
        }
        )
    }
    async updateExtMaterial(name, material, newName) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbFile, (err) => {
                if (err) { console.error(err); reject(err); db.close() }
                db.all(`UPDATE extmaterials SET name='${newName}' WHERE name='${name}' and material='${material}';`, (err, rows) => {
                    if (err) { console.error(err); reject(err); db.close() }
                    else { resolve(rows) }
                    db.close()
                });
            });
        }
        )
    }
    async getProfiles() {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbFile, (err) => {
                if (err) { console.error(err); reject(err); db.close() }
                db.all(`select * from 'profileColors'`, (err, rows) => {
                    if (err) { console.error(err); reject(err); db.close() }
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
                db.all(`INSERT INTO users VALUES(?, ?, ?)`, [user.name, user.role, hash], (err, rows) => {
                    if (err) { console.error(err); reject({ success: false, message: messages.SERVER_ERROR }); db.close() }
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
