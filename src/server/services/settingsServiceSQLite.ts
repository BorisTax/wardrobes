import { dataBaseQuery, dataBaseTransaction } from '../functions/database.js'
import { Query, SETTINGS_TABLE_NAMES } from '../../types/schemas.js';
import { Result } from '../../types/server.js';
import messages from '../messages.js';
import { StatusCodes } from 'http-status-codes';
import { SettingsThemeSchema } from '../../types/themes.js';
import { ISettingsService } from '../../types/services.js';
const { THEMES } = SETTINGS_TABLE_NAMES
export default class SettingsServiceSQLite implements ISettingsService {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }

    async getThemes(): Promise<Result<SettingsThemeSchema>> {
        return dataBaseQuery(this.dbFile, `select * from ${THEMES};`, [], { successStatusCode: StatusCodes.OK })
    }
    async setTheme(id: number): Promise<Result<null>> {
        const queries: Query[] = [
            { query: `update ${THEMES} set in_use=0;`, params: [] },
            { query: `update ${THEMES} set in_use=1 where id=${id}`, params: [] }
        ]
        return dataBaseTransaction(this.dbFile, queries, { successStatusCode: StatusCodes.CREATED, successMessage: messages.DATA_UPDATED })
        //dataBaseQuery(this.dbFile, `insert into ${PERMISSIONS} ('roleId', 'resource', 'create', 'read', 'update', 'delete') values(?, ?, ?, ?, ?, ?);`, [roleId, resource, Create ? 1 : 0, Read ? 1 : 0, Update ? 1 : 0, Delete ? 1 : 0], { successStatusCode: StatusCodes.CREATED, successMessage: messages.DATA_UPDATED })
    }

}
