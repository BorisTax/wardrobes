import { Uplotnitel } from '../../../types/materials.js';
import { Result } from '../../../types/server.js';
import { IMaterialExtService } from '../../../types/services.js';
import { dataBaseQuery } from '../../functions/database.js';
import messages from '../../messages.js';
import { MAT_TABLE_NAMES } from '../../../types/schemas.js';
import { StatusCodes } from 'http-status-codes';
const { UPLOTNITEL } = MAT_TABLE_NAMES
export default class UplotnitelServiceSQLite implements IMaterialExtService<Uplotnitel> {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getExtData(): Promise<Result<Uplotnitel[]>> {
        return dataBaseQuery(this.dbFile, `select * from ${UPLOTNITEL};`, [], { successStatusCode: StatusCodes.OK })
    }
    async addExtData({ name, code }: Omit<Uplotnitel, "id">): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `insert into ${UPLOTNITEL} (name, code) values(?, ?);`, [name, code], { successStatusCode: StatusCodes.CREATED, successMessage: messages.MATERIAL_ADDED })
    }
    async deleteExtData(id: number): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `DELETE FROM ${UPLOTNITEL} WHERE id=?;`, [id], { successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_DELETED })
    }
    async updateExtData({ id, code, name }: Uplotnitel): Promise<Result<null>> {
        const query = getQuery({ id, code, name })
        return dataBaseQuery(this.dbFile, query.query, query.params, { successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_UPDATED })
    }
}

function getQuery({ id, code, name }: Uplotnitel) {
    const parts = []
    const params = []
    if (code !== undefined) {
        parts.push(`code=?`)
        params.push(code)
    }
    if (name !== undefined) {
        parts.push(`name=?`)
        params.push(name)
    }
    params.push(id)
    const query = parts.length > 0 ? `update ${UPLOTNITEL} set ${parts.join(', ')} where id=?;` : ""
    return { query, params }
}