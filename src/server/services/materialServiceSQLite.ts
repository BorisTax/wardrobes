import { FasadMaterial, Profile } from '../../types/materials.js';
import { ExtMaterialQuery, Result } from '../../types/server.js';
import { IMaterialService } from '../../types/services.js';
import { dataBaseQuery, dataBaseTransaction } from '../functions/database.js';
import messages from '../messages.js';
import { MAT_TABLE_NAMES, MaterialTypesSchema } from '../../types/schemas.js';
import { FASAD_TYPE } from '../../types/enums.js';
import { StatusCodes } from 'http-status-codes';
const { MATERIAL_TYPES, MATERIALS, PROFILE_COLORS, MATERIALS_IMAGES } = MAT_TABLE_NAMES
export default class MaterialServiceSQLite implements IMaterialService {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getMaterialTypes(): Promise<Result<MaterialTypesSchema[]>> {
        return dataBaseQuery(this.dbFile, `SELECT * FROM ${MATERIAL_TYPES};`, [], {successStatusCode: StatusCodes.OK})
    }
    async getExtMaterials({ type, name, code }: ExtMaterialQuery): Promise<Result<FasadMaterial[]>> {
        return dataBaseQuery(this.dbFile, getQuery({ type, name, code }), [], {successStatusCode: StatusCodes.OK})
    }

    async addExtMaterial({ name, type, image, code, purpose }: Omit<FasadMaterial, "id">): Promise<Result<null>> {
        const query = `insert into ${MATERIALS} (name, type, code, purpose, image) values(?, ?, ?, ?, ?);`
        return dataBaseQuery(this.dbFile, query, [name, type, code, purpose, image], { successStatusCode: StatusCodes.CREATED, successMessage: messages.MATERIAL_ADDED })
    }

    async updateExtMaterial({ id, name, type, code, purpose, image }: FasadMaterial): Promise<Result<null>> {
        const updateQuery = getUpdateQuery({ id, name, type, image, code, purpose })
        return dataBaseQuery(this.dbFile, updateQuery.query, updateQuery.params, { successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_UPDATED })
    }

    async deleteExtMaterial(id: number): Promise<Result<null>> {
        const query =`DELETE FROM ${MATERIALS} WHERE id=?;`
        return dataBaseQuery(this.dbFile, query, [id], { successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_DELETED })
    }

    async getImage(id: number): Promise<Result<string>>{
        const result = await dataBaseQuery<string[]>(this.dbFile, `select image from ${MATERIALS} where id=?;`, [id], { successStatusCode: StatusCodes.OK })
        return { ...result, data: (result.data && result.data[0] )|| "" }
    }
    async getProfiles(): Promise<Result<Profile[]>> {
        return dataBaseQuery(this.dbFile, `select * from ${PROFILE_COLORS};`, [], {successStatusCode: StatusCodes.OK})
    }
    async addProfile({ name, code, type, brushId }: Omit<Profile,"id">): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `insert into ${PROFILE_COLORS} (name, type, code, brushId) values(?, ?, ?, ?);`, [name, type, code, brushId], {successStatusCode: StatusCodes.CREATED, successMessage: messages.MATERIAL_ADDED})
    }
    async deleteProfile(id: number): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `DELETE FROM ${PROFILE_COLORS} WHERE id=?;`, [id], {successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_DELETED})
    }
    async updateProfile({ id, code, type, name, brushId }: Profile): Promise<Result<null>> {
        const profileQuery = getProfileQuery({ id, code, type, name, brushId })
        return dataBaseQuery(this.dbFile, profileQuery.query, profileQuery.params, { successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_UPDATED })
    }
}

function getQuery({ type, name, code }: ExtMaterialQuery): string {
    const parts = ["id"]
    if (type !== undefined) parts.push(`type`)
    if (name !== undefined) parts.push(`name`)
    if (code !== undefined) parts.push(`code`)
    if (parts.length === 1) parts.push("name, type, code, purpose")
    const mat = type ? `where type='${type}'` : ""
    const query = parts.length > 0 ? `select ${parts.join(", ")} from ${MATERIALS} ${mat};` : ""
    return query
}

function getUpdateQuery({ id, code, name, type, purpose, image }: FasadMaterial) {
    const parts = []
    const params = []
    if (type) {
        parts.push(`type=?`)
        params.push(type)
    }
    if (name) {
        parts.push(`name=?`)
        params.push(name)
    }
    if (code) {
        parts.push(`code=?`)
        params.push(code)
    }
    if (purpose) {
        parts.push(`purpose=?`)
        params.push(purpose)
    }
    if (image) {
        parts.push(`image=?`)
        params.push(image)
    }
    params.push(id)
    const query = parts.length > 0 ? `update ${MATERIALS} set ${parts.join(', ')} where id=?;` : ""
    return { query, params }
}

function getProfileQuery({ id, code, name, type, brushId }: Profile) {
    const parts = []
    const params = []
    if (name) {
        parts.push(`name=?`)
        params.push(name)
    }
    if (code) {
        parts.push(`code=?`)
        params.push(code)
    }
    if (type) {
        parts.push(`type=?`)
        params.push(type)
    }
    if (brushId) {
        parts.push(`brush=?`)
        params.push(brushId)
    }
    params.push(id)
    const query = parts.length > 0 ? `update ${PROFILE_COLORS} set ${parts.join(', ')} where id=?;` : ""
    return { query, params }
}

