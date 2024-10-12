import { DSP_EDGE_ZAGL } from '../../../types/materials.js';
import { Result } from '../../../types/server.js';
import { IMaterialExtService } from '../../../types/services.js';
import { dataBaseQuery } from '../../functions/database.js';
import messages from '../../messages.js';
import { MAT_TABLE_NAMES } from '../../../types/schemas.js';
import { StatusCodes } from 'http-status-codes';
const { DSPEDGEZAGL } = MAT_TABLE_NAMES
export default class DSPEdgeZaglServiceSQLite implements IMaterialExtService<DSP_EDGE_ZAGL> {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getExtData(): Promise<Result<DSP_EDGE_ZAGL[]>> {
        return dataBaseQuery(this.dbFile, `select * from ${DSPEDGEZAGL};`, [], {successStatusCode: StatusCodes.OK})
    }
    async addExtData({ dspId, edgeId, zaglushkaId }: DSP_EDGE_ZAGL): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `insert into ${DSPEDGEZAGL} (dspId, edgeId, zaglushkaId) values(?, ?, ?);`, [dspId, edgeId, zaglushkaId], {successStatusCode: StatusCodes.CREATED, successMessage: messages.MATERIAL_ADDED})
    }
    async deleteExtData(id: number): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `DELETE FROM ${DSPEDGEZAGL} WHERE dspId=?;`, [id], {successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_DELETED})
    }
    async updateExtData({ dspId, edgeId, zaglushkaId }: DSP_EDGE_ZAGL): Promise<Result<null>> {
        const query = getQuery({ dspId, edgeId, zaglushkaId })
        return dataBaseQuery(this.dbFile, query.query, query.params, { successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_UPDATED })
    }
}

function getQuery({ dspId, edgeId, zaglushkaId}: DSP_EDGE_ZAGL) {
    const parts = []
    const params = []
    if (edgeId) {
        parts.push(`edgeId=?`)
        params.push(edgeId)
    }
    if (zaglushkaId) {
        parts.push(`zaglushkaId=?`)
        params.push(zaglushkaId)
    }
    params.push(dspId)
    const query = parts.length > 0 ? `update ${DSPEDGEZAGL} set ${parts.join(', ')} where dspId=?;` : ""
    return { query, params }
}