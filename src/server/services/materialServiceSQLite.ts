import { ExtMaterial, ExtNewMaterial, NewProfile, Profile } from '../../types/materials.js';
import { ExtMaterialQuery, Result } from '../../types/server.js';
import { IMaterialService } from '../../types/services.js';
import { dataBaseQuery, dataBaseTransaction } from '../functions/database.js';
import messages from '../messages.js';
import { MAT_TABLE_NAMES } from '../../types/schemas.js';
import { FasadMaterial } from '../../types/enums.js';
import { StatusCodes } from 'http-status-codes';
import { query } from 'express';
const { EXTMATERIALS, PROFILE_COLORS, EXTMATERIALS_IMAGES } = MAT_TABLE_NAMES
export default class MaterialServiceSQLite implements IMaterialService {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getExtMaterials({ material, name, code }: ExtMaterialQuery): Promise<Result<ExtMaterial[]>> {
        return dataBaseQuery(this.dbFile, getQuery({ material, name, code }), [], {successStatusCode: StatusCodes.OK})
    }

    async addExtMaterial({ name, material, image, code, purpose }: ExtMaterial): Promise<Result<null>> {
        const queries = [{query: `insert into ${EXTMATERIALS} (name, material, code, purpose) values(?, ?, ?, ?);`, params: [name, material, code, purpose]}]
        if (image) queries.push({query: `insert into ${EXTMATERIALS_IMAGES} (name, material, image) values(?, ?, ?);`, params: [name, material, image]})
        return dataBaseTransaction(this.dbFile, queries, {successStatusCode: StatusCodes.CREATED, successMessage: messages.MATERIAL_ADDED})
    }

    async updateExtMaterial({ name, material, newName, image, code, purpose }: ExtNewMaterial): Promise<Result<null>> {
        const queries = []
        const updateQuery= getUpdateQuery({ newName, image, code, name, material, purpose })
        if(updateQuery) queries.push(updateQuery)
        if (image) queries.push({query: `update ${EXTMATERIALS_IMAGES} set image=? where name=? and material=?;`, params: [image, name, material]})
        return dataBaseTransaction(this.dbFile, queries, { successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_UPDATED })
    }

    async deleteExtMaterial(name: string, material: string): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `DELETE FROM ${EXTMATERIALS} WHERE name=? and material=?;`, [name, material], {successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_DELETED})
    }
    async getImage(material: FasadMaterial, name: string): Promise<Result<string>>{
        const result = await dataBaseQuery<string[]>(this.dbFile, `select image from ${EXTMATERIALS_IMAGES} where material=? and name=?;`, [material, name], { successStatusCode: StatusCodes.OK })
        return { ...result, data: (result.data && result.data[0] )|| "" }
    }
    async getProfiles(): Promise<Result<Profile[]>> {
        return dataBaseQuery(this.dbFile, `select * from ${PROFILE_COLORS};`, [], {successStatusCode: StatusCodes.OK})
    }
    async addProfile({ name, code, type, brush }: Profile): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `insert into ${PROFILE_COLORS} (name, type, code, brush) values(?, ?, ?, ?);`, [name, type, code, brush], {successStatusCode: StatusCodes.CREATED, successMessage: messages.MATERIAL_ADDED})
    }
    async deleteProfile(name: string, type: string): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `DELETE FROM ${PROFILE_COLORS} WHERE name=? and type=?;`, [name, type], {successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_DELETED})
    }
    async updateProfile({ newName, code, type, name, brush }: NewProfile): Promise<Result<null>> {
        const profileQuery = getProfileQuery({ newName, code, name, type, brush })
        return dataBaseQuery(this.dbFile, profileQuery.query, profileQuery.params, { successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_UPDATED })
    }
}

function getQuery({ material, name, code }: ExtMaterialQuery): string {
    const parts = []
    if (material !== undefined) parts.push(`material`)
    if (name !== undefined) parts.push(`name`)
    if (code !== undefined) parts.push(`code`)
    if (parts.length === 0) parts.push("name, material, code, purpose")
    const mat = material ? `where material='${material}'` : ""
    const query = parts.length > 0 ? `select ${parts.join(", ")} from ${EXTMATERIALS} ${mat} order by material, name;` : ""
    return query
}

function getUpdateQuery({ newName, code, name, material, purpose }: ExtNewMaterial) {
    const parts = []
    const params = []
    if (newName) {
        parts.push(`name=?`)
        params.push(newName)
    }
    if (code) {
        parts.push(`code=?`)
        params.push(code)
    }
    if (purpose) {
        parts.push(`purpose=?`)
        params.push(purpose)
    }
    params.push(name)
    params.push(material)
    const query = parts.length > 0 ? `update ${EXTMATERIALS} set ${parts.join(', ')} where name=? and material=?;` : ""
    return { query, params }
}

function getProfileQuery({ newName, code, name, type, brush }: NewProfile) {
    const parts = []
    const params = []
    if (newName) {
        parts.push(`name=?`)
        params.push(newName)
    }
    if (code) {
        parts.push(`code=?`)
        params.push(code)
    }
    if (type) {
        parts.push(`type=?`)
        params.push(type)
    }
    if (brush) {
        parts.push(`brush=?`)
        params.push(brush)
    }
    params.push(name)
    const query = parts.length > 0 ? `update ${PROFILE_COLORS} set ${parts.join(', ')} where name=?;` : ""
    return { query, params }
}

