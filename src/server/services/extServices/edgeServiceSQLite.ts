import { Edge, NewEdge } from '../../../types/materials.js';
import { Result } from '../../../types/server.js';
import { IMaterialExtService, IMaterialServiceProvider } from '../../../types/services.js';
import { dataBaseQuery } from '../../functions/other.js';
import messages from '../../messages.js';
import { MAT_TABLE_NAMES } from '../../functions/other.js';
const { EDGE } = MAT_TABLE_NAMES
export default class EdgeServiceSQLite implements IMaterialExtService<Edge> {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getExtData(): Promise<Result<Edge[]>> {
        return dataBaseQuery<Edge[]>(this.dbFile, `select * from ${EDGE};`, {successStatusCode: 200})
    }
    async addExtData({ name, dsp, code }: Edge): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `insert into ${EDGE} (name, dsp, code) values('${name}', '${dsp}', '${code}');`, {successStatusCode: 201, successMessage: messages.EDGE_ADDED})
    }
    async deleteExtData(name: string): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `DELETE FROM ${EDGE} WHERE name='${name}';`, {successStatusCode: 200, successMessage: messages.EDGE_DELETED})
    }
    async updateExtData({ newName, dsp, code, name }: NewEdge): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, getEdgeQuery({ newName, dsp, code, name }), {successStatusCode: 200, successMessage: messages.EDGE_UPDATED})
    }
}

function getEdgeQuery({ newName, dsp, code, name }: NewEdge) {
    const parts = []
    if (newName) parts.push(`name='${newName}'`)
    if (code) parts.push(`code='${code}'`)
    if (dsp) parts.push(`dsp='${dsp}'`)
    const query = parts.length > 0 ? `update ${EDGE} set ${parts.join(', ')} where name='${name}';` : ""
    return query
}