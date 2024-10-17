import { dataBaseQuery } from '../functions/database.js'
import { USER_TABLE_NAMES } from '../../types/schemas.js';
import { IPermissionServiceProvider } from '../../types/services.js';
import { Result } from '../../types/server.js';
import messages from '../messages.js';
import { PERMISSIONS_SCHEMA, UserPermissions, RESOURCE, Resource } from '../../types/user.js';
import { StatusCodes } from 'http-status-codes';
const { PERMISSIONS, RESOURCES } = USER_TABLE_NAMES
export default class PermissionServiceSQLite implements IPermissionServiceProvider {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }

    async getPermissions(roleId: number): Promise<Result<PERMISSIONS_SCHEMA>> {
        return dataBaseQuery(this.dbFile, `select * from ${PERMISSIONS} where roleId=?;`, [roleId], { successStatusCode: StatusCodes.OK })
    }
    async addPermissions(roleId: number, resource: RESOURCE, permissions: UserPermissions): Promise<Result<null>>  {
        const { Create, Read, Update, Delete } = permissions
        return dataBaseQuery(this.dbFile, `insert into ${PERMISSIONS} ('roleId', 'resource', 'create', 'read', 'update', 'delete') values(?, ?, ?, ?, ?, ?);`, [roleId, resource, Create ? 1 : 0, Read ? 1 : 0, Update ? 1 : 0, Delete ? 1 : 0], { successStatusCode: StatusCodes.CREATED, successMessage: messages.DATA_UPDATED })
    }
    async deletePermissions(roleId: number, resource: RESOURCE): Promise<Result<null>>  {
        return dataBaseQuery(this.dbFile, `DELETE FROM ${PERMISSIONS} WHERE roleId=? and resource=?;`, [roleId, resource], { successStatusCode: StatusCodes.OK, successMessage: messages.DATA_UPDATED })
    }
    async updatePermissions(roleId: number, resource: RESOURCE, permissions: UserPermissions): Promise<Result<null>>  {
        const { Create, Read, Update, Delete } = permissions
        return dataBaseQuery(this.dbFile, `update ${PERMISSIONS} set 'create'=?, 'read'=?, 'update'=?, 'delete'=? where roleId=? and resource=?;`, [Create ? 1 : 0, Read ? 1 : 0, Update ? 1 : 0, Delete ? 1 : 0, roleId, resource], { successStatusCode: StatusCodes.OK, successMessage: messages.DATA_UPDATED })
    }
    async getResourceList(): Promise<Result<Resource>>{
        return dataBaseQuery(this.dbFile, `select * from ${RESOURCES};`, [], { successStatusCode: StatusCodes.OK })
    }
}
