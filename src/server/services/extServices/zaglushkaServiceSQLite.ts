import { NewZaglushka, Zaglushka } from '../../../types/materials.js';
import { Result } from '../../../types/server.js';
import { IMaterialExtService } from '../../../types/services.js';
import { dataBaseQuery } from '../../functions/other.js';
import messages from '../../messages.js';
import { MAT_TABLE_NAMES } from '../../../types/schemas.js';
const { ZAGLUSHKA } = MAT_TABLE_NAMES
export default class ZagluskaServiceSQLite implements IMaterialExtService<Zaglushka> {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getExtData(): Promise<Result<Zaglushka[]>> {
        return dataBaseQuery(this.dbFile, `select * from ${ZAGLUSHKA};`, {successStatusCode: 200})
    }
    async addExtData({ name, dsp, code }: Zaglushka): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `insert into ${ZAGLUSHKA} (name, dsp, code) values('${name}', '${dsp}', '${code}');`, {successStatusCode: 201, successMessage: messages.MATERIAL_ADDED})
    }
    async deleteExtData(name: string): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `DELETE FROM ${ZAGLUSHKA} WHERE name='${name}';`, {successStatusCode: 200, successMessage: messages.MATERIAL_DELETED})
    }
    async updateExtData({ newName, dsp, code, name }: NewZaglushka): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, getZaglushkaQuery({ newName, dsp, code, name }), {successStatusCode: 200, successMessage: messages.MATERIAL_UPDATED})
    }
}

function getZaglushkaQuery({ newName, dsp, code, name }: NewZaglushka) {
    const parts = []
    if (newName) parts.push(`name='${newName}'`)
    if (code) parts.push(`code='${code}'`)
    if (dsp) parts.push(`dsp='${dsp}'`)
    const query = parts.length > 0 ? `update ${ZAGLUSHKA} set ${parts.join(', ')} where name='${name}';` : ""
    return query
}