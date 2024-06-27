import { Brush, NewBrush } from '../../../types/materials.js';
import { Result } from '../../../types/server.js';
import { IMaterialExtService, IMaterialServiceProvider } from '../../../types/services.js';
import { dataBaseQuery } from '../../functions/database.js';
import messages from '../../messages.js';
import { MAT_TABLE_NAMES } from '../../../types/schemas.js';
import { StatusCodes } from 'http-status-codes';
const { BRUSH, PROFILE_COLORS } = MAT_TABLE_NAMES
export default class BrushServiceSQLite implements IMaterialExtService<Brush> {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getExtData(): Promise<Result<Brush[]>> {
        return dataBaseQuery(this.dbFile, `select * from ${BRUSH};`, {successStatusCode: StatusCodes.OK})
    }
    async addExtData({ name, code }: Brush): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `insert into ${BRUSH} (name, code) values('${name}', '${code}');`, {successStatusCode: StatusCodes.CREATED, successMessage: messages.MATERIAL_ADDED})
    }
    async deleteExtData(name: string): Promise<Result<null>> {
        
        return dataBaseQuery(this.dbFile, `DELETE FROM ${BRUSH} WHERE name='${name}';`, {successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_DELETED})
    }
    async updateExtData({ newName, code, name }: NewBrush): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, getBrushQuery({ newName, code, name }), {successStatusCode: StatusCodes.OK, successMessage: messages.MATERIAL_UPDATED})
    }
}

function getBrushQuery({ newName, code, name }: NewBrush) {
    const parts = []
    if (newName) parts.push(`name='${newName}'`)
    if (code) parts.push(`code='${code}'`)
    const query = parts.length > 0 ? `update ${BRUSH} set ${parts.join(', ')} where name='${name}';` : ""
    return query
}
