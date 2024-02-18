import { dataBaseQuery } from '../functions.js'
import { IPriceServiceProvider } from '../../types/services.js';
import { PriceListItem, Results } from '../../types/server.js';
import messages from '../messages.js';

export default class PriceServiceSQLite implements IPriceServiceProvider {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getPriceList(): Promise<Results> {
        return dataBaseQuery(this.dbFile, "select * from 'pricelist'", { successStatusCode: 200 })
    }
    async updatePriceList({ name, caption, code, id, price }: PriceListItem) {
        return dataBaseQuery(this.dbFile, getPriceQuery({ name, caption, code, id, price }), { successStatusCode: 200, successMessage: messages.PRICELIST_UPDATED })
    }

}

function getPriceQuery({ name, caption, code, id, price }: PriceListItem) {
    const parts = []
    if (code) parts.push(`code='${code}'`)
    if (caption) parts.push(`caption='${caption}'`)
    if (id) parts.push(`id='${id}'`)
    if (price) parts.push(`price=${price}`)
    const query = parts.length > 0 ? `update pricelist set ${parts.join(', ')} where name='${name}';` : ""
    return query
}