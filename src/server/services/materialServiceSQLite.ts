import { ExtMaterial, ExtNewMaterial } from '../../types/materials.js';
import { Results } from '../../types/server.js';
import { IMaterialServiceProvider } from '../../types/services.js';
import { dataBaseQuery } from '../functions.js';

export default class MaterialServiceSQLite implements IMaterialServiceProvider {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getExtMaterials(): Promise<Results> {
        return dataBaseQuery(this.dbFile, "select * from 'extmaterials' order by name;")
    }

    async addExtMaterial({ name, material, imageurl, code }: ExtMaterial): Promise<Results> {
        return dataBaseQuery(this.dbFile, `insert into extmaterials (name, material, imageurl, code) values('${name}', '${material}', '${imageurl}', '${code}');`)
    }

    async updateExtMaterial({ name, material, newName, imageurl, code }: ExtNewMaterial): Promise<Results> {
        return dataBaseQuery(this.dbFile, getQuery({ newName, imageurl, code, name, material }))
    }

    async deleteExtMaterial(name: string, material: string): Promise<Results> {
        return dataBaseQuery(this.dbFile, `DELETE FROM extmaterials WHERE name='${name}' and material='${material}';`)
    }

    async getProfiles(): Promise<Results> {
        return dataBaseQuery(this.dbFile, `select * from 'profileColors'`)
    }
}

function getQuery({ newName, imageurl, code, name, material }: ExtNewMaterial) {
    const parts = []
    if (newName) parts.push(`name='${newName}'`)
    if (imageurl) parts.push(`imageurl='${imageurl || ""}'`)
    if (code) parts.push(`code='${code}'`)
    const query = parts.length > 0 ? `update extmaterials set ${parts.join(', ')} where name='${name}' and material='${material}';` : ""
    return query
}

