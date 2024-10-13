import { Kromka, OmitId } from '../../../types/materials.js';
import { Result } from '../../../types/server.js';
import { IMaterialExtService } from '../../../types/services.js';
import { dataBaseQuery } from '../../functions/database.js';
import messages from '../../messages.js';
import { MAT_TABLE_NAMES } from '../../../types/schemas.js';
import { StatusCodes } from 'http-status-codes';
const { KROMKA: EDGE } = MAT_TABLE_NAMES
export default class KromkaServiceSQLite implements IMaterialExtService<Kromka> {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getExtData(): Promise<Result<Kromka[]>> {
        return dataBaseQuery<Kromka[]>(this.dbFile, `select * from ${EDGE};`, [], {successStatusCode: StatusCodes.OK})
    }
    async addExtData({ name, code, typeId }: OmitId<Kromka>): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `insert into ${EDGE} (name, code, typeId) values(?, ?, ?);`, [name, code, typeId], {successStatusCode: StatusCodes.CREATED, successMessage: messages.MATERIAL_ADDED})
    }
    async deleteExtData(id: number): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `DELETE FROM ${EDGE} WHERE id=?;`, [id], { successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_DELETED})
    }
    async updateExtData({ id, code, name, typeId }: Kromka): Promise<Result<null>> {
        const query =getEdgeQuery({ id, code, name, typeId })
        return dataBaseQuery(this.dbFile, query.query, query.params, { successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_UPDATED })
    }
}

function getEdgeQuery({ id, code, name, typeId }: Kromka) {
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
    if (typeId) {
        parts.push(`typeId=?`)
        params.push(typeId)
    }
    params.push(id)
    const query = parts.length > 0 ? `update ${EDGE} set ${parts.join(', ')} where id=?;` : ""
    return { query, params }
}
