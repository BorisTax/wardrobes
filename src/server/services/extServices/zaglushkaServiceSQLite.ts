import { OmitId, Zaglushka } from '../../../types/materials.js';
import { Result } from '../../../types/server.js';
import { IMaterialExtService } from '../../../types/services.js';
import { dataBaseQuery } from '../../functions/database.js';
import messages from '../../messages.js';
import { MAT_TABLE_NAMES } from '../../../types/schemas.js';
import { StatusCodes } from 'http-status-codes';
const { ZAGLUSHKA } = MAT_TABLE_NAMES
export default class ZagluskaServiceSQLite implements IMaterialExtService<Zaglushka> {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getExtData(): Promise<Result<Zaglushka[]>> {
        return dataBaseQuery(this.dbFile, `select * from ${ZAGLUSHKA};`, [], {successStatusCode: StatusCodes.OK})
    }
    async addExtData({ name, code }: OmitId<Zaglushka>): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `insert into ${ZAGLUSHKA} (name, code) values(?, ?);`, [name, code], {successStatusCode: StatusCodes.CREATED, successMessage: messages.MATERIAL_ADDED})
    }
    async deleteExtData(id: number): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `DELETE FROM ${ZAGLUSHKA} WHERE id=?;`, [id], {successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_DELETED})
    }
    async updateExtData({ id, code, name }: Zaglushka): Promise<Result<null>> {
        const query = getZaglushkaQuery({ id, code, name })
        return dataBaseQuery(this.dbFile, query.query, query.params, { successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_UPDATED })
    }
}

function getZaglushkaQuery({ id, code, name }: Zaglushka) {
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
    const query = parts.length > 0 ? `update ${ZAGLUSHKA} set ${parts.join(', ')} where id=?;` : ""
    return { query, params }
}