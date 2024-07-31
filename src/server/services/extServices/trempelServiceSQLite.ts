import { Trempel } from '../../../types/materials.js';
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
    async addExtData({ name, code }: Trempel): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `insert into ${TREMPEL} (name, code) values(?, ?);`, [name, code], {successStatusCode: StatusCodes.CREATED, successMessage: messages.MATERIAL_ADDED})
    }
    async deleteExtData(name: string): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `DELETE FROM ${TREMPEL} WHERE name=?;`, [name], {successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_DELETED})
    }
    async updateExtData({ caption, code, name }: Trempel ): Promise<Result<null>> {
        const query = getQuery({ caption, code, name })
        return dataBaseQuery(this.dbFile, query.query, query.params, { successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_UPDATED })
    }
}

function getQuery({ caption, code, name }: Trempel) {
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
    params.push(name)
    const query = parts.length > 0 ? `update ${TREMPEL} set ${parts.join(', ')} where name=?;` : ""
    return { query, params }
}
