import { NewZaglushka, Zaglushka } from '../../types/materials.js';
import { Results } from '../../types/server.js';
import { IMaterialExtService } from '../../types/services.js';
import { dataBaseQuery } from '../../functions/other.js';
import messages from '../../messages.js';
export default class ZagluskaServiceSQLite implements IMaterialExtService<Zaglushka> {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getExtData(): Promise<Results> {
        return dataBaseQuery(this.dbFile, `select * from 'zaglushka'`, {successStatusCode: 200})
    }
    async addExtData({ name, dsp, code }: Zaglushka) {
        return dataBaseQuery(this.dbFile, `insert into zaglushka (name, dsp, code) values('${name}', '${dsp}', '${code}');`, {successStatusCode: 201, successMessage: messages.ZAGLUSHKA_ADDED})
    }
    async deleteExtData(name: string) {
        return dataBaseQuery(this.dbFile, `DELETE FROM zaglushka WHERE name='${name}';`, {successStatusCode: 200, successMessage: messages.ZAGLUSHKA_DELETED})
    }
    async updateExtData({ newName, dsp, code, name }: NewZaglushka) {
        return dataBaseQuery(this.dbFile, getZaglushkaQuery({ newName, dsp, code, name }), {successStatusCode: 200, successMessage: messages.ZAGLUSHKA_UPDATED})
    }
}

function getZaglushkaQuery({ newName, dsp, code, name }: NewZaglushka) {
    const parts = []
    if (newName) parts.push(`name='${newName}'`)
    if (code) parts.push(`code='${code}'`)
    if (dsp) parts.push(`dsp='${dsp}'`)
    const query = parts.length > 0 ? `update zaglushka set ${parts.join(', ')} where name='${name}';` : ""
    return query
}