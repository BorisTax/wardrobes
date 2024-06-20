import { Brush, NewBrush } from '../../../types/materials.js';
import { Result } from '../../../types/server.js';
import { IMaterialExtService, IMaterialServiceProvider } from '../../../types/services.js';
import { dataBaseQuery } from '../../functions/other.js';
import messages from '../../messages.js';
import { MAT_TABLE_NAMES } from '../../functions/other.js';
const { BRUSH, PROFILE_COLORS } = MAT_TABLE_NAMES
export default class BrushServiceSQLite implements IMaterialExtService<Brush> {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getExtData(): Promise<Result<Brush[]>> {
        return dataBaseQuery(this.dbFile, `select * from ${BRUSH};`, {successStatusCode: 200})
    }
    async addExtData({ name, code }: Brush): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `insert into ${BRUSH} (name, code) values('${name}', '${code}');`, {successStatusCode: 201, successMessage: messages.MATERIAL_ADDED})
    }
    async deleteExtData(name: string): Promise<Result<null>> {
        
        return dataBaseQuery(this.dbFile, `DELETE FROM ${BRUSH} WHERE name='${name}';`, {successStatusCode: 200, successMessage: messages.MATERIAL_DELETED})
    }
    async updateExtData({ newName, code, name }: NewBrush): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, getBrushQuery({ newName, code, name }), {successStatusCode: 200, successMessage: messages.MATERIAL_UPDATED})
    }
}

function getBrushQuery({ newName, code, name }: NewBrush) {
    const parts = []
    if (newName) parts.push(`name='${newName}'`)
    if (code) parts.push(`code='${code}'`)
    const query = parts.length > 0 ? `update ${BRUSH} set ${parts.join(', ')} where name='${name}';` : ""
    return query
}
