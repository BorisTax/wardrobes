import { Trempel } from '../../types/materials.js';
import { Results } from '../../types/server.js';
import { IMaterialExtService } from '../../types/services.js';
import { dataBaseQuery } from '../../functions/other.js';
import messages from '../../messages.js';
export default class TrempelServiceSQLite implements IMaterialExtService<Trempel> {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getExtData(): Promise<Results> {
        return dataBaseQuery(this.dbFile, `select * from 'trempel'`, {successStatusCode: 200})
    }
    async addExtData({ name, code }: Trempel) {
        return dataBaseQuery(this.dbFile, `insert into trempel (name, code) values('${name}', '${code}');`, {successStatusCode: 201, successMessage: messages.MATERIAL_ADDED})
    }
    async deleteExtData(name: string) {
        return dataBaseQuery(this.dbFile, `DELETE FROM trempel WHERE name='${name}';`, {successStatusCode: 200, successMessage: messages.MATERIAL_DELETED})
    }
    async updateExtData({ newName, code, name }: Trempel & {newName: string}) {
        return dataBaseQuery(this.dbFile, getQuery({ newName, code, name }), {successStatusCode: 200, successMessage: messages.MATERIAL_UPDATED})
    }
}

function getQuery({ newName, code, name }: Trempel & {newName: string}) {
    const parts = []
    if (newName) parts.push(`name='${newName}'`)
    if (code) parts.push(`code='${code}'`)
    const query = parts.length > 0 ? `update trempel set ${parts.join(', ')} where name='${name}';` : ""
    return query
}
