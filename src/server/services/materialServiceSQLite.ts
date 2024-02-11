import { ExtMaterial, ExtNewMaterial, Profile } from '../../types/materials.js';
import { Result } from '../../types/server.js';
import { IMaterialServiceProvider } from '../../types/services.js';
import sqlite3 from "sqlite3";
import messages from '../messages.js';
export default class MaterialServiceSQLite implements IMaterialServiceProvider {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getExtMaterials(): Promise<Result<ExtMaterial[]>> {
        return new Promise((resolve) => {
            const db = new sqlite3.Database(this.dbFile, (err) => {
                if (err) { console.error(err); resolve({ success: false, message: messages.DATABASE_OPEN_ERROR, error: err }); db.close() }
                db.all("select * from 'extmaterials' order by name;", (err, rows: ExtMaterial[]) => {
                    if (err) { resolve({ success: false, message: messages.SQL_QUERY_ERROR, error: err }); db.close() }
                    else { resolve({success: true, data: rows}) }
                    db.close()
                });
            });
        }
        )
    }
    async addExtMaterial({ name, material, imageurl, code }: ExtMaterial): Promise<Result<null>> {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbFile, (err) => {
                if (err) { resolve({ success: false, message: messages.DATABASE_OPEN_ERROR, error: err }); db.close() }
                db.all(`insert into extmaterials (name, material, imageurl, code1c) values('${name}', '${material}', '${imageurl}', '${code}');`, (err, rows) => {
                    if (err) { resolve({ success: false, message: messages.SQL_QUERY_ERROR, error: err }); db.close() }
                    else { resolve({ success: true }) }
                    db.close()
                });
            });
        }
        )
    }

    async updateExtMaterial({ name, material, newName, imageurl, code }: ExtNewMaterial): Promise<Result<null>> {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbFile, (err) => {
                if (err) { resolve({ success: false, message: messages.DATABASE_OPEN_ERROR, error: err }); db.close() }
                const query = getQuery({ newName, imageurl, code, name, material })
                db.all(query, (err, rows) => {
                    if (err) { resolve({ success: false, message: messages.SQL_QUERY_ERROR, error: err }); db.close() }
                    else { resolve({ success: true }) }
                    db.close()
                });
            });
        }
        )
    }
    async deleteExtMaterial(name: string, material: string): Promise<Result<null>> {
        return new Promise((resolve) => {
            const db = new sqlite3.Database(this.dbFile, (err) => {
                if (err) { resolve({ success: false, message: messages.DATABASE_OPEN_ERROR, error: err }); db.close() }
                db.all(`DELETE FROM extmaterials WHERE name='${name}' and material='${material}';`, (err) => {
                    if (err) { resolve({ success: false, message: messages.SQL_QUERY_ERROR, error: err }); db.close() }
                    else { resolve({ success: true }) }
                    db.close()
                });
            });
        }
        )
    }

    async getProfiles(): Promise<Result<Profile[]>> {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbFile, (err) => {
                if (err) { resolve({ success: false, message: messages.DATABASE_OPEN_ERROR, error: err }); db.close() }
                db.all(`select * from 'profileColors'`, (err, rows: Profile[]) => {
                    if (err) { resolve({ success: false, message: messages.SQL_QUERY_ERROR, error: err }); db.close() }
                    else resolve({success: true, data: rows})
                    db.close()
                });
            });
        }
        )
    }
}

function getQuery({ newName, imageurl, code, name, material }: ExtNewMaterial) {
    const parts = []
    if (newName) parts.push(`name='${newName}'`)
    if (imageurl) parts.push(`imageurl='${imageurl}'`)
    if (code) parts.push(`code1c='${code}'`)
    const query = `update extmaterials set ${parts.join(', ')} where name='${name}' and material='${material}';`
    return query
}

