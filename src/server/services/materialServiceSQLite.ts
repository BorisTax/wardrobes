import { ExtMaterial, ExtNewMaterial, NewProfile, Profile } from '../../types/materials.js';
import { Results } from '../../types/server.js';
import { IMaterialServiceProvider } from '../../types/services.js';
import { dataBaseQuery } from '../functions.js';
export default class MaterialServiceSQLite implements IMaterialServiceProvider {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getExtMaterials(): Promise<Results> {
        return dataBaseQuery(this.dbFile, "select * from 'extmaterials' order by material, name;")
    }

    async addExtMaterial({ name, material, image, code }: ExtMaterial): Promise<Results> {
        return dataBaseQuery(this.dbFile, `insert into extmaterials (name, material, image, code) values('${name}', '${material}', '${image}', '${code}');`)
    }

    async updateExtMaterial({ name, material, newName, image, code }: ExtNewMaterial): Promise<Results> {
        return dataBaseQuery(this.dbFile, getQuery({ newName, image, code, name, material }))
    }

    async deleteExtMaterial(name: string, material: string): Promise<Results> {
        return dataBaseQuery(this.dbFile, `DELETE FROM extmaterials WHERE name='${name}' and material='${material}';`)
    }

    async getProfiles(): Promise<Results> {
        return dataBaseQuery(this.dbFile, `select * from 'profileColors'`)
    }
    async addProfile({ name, code, type }: Profile) {
        return dataBaseQuery(this.dbFile, `insert into profilecolors (name, type, code) values('${name}', '${type}', '${code}');`)
    }
    async deleteProfile(name: string, type: string) {
        return dataBaseQuery(this.dbFile, `DELETE FROM profilecolors WHERE name='${name}' and type='${type}';`)
    }
    async updateProfile({ newName, code, type, name }: NewProfile) {
        return dataBaseQuery(this.dbFile, getProfileQuery({ newName, code, name, type }))
    }
}

function getQuery({ newName, image, code, name, material }: ExtNewMaterial) {
    const parts = []
    if (newName) parts.push(`name='${newName}'`)
    if (image) parts.push(`image='${image || ""}'`)
    if (code) parts.push(`code='${code}'`)
    const query = parts.length > 0 ? `update extmaterials set ${parts.join(', ')} where name='${name}' and material='${material}';` : ""
    return query
}

function getProfileQuery({ newName, code, name, type }: NewProfile) {
    const parts = []
    if (newName) parts.push(`name='${newName}'`)
    if (code) parts.push(`code='${code}'`)
    if (type) parts.push(`type='${type}'`)
    const query = parts.length > 0 ? `update profilecolors set ${parts.join(', ')} where name='${name}';` : ""
    return query
}

