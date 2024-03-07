import { Results } from '../types/server.js';
import { ITemplateServiceProvider } from '../types/services.js';
import { dataBaseQuery } from '../functions/other.js';
import messages from '../messages.js';
import { NewTemplate, Template } from '../types/templates.js';
export default class TemplateServiceSQLite implements ITemplateServiceProvider {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }

    async getTemplates(): Promise<Results> {
        return dataBaseQuery(this.dbFile, `select * from 'state'`, {successStatusCode: 200})
    }
    async addTemplate({ name, data }: Template) {
        return dataBaseQuery(this.dbFile, `insert into state (name, data) values('${name}', '${data}');`, {successStatusCode: 201, successMessage: messages.TEMPLATE_ADDED})
    }
    async deleteTemplate(name: string) {
        return dataBaseQuery(this.dbFile, `DELETE FROM state WHERE name='${name}';`, {successStatusCode: 200, successMessage: messages.TEMPLATE_DELETED})
    }
    async updateTemplate({ newName, name, data }: NewTemplate) {
        return dataBaseQuery(this.dbFile, getQuery({ newName, name, data }), {successStatusCode: 200, successMessage: messages.TEMPLATE_UPDATED})
    }
}

function getQuery({ newName, name, data }: NewTemplate) {
    const parts = []
    if (newName) parts.push(`name='${newName}'`)
    if (data) parts.push(`data='${data}'`)
    const query = parts.length > 0 ? `update state set ${parts.join(', ')} where name='${name}';` : ""
    return query
}



