import { dataBaseQuery } from '../functions/database.js'
import { IPriceServiceProvider } from '../../types/services.js';
import { Result, PriceData } from '../../types/server.js';
import messages from '../messages.js';
import { SPEC_TABLE_NAMES } from '../../types/schemas.js';
import { StatusCodes } from 'http-status-codes';
const { PRICELIST } = SPEC_TABLE_NAMES
export default class PriceServiceSQLite implements IPriceServiceProvider {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getPriceList(): Promise<Result<PriceData[]>> {
        return dataBaseQuery(this.dbFile, `select * from ${PRICELIST};`, { successStatusCode: StatusCodes.OK })
    }
    async updatePriceList({ name, price, markup }: PriceData): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, getPriceQuery({ name, price, markup }), { successStatusCode: StatusCodes.OK, successMessage: messages.DATA_UPDATED })
    }

}

function getPriceQuery({ name, price, markup }: PriceData) {
    const parts = []
    if (price !== undefined) parts.push(`price=${price}`)
    if (markup !== undefined) parts.push(`markup=${markup}`)
    const query = parts.length > 0 ? `update ${PRICELIST} set ${parts.join(', ')} where name='${name}';` : ""
    return query
}