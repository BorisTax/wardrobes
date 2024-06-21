import { dataBaseQuery } from '../functions/other.js'
import { USER_TABLE_NAMES } from '../../types/schemas.js';
import { IPermissionServiceProvider } from '../../types/services.js';
import { Result } from '../../types/server.js';
import messages from '../messages.js';
import { PERMISSIONS_SCHEMA, Permissions, RESOURCE, Resource } from '../../types/user.js';
const { PERMISSIONS, RESOURCES } = USER_TABLE_NAMES
export default class PermissionServiceSQLite implements IPermissionServiceProvider {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }

    async getPermissions(role: string): Promise<Result<PERMISSIONS_SCHEMA[]>> {
        return dataBaseQuery(this.dbFile, `select * from ${PERMISSIONS} where role='${role}';`, { successStatusCode: 200 })
    }
    async addPermissions(role: string, resource: RESOURCE, permissions: Permissions): Promise<Result<null>>  {
        const { create, read, update, remove } = permissions
        return dataBaseQuery(this.dbFile, `insert into ${PERMISSIONS} ('role', 'resource', 'create', 'read', 'update', 'remove') values('${role}', '${resource}', ${create ? 1 : 0}, ${read ? 1 : 0}, ${update ? 1 : 0}, ${remove ? 1 : 0});`, { successStatusCode: 201, successMessage: messages.DATA_UPDATED })
    }
    async deletePermissions(role: string, resource: RESOURCE): Promise<Result<null>>  {
        return dataBaseQuery(this.dbFile, `DELETE FROM ${PERMISSIONS} WHERE role='${role}' and resource='${resource}';`, { successStatusCode: 200, successMessage: messages.DATA_UPDATED })
    }
    async updatePermissions(role: string, resource: RESOURCE, permissions: Permissions): Promise<Result<null>>  {
        const { create, read, update, remove } = permissions
        return dataBaseQuery(this.dbFile, `update ${PERMISSIONS} set 'create'=${create ? 1 : 0}, 'read'=${read ? 1 : 0}, 'update'=${update ? 1 : 0}, 'remove'=${remove ? 1 : 0} where role='${role}' and resource='${resource}';`, { successStatusCode: 200, successMessage: messages.DATA_UPDATED })
    }
    async getResourceList(): Promise<Result<Resource>>{
        return dataBaseQuery(this.dbFile, `select * from ${RESOURCES};`, { successStatusCode: 200 })
    }
}
