import { Result } from '../../../types/server.js';
import { IMaterialExtService } from '../../../types/services.js';
import { dataBaseQuery } from '../../functions/database.js';
import messages from '../../messages.js';
import { MAT_TABLE_NAMES } from '../../../types/schemas.js';
import { StatusCodes } from 'http-status-codes';
import { DspKromkaZagl } from '../../../types/materials.js';
const { DSP_KROMKA_ZAGL } = MAT_TABLE_NAMES
export default class DSPKromkaZaglServiceSQLite implements IMaterialExtService<DspKromkaZagl> {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getExtData(): Promise<Result<DspKromkaZagl[]>> {
        return dataBaseQuery(this.dbFile, `select * from ${DSP_KROMKA_ZAGL};`, [], {successStatusCode: StatusCodes.OK})
    }
    async addExtData({ dspId, kromkaId, zaglushkaId }: DspKromkaZagl): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `insert into ${DSP_KROMKA_ZAGL} (dspId, kromkaId, zaglushkaId) values(?, ?, ?);`, [dspId, kromkaId, zaglushkaId], {successStatusCode: StatusCodes.CREATED, successMessage: messages.MATERIAL_ADDED})
    }
    async deleteExtData(id: number): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `DELETE FROM ${DSP_KROMKA_ZAGL} WHERE dspId=?;`, [id], {successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_DELETED})
    }
    async updateExtData({ dspId, kromkaId, zaglushkaId }: DspKromkaZagl): Promise<Result<null>> {
        const query = getQuery({ dspId, kromkaId, zaglushkaId })
        return dataBaseQuery(this.dbFile, query.query, query.params, { successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_UPDATED })
    }
}

function getQuery({ dspId, kromkaId, zaglushkaId}: DspKromkaZagl) {
    const parts = []
    const params = []
    if (kromkaId) {
        parts.push(`kromkaId=?`)
        params.push(kromkaId)
    }
    if (zaglushkaId) {
        parts.push(`zaglushkaId=?`)
        params.push(zaglushkaId)
    }
    params.push(dspId)
    const query = parts.length > 0 ? `update ${DSP_KROMKA_ZAGL} set ${parts.join(', ')} where dspId=?;` : ""
    return { query, params }
}