import { Trempel } from '../../../types/materials.js';
import { Result } from '../../../types/server.js';
import { IMaterialExtService } from '../../../types/services.js';
import { dataBaseQuery } from '../../functions/other.js';
import messages from '../../messages.js';
import { MAT_TABLE_NAMES } from '../../functions/other.js';
const { TREMPEL } = MAT_TABLE_NAMES
export default class TrempelServiceSQLite implements IMaterialExtService<Trempel> {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getExtData(): Promise<Result<Trempel[]>> {
        return dataBaseQuery(this.dbFile, `select * from ${TREMPEL};`, {successStatusCode: 200})
    }
    async addExtData({ name, code }: Trempel): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `insert into ${TREMPEL} (name, code) values('${name}', '${code}');`, {successStatusCode: 201, successMessage: messages.MATERIAL_ADDED})
    }
    async deleteExtData(name: string): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `DELETE FROM ${TREMPEL} WHERE name='${name}';`, {successStatusCode: 200, successMessage: messages.MATERIAL_DELETED})
    }
    async updateExtData({ caption, code, name }: Trempel ): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, getQuery({ caption, code, name }), {successStatusCode: 200, successMessage: messages.MATERIAL_UPDATED})
    }
}

function getQuery({ caption, code, name }: Trempel) {
    const parts = []
    if (caption) parts.push(`caption='${caption}'`)
    if (code) parts.push(`code='${code}'`)
    const query = parts.length > 0 ? `update ${TREMPEL} set ${parts.join(', ')} where name='${name}';` : ""
    return query
}
