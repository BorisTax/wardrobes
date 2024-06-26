import { dataBaseQuery } from '../functions/other.js'
import { ISpecificationServiceProvider } from '../../types/services.js';
import { Result, SpecificationData } from '../../types/server.js';
import messages from '../messages.js';
import { SPEC_TABLE_NAMES } from '../../types/schemas.js';
import { DETAIL_NAME, WARDROBE_KIND, WardrobeDetailTable } from '../../types/wardrobe.js';
import { DVPTableSchema, WardrobeDetailSchema, WardrobeFurnitureTableSchema, WardrobeTableSchema } from '../../types/schemas.js';
import { SpecificationItem } from '../../types/specification.js';
import { StatusCodes } from 'http-status-codes';
const { MATERIALS, DETAIL_TABLE, DETAILS, DVP_TEMPLATES, FURNITURE, WARDROBES } = SPEC_TABLE_NAMES
export default class SpecificationServiceSQLite implements ISpecificationServiceProvider {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getSpecList(): Promise<Result<SpecificationData[]>> {
        return dataBaseQuery(this.dbFile, `select * from ${MATERIALS} order by caption;`, { successStatusCode: StatusCodes.OK })
    }
    async updateSpecList({ name, caption, code, coef, id, purpose }: SpecificationData): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, getQuery({ name, caption, code, coef, id, purpose }), { successStatusCode: StatusCodes.OK, successMessage: messages.DATA_UPDATED })
    }
    async getDetailTable({ kind, detailName }: { kind: WARDROBE_KIND, detailName?: DETAIL_NAME }): Promise<Result<WardrobeDetailTable[]>> {
        const query = detailName !== undefined ? `select * from ${DETAIL_TABLE} where wardrobe='${kind}' and name='${detailName}';` : `select * from ${DETAIL_TABLE} where wardrobe='${kind}';`
        return dataBaseQuery<WardrobeDetailTable[]>(this.dbFile, query, { successStatusCode: StatusCodes.OK })
    }
    async getDetail(kind: WARDROBE_KIND, name: DETAIL_NAME, width: number, height: number): Promise<WardrobeDetailTable | null> {
        const query = `select * from ${DETAIL_TABLE} where wardrobe='${kind}' and name='${name}'
         and minwidth<=${width} and maxwidth>=${width} and minheight<=${height} and maxheight>=${height};`
        const result = (await (dataBaseQuery<WardrobeDetailTable[]>(this.dbFile, query, { successStatusCode: StatusCodes.OK }))).data
        return (result && result[0]) || null
    }
    async getFurniture(kind: WARDROBE_KIND, name: SpecificationItem, width: number, height: number, depth: number): Promise<WardrobeFurnitureTableSchema | null>{
        const query = `select * from ${FURNITURE} where wardrobe='${kind}' and name='${name}'
        and minwidth<=${width} and maxwidth>=${width} and minheight<=${height} and maxheight>=${height} and mindepth<=${depth} and maxdepth>=${depth};`
        const result = (await (dataBaseQuery<WardrobeFurnitureTableSchema[]>(this.dbFile, query, { successStatusCode: StatusCodes.OK }))).data
       return (result && result[0]) || null
    }
    async getDVPTemplates(): Promise<Result<DVPTableSchema[]>> {
        return dataBaseQuery(this.dbFile, `select * from ${DVP_TEMPLATES};`, { successStatusCode: StatusCodes.OK })
    }
    async getDetailNames(): Promise<Result<WardrobeDetailSchema[]>> {
        return dataBaseQuery(this.dbFile, `select * from ${DETAILS};`, { successStatusCode: StatusCodes.OK })
    }
    async getFurnitureTable({ kind, item }: { kind: WARDROBE_KIND, item?: SpecificationItem }): Promise<Result<WardrobeFurnitureTableSchema[]>>{
        const query = item !== undefined ? `select * from ${FURNITURE} where wardrobe='${kind}' and name='${item}';` : `select * from ${FURNITURE} where wardrobe='${kind}';`
        return dataBaseQuery<WardrobeFurnitureTableSchema[]>(this.dbFile, query, { successStatusCode: StatusCodes.OK })
    }
    async getWardobeKinds(): Promise<Result<WardrobeTableSchema[]>>{
        return dataBaseQuery(this.dbFile, `select * from ${WARDROBES};`, { successStatusCode: StatusCodes.OK })
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