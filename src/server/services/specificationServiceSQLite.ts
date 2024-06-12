import { dataBaseQuery } from '../functions/other.js'
import { IPriceServiceProvider, ISpecificationServiceProvider } from '../../types/services.js';
import { Result, PriceData, SpecificationData } from '../../types/server.js';
import messages from '../messages.js';
import { SPEC_TABLE_NAMES } from '../functions/other.js';
const { MATERIALS } = SPEC_TABLE_NAMES
export default class SpecificationServiceSQLite implements ISpecificationServiceProvider {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getSpecList(): Promise<Result<SpecificationData[]>> {
        return dataBaseQuery(this.dbFile, `select * from ${MATERIALS};`, { successStatusCode: 200 })
    }
    async updateSpecList({ name, caption, code, coef, id, purpose }: SpecificationData): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, getQuery({ name, caption, code, coef, id, purpose }), { successStatusCode: 200, successMessage: messages.PRICELIST_UPDATED })
    }

}

function getQuery({ name, caption, code, coef, id, purpose }: SpecificationData) {
    const parts = []
    if (caption) parts.push(`caption=${caption}`)
    if (code) parts.push(`code=${code}`)
    if (coef) parts.push(`coef=${coef}`)
    if (id) parts.push(`id=${id}`)
    if (purpose) parts.push(`purpose=${purpose}`)
    const query = parts.length > 0 ? `update specification set ${parts.join(', ')} where name='${name}';` : ""
    return query
}