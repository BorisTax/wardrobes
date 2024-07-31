import { dataBaseQuery } from '../functions/database.js'
import { ISpecificationServiceProvider } from '../../types/services.js';
import { Result, SpecificationData } from '../../types/server.js';
import messages from '../messages.js';
import { SPEC_TABLE_NAMES } from '../../types/schemas.js';
import { DETAIL_NAME, WARDROBE_KIND, WardrobeDetailTable } from '../../types/wardrobe.js';
import { DVPTableSchema, WardrobeDetailSchema, WardrobeFurnitureTableSchema, WardrobeTableSchema } from '../../types/schemas.js';
import { SpecificationItem } from '../../types/specification.js';
import { StatusCodes } from 'http-status-codes';
import { it } from 'node:test';
const { MATERIALS, DETAIL_TABLE, DETAILS, DVP_TEMPLATES, FURNITURE, WARDROBES } = SPEC_TABLE_NAMES
export default class SpecificationServiceSQLite implements ISpecificationServiceProvider {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getSpecList(): Promise<Result<SpecificationData[]>> {
        return dataBaseQuery(this.dbFile, `select * from ${MATERIALS} order by caption;`, [], { successStatusCode: StatusCodes.OK })
    }
    async updateSpecList({ name, caption, code, coef, id, purpose }: SpecificationData): Promise<Result<null>> {
        const query = getQuery({ name, caption, code, coef, id, purpose })
        return dataBaseQuery(this.dbFile, query.query, query.params, { successStatusCode: StatusCodes.OK, successMessage: messages.DATA_UPDATED })
    }
    async getDetailTable({ kind, detailName }: { kind: WARDROBE_KIND, detailName?: DETAIL_NAME }): Promise<Result<WardrobeDetailTable[]>> {
        const query = detailName !== undefined ? `select * from ${DETAIL_TABLE} where wardrobe=? and name=?;` : `select * from ${DETAIL_TABLE} where wardrobe=?;`
        return dataBaseQuery<WardrobeDetailTable[]>(this.dbFile, query, [kind, detailName], { successStatusCode: StatusCodes.OK })
    }
    async getDetails(kind: WARDROBE_KIND, width: number, height: number): Promise<WardrobeDetailTable[]> {
        const query = `select * from ${DETAIL_TABLE} where wardrobe=? and minwidth<=? and maxwidth>=? and minheight<=? and maxheight>=?;`
        const result = (await (dataBaseQuery<WardrobeDetailTable[]>(this.dbFile, query, [kind, width, width, height, height], { successStatusCode: StatusCodes.OK }))).data
        return result as WardrobeDetailTable[]
    }
    async getFurniture(kind: WARDROBE_KIND, name: SpecificationItem, width: number, height: number, depth: number): Promise<WardrobeFurnitureTableSchema | null>{
        const query = `select * from ${FURNITURE} where wardrobe=? and name=? and minwidth<=? and maxwidth>=? and minheight<=? and maxheight>=? and mindepth<=? and maxdepth>=?;`
        const result = (await (dataBaseQuery<WardrobeFurnitureTableSchema[]>(this.dbFile, query, [kind, name, width, width, height, height, depth, depth], { successStatusCode: StatusCodes.OK }))).data
       return (result && result[0]) || null
    }
    async getDVPTemplates(): Promise<Result<DVPTableSchema[]>> {
        return dataBaseQuery(this.dbFile, `select * from ${DVP_TEMPLATES};`, [], { successStatusCode: StatusCodes.OK })
    }
    async getDetailNames(): Promise<Result<WardrobeDetailSchema[]>> {
        return dataBaseQuery(this.dbFile, `select * from ${DETAILS};`, [], { successStatusCode: StatusCodes.OK })
    }
    async getFurnitureTable({ kind, item }: { kind: WARDROBE_KIND, item?: SpecificationItem }): Promise<Result<WardrobeFurnitureTableSchema[]>>{
        const query = item !== undefined ? `select * from ${FURNITURE} where wardrobe=? and name=?;` : `select * from ${FURNITURE} where wardrobe=?;`
        return dataBaseQuery<WardrobeFurnitureTableSchema[]>(this.dbFile, query, [kind, item], { successStatusCode: StatusCodes.OK })
    }
    async getWardobeKinds(): Promise<Result<WardrobeTableSchema[]>>{
        return dataBaseQuery(this.dbFile, `select * from ${WARDROBES};`, [], { successStatusCode: StatusCodes.OK })
    }
}

function getQuery({ name, caption, code, coef, id, purpose }: SpecificationData) {
    const parts = []
    const params = []
    if (caption !== undefined) {
        parts.push(`caption=?`)
        params.push(caption)
    }
    if (code !== undefined) {
        parts.push(`code=?`)
        params.push(code)
    }
    if (coef !== undefined) {
        parts.push(`coef=?`)
        params.push(coef)
    }
    if (id !== undefined) {
        parts.push(`id=?`)
        params.push(id)
    }
    if (purpose !== undefined) {
        parts.push(`purpose=?`)
        params.push(purpose)
    }
    params.push(name)
    const query = parts.length > 0 ? `update ${MATERIALS} set ${parts.join(', ')} where name=?;` : ""
    return { query, params }
}