import { Result } from '../../types/server.js';
import { ITemplateServiceProvider } from '../../types/services.js';
import { dataBaseQuery } from '../functions/database.js';
import messages from '../messages.js';
import { Template } from '../../types/templates.js';
import { StatusCodes } from 'http-status-codes';
import { OmitId } from '../../types/materials.js';
export default class TemplateServiceSQLite implements ITemplateServiceProvider {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }

    async getFasadTemplates(): Promise<Result<Template>> {
        return dataBaseQuery(this.dbFile, `select * from fasad;`, [], {successStatusCode: StatusCodes.OK})
    }
    async addFasadTemplate({ name, data }: OmitId<Template>): Promise<Result<null>>  {
        return dataBaseQuery(this.dbFile, `insert into fasad (name, data) values(?, ?);`, [name, data], {successStatusCode: StatusCodes.CREATED, successMessage: messages.TEMPLATE_ADDED})
    }
    async deleteFasadTemplate(id: number): Promise<Result<null>>  {
        return dataBaseQuery(this.dbFile, `DELETE FROM fasad WHERE name=?;`, [name], {successStatusCode: StatusCodes.OK, successMessage: messages.TEMPLATE_DELETED})
    }
    async updateFasadTemplate({ id, name, data }: Template): Promise<Result<null>>  {
        const tempQuery = getQuery({ id, name, data })
        return dataBaseQuery(this.dbFile, tempQuery.query, tempQuery.params, { successStatusCode: StatusCodes.OK, successMessage: messages.TEMPLATE_UPDATED })
    }
}

function getQuery({ id, name, data }: Template) {
    const parts = []
    const params = []
    if (name !== undefined) {
        parts.push(`name=?`)
        params.push(name)
    }
    if (data !== undefined) {
        parts.push(`data=?`)
        params.push(data)
    }
    params.push(id)
    const query = parts.length > 0 ? `update fasad set ${parts.join(', ')} where id=?;` : ""
    return { query, params }
}



