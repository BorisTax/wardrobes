import { KromkaType, OmitId } from '../../../types/materials.js';
import { Result } from '../../../types/server.js';
import { IMaterialExtService } from '../../../types/services.js';
import { dataBaseQuery } from '../../functions/database.js';
import messages from '../../messages.js';
import { MAT_TABLE_NAMES } from '../../../types/schemas.js';
import { StatusCodes } from 'http-status-codes';
const { KROMKA_TYPES: EDGE_TYPES } = MAT_TABLE_NAMES
export default class KromkaTypeServiceSQLite implements IMaterialExtService<KromkaType> {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getExtData(): Promise<Result<KromkaType[]>> {
        return dataBaseQuery<KromkaType[]>(this.dbFile, `select * from ${EDGE_TYPES};`, [], {successStatusCode: StatusCodes.OK})
    }
    async addExtData({ caption }: OmitId<KromkaType>): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `insert into ${EDGE_TYPES} (caption) values(?);`, [caption], {successStatusCode: StatusCodes.CREATED, successMessage: messages.MATERIAL_ADDED})
    }
    async deleteExtData(id: number): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `DELETE FROM ${EDGE_TYPES} WHERE id=?;`, [id], { successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_DELETED})
    }
    async updateExtData({ id, caption }: KromkaType): Promise<Result<null>> {
        const query =getEdgeQuery({ id, caption })
        return dataBaseQuery(this.dbFile, query.query, query.params, { successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_UPDATED })
    }
}

function getEdgeQuery({ id, caption }: KromkaType) {
    const parts = []
    const params = []
    if (caption) {
        parts.push(`caption=?`)
        params.push(caption)
    }
    params.push(id)
    const query = parts.length > 0 ? `update ${EDGE_TYPES} set ${parts.join(', ')} where id=?;` : ""
    return { query, params }
}
