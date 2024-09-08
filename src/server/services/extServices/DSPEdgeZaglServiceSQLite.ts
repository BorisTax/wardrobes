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
    async addExtData({ name, edge, zaglushka }: DSP_EDGE_ZAGL): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `insert into ${DSPEDGEZAGL} (name, edge, zaglushka) values(?, ?, ?);`, [name, edge, zaglushka], {successStatusCode: StatusCodes.CREATED, successMessage: messages.MATERIAL_ADDED})
    }
    async deleteExtData(name: string): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `DELETE FROM ${DSPEDGEZAGL} WHERE name=?;`, [name], {successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_DELETED})
    }
    async updateExtData({ name , edge, zaglushka }: DSP_EDGE_ZAGL): Promise<Result<null>> {
        const query = getQuery({ name, edge, zaglushka })
        return dataBaseQuery(this.dbFile, query.query, query.params, { successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_UPDATED })
    }
}

function getQuery({ name, edge, zaglushka}: DSP_EDGE_ZAGL) {
    const parts = []
    const params = []
    if (edge) {
        parts.push(`edge=?`)
        params.push(edge)
    }
    if (zaglushka) {
        parts.push(`zaglushka=?`)
        params.push(zaglushka)
    }
    params.push(name)
    const query = parts.length > 0 ? `update ${DSPEDGEZAGL} set ${parts.join(', ')} where name=?;` : ""
    return { query, params }
}