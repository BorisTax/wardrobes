import { Brush, OmitId } from '../../../types/materials.js';
import { Result } from '../../../types/server.js';
import { IMaterialExtService } from '../../../types/services.js';
import { dataBaseQuery } from '../../functions/database.js';
import messages from '../../messages.js';
import { MAT_TABLE_NAMES } from '../../../types/schemas.js';
import { StatusCodes } from 'http-status-codes';
const { BRUSH, PROFILE_COLORS } = MAT_TABLE_NAMES
export default class BrushServiceSQLite implements IMaterialExtService<Brush> {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getExtData(): Promise<Result<Brush[]>> {
        return dataBaseQuery(this.dbFile, `select * from ${BRUSH};`, [], {successStatusCode: StatusCodes.OK})
    }
    async addExtData({ name, code }: OmitId<Brush>): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `insert into ${BRUSH} (name, code) values(?, ?);`, [name, code], {successStatusCode: StatusCodes.CREATED, successMessage: messages.MATERIAL_ADDED})
    }
    async deleteExtData(id: number): Promise<Result<null>> {
        
        return dataBaseQuery(this.dbFile, `DELETE FROM ${BRUSH} WHERE id=?;`, [id], {successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_DELETED})
    }
    async updateExtData({ id, code, name }: Brush): Promise<Result<null>> {
        const query = getBrushQuery({ id, code, name })
        return dataBaseQuery(this.dbFile, query.query, query.params, { successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_UPDATED })
    }
}

function getBrushQuery({ id, code, name }: Brush) {
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
    params.push(id)
    const query = parts.length > 0 ? `update ${BRUSH} set ${parts.join(', ')} where id=?;` : ""
    return { query, params }
}
