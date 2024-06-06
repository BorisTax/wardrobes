import { ExtMaterial, ExtNewMaterial, NewBrush, NewEdge, NewProfile, Profile } from '../../types/materials.js';
import { Result } from '../../types/server.js';
import { IMaterialService } from '../../types/services.js';
import { dataBaseQuery } from '../functions/other.js';
import messages from '../messages.js';
import { MAT_TABLE_NAMES } from '../functions/other.js';
const { EXTMATERIALS, PROFILE_COLORS } = MAT_TABLE_NAMES
export default class MaterialServiceSQLite implements IMaterialService {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getExtMaterials(): Promise<Result<ExtMaterial[]>> {
        return dataBaseQuery(this.dbFile, `select * from ${EXTMATERIALS} order by material, name;`, {successStatusCode: 200})
    }

    async addExtMaterial({ name, material, image, code, purpose }: ExtMaterial): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `insert into ${EXTMATERIALS} (name, material, image, code, purpose) values('${name}', '${material}', '${image}', '${code}', '${purpose}');`, {successStatusCode: 201, successMessage: messages.MATERIAL_ADDED})
    }

    async updateExtMaterial({ name, material, newName, image, code, purpose }: ExtNewMaterial): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, getQuery({ newName, image, code, name, material, purpose }), {successStatusCode: 200, successMessage: messages.MATERIAL_UPDATED})
    }

    async deleteExtMaterial(name: string, material: string): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `DELETE FROM ${EXTMATERIALS} WHERE name='${name}' and material='${material}';`, {successStatusCode: 200, successMessage: messages.MATERIAL_DELETED})
    }

    async getProfiles(): Promise<Result<Profile[]>> {
        return dataBaseQuery(this.dbFile, `select * from ${PROFILE_COLORS};`, {successStatusCode: 200})
    }
    async addProfile({ name, code, type, brush }: Profile): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `insert into ${PROFILE_COLORS} (name, type, code, brush) values('${name}', '${type}', '${code}', '${brush}');`, {successStatusCode: 201, successMessage: messages.PROFILE_ADDED})
    }
    async deleteProfile(name: string, type: string): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `DELETE FROM ${PROFILE_COLORS} WHERE name='${name}' and type='${type}';`, {successStatusCode: 200, successMessage: messages.PROFILE_DELETED})
    }
    async updateProfile({ newName, code, type, name, brush }: NewProfile): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, getProfileQuery({ newName, code, name, type, brush }), {successStatusCode: 200, successMessage: messages.PROFILE_UPDATED})
    }
}

function getQuery({ newName, image, code, name, material, purpose }: ExtNewMaterial) {
    const parts = []
    if (newName) parts.push(`name='${newName}'`)
    if (image) parts.push(`image='${image || ""}'`)
    if (code) parts.push(`code='${code}'`)
    if (purpose) parts.push(`purpose='${purpose}'`)
    const query = parts.length > 0 ? `update ${EXTMATERIALS} set ${parts.join(', ')} where name='${name}' and material='${material}';` : ""
    return query
}

function getProfileQuery({ newName, code, name, type, brush }: NewProfile) {
    const parts = []
    if (newName) parts.push(`name='${newName}'`)
    if (code) parts.push(`code='${code}'`)
    if (type) parts.push(`type='${type}'`)
    if (brush) parts.push(`brush='${brush}'`)
    const query = parts.length > 0 ? `update ${PROFILE_COLORS} set ${parts.join(', ')} where name='${name}';` : ""
    return query
}

