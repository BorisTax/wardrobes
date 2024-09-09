import { NewZaglushka, Zaglushka } from '../../../types/materials.js';
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
    async addExtData({ name, code }: Zaglushka): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `insert into ${ZAGLUSHKA} (name, code) values(?, ?);`, [name, code], {successStatusCode: StatusCodes.CREATED, successMessage: messages.MATERIAL_ADDED})
    }
    async deleteExtData(name: string): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `DELETE FROM ${ZAGLUSHKA} WHERE name=?;`, [name], {successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_DELETED})
    }
    async updateExtData({ newName, code, name }: NewZaglushka): Promise<Result<null>> {
        const query = getZaglushkaQuery({ newName, code, name })
        return dataBaseQuery(this.dbFile, query.query, query.params, { successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_UPDATED })
    }
}

function getZaglushkaQuery({ newName, code, name }: NewZaglushka) {
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
    params.push(name)
    const query = parts.length > 0 ? `update ${ZAGLUSHKA} set ${parts.join(', ')} where name=?;` : ""
    return { query, params }
}