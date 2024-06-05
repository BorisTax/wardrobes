import { dataBaseQuery } from '../functions/other.js'
import { IPriceServiceProvider } from '../../types/services.js';
import { PriceListItem, Result, Results } from '../../types/server.js';
import messages from '../messages.js';

export default class PriceServiceSQLite implements IPriceServiceProvider {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getPriceList(): Promise<Result<PriceListItem[]>> {
        return dataBaseQuery(this.dbFile, "select * from 'pricelist'", { successStatusCode: 200 })
    }
    async updatePriceList({ name, caption, coef, code, id, price, markup }: PriceListItem): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, getPriceQuery({ name, caption, coef, code, id, price, markup }), { successStatusCode: 200, successMessage: messages.PRICELIST_UPDATED })
    }

}

function getPriceQuery({ name, caption, coef, code, id, price, markup }: PriceListItem) {
    const parts = []
    if (code) parts.push(`code='${code}'`)
    if (caption) parts.push(`caption='${caption}'`)
    if (coef !== undefined) parts.push(`coef=${coef}`)
    if (id) parts.push(`id='${id}'`)
    if (price) parts.push(`price=${price}`)
    if (markup) parts.push(`markup=${markup}`)
    const query = parts.length > 0 ? `update pricelist set ${parts.join(', ')} where name='${name}';` : ""
    return query
}