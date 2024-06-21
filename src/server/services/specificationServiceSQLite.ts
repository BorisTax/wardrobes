import { dataBaseQuery } from '../functions/other.js'
import { ISpecificationServiceProvider } from '../../types/services.js';
import { Result, SpecificationData } from '../../types/server.js';
import messages from '../messages.js';
import { SPEC_TABLE_NAMES } from '../../types/schemas.js';
import { DETAIL_NAME, WARDROBE_KIND, WardrobeDetailTable } from '../../types/wardrobe.js';
import { DVPTableSchema, WardrobeDetailSchema, WardrobeFurnitureTableSchema, WardrobeTableSchema } from '../../types/schemas.js';
import { SpecificationItem } from '../../types/specification.js';
const { MATERIALS, DETAIL_TABLE, DETAILS, DVP_TEMPLATES, FURNITURE, WARDROBES } = SPEC_TABLE_NAMES
export default class SpecificationServiceSQLite implements ISpecificationServiceProvider {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getSpecList(): Promise<Result<SpecificationData[]>> {
        return dataBaseQuery(this.dbFile, `select * from ${MATERIALS} order by caption;`, { successStatusCode: 200 })
    }
    async updateSpecList({ name, caption, code, coef, id, purpose }: SpecificationData): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, getQuery({ name, caption, code, coef, id, purpose }), { successStatusCode: 200, successMessage: messages.DATA_UPDATED })
    }
    async getDetailTable({ kind, detailName }: { kind: WARDROBE_KIND, detailName?: DETAIL_NAME }): Promise<Result<WardrobeDetailTable[]>> {
        const query = detailName !== undefined ? `select * from ${DETAIL_TABLE} where wardrobe='${kind}' and name='${detailName}';` : `select * from ${DETAIL_TABLE} where wardrobe='${kind}';`
        return dataBaseQuery<WardrobeDetailTable[]>(this.dbFile, query, { successStatusCode: 200 })
    }
    async getDVPTemplates(): Promise<Result<DVPTableSchema[]>> {
        return dataBaseQuery(this.dbFile, `select * from ${DVP_TEMPLATES};`, { successStatusCode: 200 })
    }
    async getDetailNames(): Promise<Result<WardrobeDetailSchema[]>> {
        return dataBaseQuery(this.dbFile, `select * from ${DETAILS};`, { successStatusCode: 200 })
    }
    async getFurnitureTable({ kind, item }: { kind: WARDROBE_KIND, item?: SpecificationItem }): Promise<Result<WardrobeFurnitureTableSchema[]>>{
        const query = item !== undefined ? `select * from ${FURNITURE} where wardrobe='${kind}' and name='${item}';` : `select * from ${FURNITURE} where wardrobe='${kind}';`
        return dataBaseQuery<WardrobeFurnitureTableSchema[]>(this.dbFile, query, { successStatusCode: 200 })
    }
    async getWardobeKinds(): Promise<Result<WardrobeTableSchema[]>>{
        return dataBaseQuery(this.dbFile, `select * from ${WARDROBES};`, { successStatusCode: 200 })
    }
}

function getQuery({ name, caption, code, coef, id, purpose }: SpecificationData) {
    const parts = []
    if (caption !== undefined) parts.push(`caption='${caption}'`)
    if (code !== undefined) parts.push(`code='${code}'`)
    if (coef !== undefined) parts.push(`coef=${coef}`)
    if (id !== undefined) parts.push(`id='${id}'`)
    if (purpose !== undefined) parts.push(`purpose='${purpose}'`)
    const query = parts.length > 0 ? `update ${MATERIALS} set ${parts.join(', ')} where name='${name}';` : ""
    return query
}