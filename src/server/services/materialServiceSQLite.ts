import { ExtMaterial, ExtNewMaterial, NewBrush, NewEdge, NewProfile, Profile } from '../../types/materials.js';
import { ExtMaterialQuery, Result } from '../../types/server.js';
import { IMaterialService } from '../../types/services.js';
import { dataBaseQuery } from '../functions/database.js';
import messages from '../messages.js';
import { MAT_TABLE_NAMES } from '../../types/schemas.js';
import { FasadMaterial } from '../../types/enums.js';
import { StatusCodes } from 'http-status-codes';
const { EXTMATERIALS, PROFILE_COLORS } = MAT_TABLE_NAMES
export default class MaterialServiceSQLite implements IMaterialService {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getExtMaterials({ material, name, code }: ExtMaterialQuery): Promise<Result<ExtMaterial[]>> {
        return dataBaseQuery(this.dbFile, getQuery({ material, name, code }), {successStatusCode: StatusCodes.OK})
    }

    async addExtMaterial({ name, material, image, code, purpose }: ExtMaterial): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `insert into ${EXTMATERIALS} (name, material, image, code, purpose) values('${name}', '${material}', '${image}', '${code}', '${purpose}');`, {successStatusCode: StatusCodes.CREATED, successMessage: messages.MATERIAL_ADDED})
    }

    async updateExtMaterial({ name, material, newName, image, code, purpose }: ExtNewMaterial): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, getUpdateQuery({ newName, image, code, name, material, purpose }), {successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_UPDATED})
    }

    async deleteExtMaterial(name: string, material: string): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `DELETE FROM ${EXTMATERIALS} WHERE name='${name}' and material='${material}';`, {successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_DELETED})
    }

    async getProfiles(): Promise<Result<Profile[]>> {
        return dataBaseQuery(this.dbFile, `select * from ${PROFILE_COLORS};`, {successStatusCode: StatusCodes.OK})
    }
    async addProfile({ name, code, type, brush }: Profile): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `insert into ${PROFILE_COLORS} (name, type, code, brush) values('${name}', '${type}', '${code}', '${brush}');`, {successStatusCode: StatusCodes.CREATED, successMessage: messages.MATERIAL_ADDED})
    }
    async deleteProfile(name: string, type: string): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `DELETE FROM ${PROFILE_COLORS} WHERE name='${name}' and type='${type}';`, {successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_DELETED})
    }
    async updateProfile({ newName, code, type, name, brush }: NewProfile): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, getProfileQuery({ newName, code, name, type, brush }), {successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_UPDATED})
    }
}

function getQuery({ material, name, code }: ExtMaterialQuery): string {
    const parts = []
    if (material !== undefined) parts.push(`material`)
    if (name !== undefined) parts.push(`name`)
    if (code !== undefined) parts.push(`code`)
    if (parts.length === 0) parts.push("*")
    const mat = material ? `where material='${material}'` : ""
    const query = parts.length > 0 ? `select ${parts.join(", ")} from ${EXTMATERIALS} ${mat} order by material, name;` : ""
    return query
}

function getUpdateQuery({ newName, image, code, name, material, purpose }: ExtNewMaterial) {
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

