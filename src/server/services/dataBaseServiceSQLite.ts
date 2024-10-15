import { OmitId } from '../../types/materials.js';
import { Result } from '../../types/server.js';
import { IDataBaseService } from '../../types/services.js';
import { dataBaseQuery } from '../functions/database.js';
import messages from '../messages.js';
import { DATA_TABLE_NAMES, KeySet } from '../../types/schemas.js';
import { StatusCodes } from 'http-status-codes';

export default class DataBaseServiceSQLite<T extends { id: number }> implements IDataBaseService<T> {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getData(table: DATA_TABLE_NAMES, columns: KeySet<T>, values: Partial<T>): Promise<Result<T[]>> {
        const query = getQuery(table, columns, values)
        return dataBaseQuery(this.dbFile, query.query, query.params, {successStatusCode: StatusCodes.OK})
    }
    async addData(table: DATA_TABLE_NAMES, data: OmitId<T>): Promise<Result<T[]>> {
        const params = Object.keys(data)
        return dataBaseQuery(this.dbFile, `insert into ${table} (${params}) values(${[params.map(_ => '?')]});`, params, { successStatusCode: StatusCodes.CREATED, successMessage: messages.DATA_ADDED })
    }
    async deleteData(table: DATA_TABLE_NAMES, id: number): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `DELETE FROM ${table} WHERE id=?;`, [id], {successStatusCode: StatusCodes.OK, successMessage: messages.DATA_DELETED})
    }
    async updateData(table: DATA_TABLE_NAMES, data: Partial<T>): Promise<Result<null>> {
        const query = getUpdateQuery(data, table)
        return dataBaseQuery(this.dbFile, query.query, query.params, { successStatusCode: StatusCodes.OK, successMessage: messages.DATA_UPDATED })
    }
}

function getQuery<T extends { id: number }>(table: DATA_TABLE_NAMES, columns: KeySet<T>, values: Partial<T> ) {
    const params: any[] = []
    const entries = Object.entries(values).map(e => {
        params.push(e[1]);
        return `${e[0]}=?`
    })
    const what = columns.length === 0 ? "*" : columns.join(", ")
    const condition = entries.length === 0 ? "" : " where " + entries.join(" and ")
    const query = `select ${what} from ${table}${condition};`
    return { query, params }
}

function getUpdateQuery<T extends { id: number }>(data: Partial<T>, table: DATA_TABLE_NAMES) {
    const entries = Object.entries(data as object).filter(p => p[0] !== 'id' && p[1] !== undefined)
    const keys = entries.map(p => p[0])
    const values = entries.map(p => p[1])
    values.push(data.id)
    const query = keys.length > 0 ? `update ${table} set ${keys.join(', ')} where id=?;` : ""
    return { query, params: values }
}
