import { dataBaseQuery } from '../functions/other.js'
import { ISpecificationServiceProvider } from '../../types/services.js';
import { Result, SpecificationData } from '../../types/server.js';
import messages from '../messages.js';
import { SPEC_TABLE_NAMES } from '../functions/other.js';
import { DETAIL_NAME, WARDROBE_KIND, WardrobeDetailTable } from '../../types/wardrobe.js';
import { WardrobeDetailSchema } from '../../types/schemas.js';
const { MATERIALS, DETAIL_TABLE, DETAILS, DVP_TEMPLATES } = SPEC_TABLE_NAMES
export default class SpecificationServiceSQLite implements ISpecificationServiceProvider {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getSpecList(): Promise<Result<SpecificationData[]>> {
        return dataBaseQuery(this.dbFile, `select * from ${MATERIALS};`, { successStatusCode: 200 })
    }
    async updateSpecList({ name, caption, code, coef, id, purpose }: SpecificationData): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, getQuery({ name, caption, code, coef, id, purpose }), { successStatusCode: 200, successMessage: messages.DATA_UPDATED })
    }
    async getDetailTable({ kind, detailName }: { kind: WARDROBE_KIND, detailName?: DETAIL_NAME }): Promise<Result<WardrobeDetailTable[]>> {
        const query = detailName !== undefined ? `select * from ${DETAIL_TABLE} where wardrobe='${kind}' and name='${detailName}';` : `select * from ${DETAIL_TABLE} where wardrobe='${kind}';`
        return dataBaseQuery<WardrobeDetailTable[]>(this.dbFile, query, { successStatusCode: 200 })
    }
    async getDVPTemplates(): Promise<Result<{ width: number, length: number }[]>> {
        return dataBaseQuery(this.dbFile, `select * from ${DVP_TEMPLATES};`, { successStatusCode: 200 })
    }
    async getDetailNames(): Promise<Result<WardrobeDetailSchema[]>> {
        return dataBaseQuery(this.dbFile, `select * from ${DETAILS};`, { successStatusCode: 200 })
    }
}

function getQuery({ name, caption, code, coef, id, purpose }: SpecificationData) {
    const parts = []
    if (caption) parts.push(`caption='${caption}'`)
    if (code) parts.push(`code='${code}'`)
    if (coef) parts.push(`coef=${coef}`)
    if (id) parts.push(`id='${id}'`)
    if (purpose) parts.push(`purpose='${purpose}'`)
    const query = parts.length > 0 ? `update ${MATERIALS} set ${parts.join(', ')} where name='${name}';` : ""
    return query
}