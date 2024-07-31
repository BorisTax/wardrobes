import { Result } from '../../types/server.js';
import { ITemplateServiceProvider } from '../../types/services.js';
import { dataBaseQuery } from '../functions/database.js';
import messages from '../messages.js';
import { NewTemplate, Template } from '../../types/templates.js';
import { StatusCodes } from 'http-status-codes';
export default class TemplateServiceSQLite implements ITemplateServiceProvider {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }

    async getTemplates(table: string): Promise<Result<Template[]>> {
        return dataBaseQuery(this.dbFile, `select * from ?`, [table], {successStatusCode: StatusCodes.OK})
    }
    async addTemplate(table: string, { name, data }: Template): Promise<Result<null>>  {
        return dataBaseQuery(this.dbFile, `insert into ? (name, data) values(?, ?);`, [table, name, data], {successStatusCode: StatusCodes.CREATED, successMessage: messages.TEMPLATE_ADDED})
    }
    async deleteTemplate(table: string, name: string): Promise<Result<null>>  {
        return dataBaseQuery(this.dbFile, `DELETE FROM ? WHERE name=?;`, [table, name], {successStatusCode: StatusCodes.OK, successMessage: messages.TEMPLATE_DELETED})
    }
    async updateTemplate(table: string, { newName, name, data }: NewTemplate): Promise<Result<null>>  {
        const tempQuery = getQuery(table, { newName, name, data })
        return dataBaseQuery(this.dbFile, tempQuery.query, tempQuery.params, { successStatusCode: StatusCodes.OK, successMessage: messages.TEMPLATE_UPDATED })
    }
}

function getQuery(table: string, { newName, name, data }: NewTemplate) {
    const parts = []
    const params = [table]
    if (newName !== undefined) {
        parts.push(`name=?`)
        params.push(newName)
    }
    if (data !== undefined) {
        parts.push(`data=?`)
        params.push(data)
    }
    params.push(name)
    const query = parts.length > 0 ? `update ? set ${parts.join(', ')} where name=?;` : ""
    return { query, params }
}



