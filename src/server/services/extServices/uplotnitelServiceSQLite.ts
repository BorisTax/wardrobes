import { Uplotnitel } from '../../../types/materials.js';
import { Result } from '../../../types/server.js';
import { IMaterialExtService } from '../../../types/services.js';
import { dataBaseQuery } from '../../functions/other.js';
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
        return dataBaseQuery(this.dbFile, `select * from ${UPLOTNITEL};`, { successStatusCode: StatusCodes.OK })
    }
    async addExtData({ name, code }: Uplotnitel): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `insert into ${UPLOTNITEL} (name, caption, code) values('${name}', '${code}');`, { successStatusCode: StatusCodes.CREATED, successMessage: messages.MATERIAL_ADDED })
    }
    async deleteExtData(name: string): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `DELETE FROM ${UPLOTNITEL} WHERE name='${name}';`, { successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_DELETED })
    }
    async updateExtData({ code, name }: Uplotnitel): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, getQuery({ code, name }), { successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_UPDATED })
    }
}

function getQuery({ code, name }: Uplotnitel) {
    const parts = []
    if (code !== undefined) parts.push(`code='${code}'`)
    const query = parts.length > 0 ? `update ${UPLOTNITEL} set ${parts.join(', ')} where name='${name}';` : ""
    return query
}