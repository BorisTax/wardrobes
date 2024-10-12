import { OmitId, Trempel } from '../../../types/materials.js';
import { Result } from '../../../types/server.js';
import { IMaterialExtService } from '../../../types/services.js';
import { dataBaseQuery } from '../../functions/database.js';
import messages from '../../messages.js';
import { MAT_TABLE_NAMES } from '../../../types/schemas.js';
import { StatusCodes } from 'http-status-codes';
const { TREMPEL } = MAT_TABLE_NAMES
export default class TrempelServiceSQLite implements IMaterialExtService<Trempel> {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getExtData(): Promise<Result<Trempel[]>> {
        return dataBaseQuery(this.dbFile, `select * from ${TREMPEL};`, [], {successStatusCode: StatusCodes.OK})
    }
    async addExtData({ name, code }: OmitId<Trempel>): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `insert into ${TREMPEL} (name, code) values(?, ?);`, [name, code], {successStatusCode: StatusCodes.CREATED, successMessage: messages.MATERIAL_ADDED})
    }
    async deleteExtData(id: number): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `DELETE FROM ${TREMPEL} WHERE id=?;`, [id], {successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_DELETED})
    }
    async updateExtData({ id, caption, code, name }: Trempel ): Promise<Result<null>> {
        const query = getQuery({ id, caption, code, name })
        return dataBaseQuery(this.dbFile, query.query, query.params, { successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_UPDATED })
    }
}

function getQuery({ id, caption, code }: Trempel) {
    const parts = []
    const params = []
    if (caption) {
        parts.push(`caption=?`)
        params.push(caption)
    }
    if (code) {
        parts.push(`code=?`)
        params.push(code)
    }
    params.push(id)
    const query = parts.length > 0 ? `update ${TREMPEL} set ${parts.join(', ')} where id=?;` : ""
    return { query, params }
}
