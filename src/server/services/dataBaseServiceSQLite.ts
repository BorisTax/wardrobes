import { OmitId } from '../../types/materials.js';
import { Result } from '../../types/server.js';
import { IDataBaseService } from '../../types/services.js';
import { dataBaseQuery } from '../functions/database.js';
import messages from '../messages.js';
import { KeySet, TABLE_NAMES } from '../../types/schemas.js';
import { StatusCodes } from 'http-status-codes';

export default class DataBaseServiceSQLite<T extends { id: number }> implements IDataBaseService<T> {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getData(table: TABLE_NAMES, columns: KeySet<T>, values: Partial<T>): Promise<Result<T>> {
        const query = getQuery(table, columns, values)
        return dataBaseQuery<T>(this.dbFile, query.query, query.params, { successStatusCode: StatusCodes.OK })
    }
    async addData(table: TABLE_NAMES, data: Partial<T>): Promise<Result<T>> {
        const columns = Object.keys(data).map(c => `"${c}"`)
        const values = Object.values(data)
        return dataBaseQuery(this.dbFile, `insert into ${table} (${columns}) values(${[columns.map(_ => '?')]});`, values, { successStatusCode: StatusCodes.CREATED, successMessage: messages.DATA_ADDED })
    }
    async deleteData(table: TABLE_NAMES, lookIn: Partial<T>): Promise<Result<null>> {
        const query = getDeleteQuery(table, lookIn)
        return dataBaseQuery(this.dbFile, query.query, query.params, { successStatusCode: StatusCodes.OK, successMessage: messages.DATA_DELETED })
    }
    async updateData(table: TABLE_NAMES, lookIn: Partial<T>, update: Partial<T>): Promise<Result<null>> {
        const query = getUpdateQuery(table, lookIn, update)
        return dataBaseQuery(this.dbFile, query.query, query.params, { successStatusCode: StatusCodes.OK, successMessage: messages.DATA_UPDATED })
    }
}

function getQuery<T>(table: TABLE_NAMES, columns: KeySet<T>, values: Partial<T>) {
    const params: any[] = []
    const entries = Object.entries(values).map(e => {
        params.push(e[1]);
        return `"${e[0]}"=?`
    })
    const what = columns.length === 0 ? "*" : columns.join(", ")
    const condition = entries.length === 0 ? "" : " where " + entries.join(" and ")
    const query = `select ${what} from ${table}${condition};`
    return { query, params }
}

function getUpdateQuery<T>(table: TABLE_NAMES, lookIn: Partial<T>, update: Partial<T>) {
    const params: any[] = []
    const entries = Object.entries(update).map(e => {
        params.push(e[1]);
        return `"${e[0]}"=?`
    })
    const cols = Object.entries(lookIn).map(e => {
        params.push(e[1]);
        return `"${e[0]}"=?`
    })
    const where = cols.length === 0 ? "" : cols.join(" and ")
    const data = entries.length === 0 ? "" : entries.join(", ")
    const query = cols.length > 0 ? `update ${table} set ${data} where ${where};` : ""
    return { query, params }
}

function getDeleteQuery<T>(table: TABLE_NAMES,  lookIn: Partial<T>) {
    const params: any[] = []
    const entries = Object.entries(lookIn).map(e => {
        params.push(e[1]);
        return `${e[0]}=?`
    })
    const condition = entries.length === 0 ? "" : " where " + entries.join(" and ")
    const query = condition && `delete from ${table}${condition};`
    return { query, params }
}