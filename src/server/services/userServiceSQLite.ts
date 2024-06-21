import { dataBaseQuery, dataBaseTransaction, hashData } from '../functions/other.js'
import { IUserServiceProvider } from '../../types/services.js';
import { Result, Token } from '../../types/server.js';
import { PERMISSIONS_SCHEMA, USER_ROLE_SCHEMA, User } from "../../types/user.js";
import messages from '../messages.js';
import { USER_TABLE_NAMES } from '../../types/schemas.js';
import { Permissions, RESOURCE, UserRole } from '../../types/user.js';
const { USERS, TOKENS, PERMISSIONS, USER_ROLES, ROLES} = USER_TABLE_NAMES
export default class UserServiceSQLite implements IUserServiceProvider {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getUsers(): Promise<Result<User[]>> {
        return dataBaseQuery(this.dbFile, `select * from ${USERS};`, {successStatusCode: 200})
    }
    async getTokens(): Promise<Result<Token[]>> {
        return dataBaseQuery(this.dbFile, `select * from ${TOKENS};`, {successStatusCode: 200})
    }
    async addToken({ token, username, time, lastActionTime }: Token): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `INSERT INTO ${TOKENS} (token, username, time, lastActionTime) VALUES('${token}', '${username}', ${time}, ${lastActionTime})`, {successStatusCode: 201})
    }
    async updateToken(token: string, lastActionTime: number): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `UPDATE ${TOKENS} set lastActionTime='${lastActionTime}' WHERE token='${token}';`, {successStatusCode: 200})
    }
    async deleteToken(token: string): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `DELETE FROM ${TOKENS} WHERE token='${token}'`, {successStatusCode: 200})
    }

    async clearAllTokens(): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `DELETE FROM ${TOKENS}`, {successStatusCode: 200})
    }

    async registerUser(userName: string, password: string): Promise<Result<null>> {
        const result = await hashData(password);
        return dataBaseQuery<null>(this.dbFile, `INSERT INTO ${USERS} (name, password) VALUES('${userName}', '${result.data}')`, {successStatusCode: 201, successMessage: messages.USER_ADDED})
    }

    async deleteUser(user: User): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `DELETE FROM ${USERS} where name='${user.name}';`, {successStatusCode: 200, successMessage: messages.USER_DELETED})
    }

    async getPermissions(role: string, resource: RESOURCE): Promise<Permissions>{
        const result = await dataBaseQuery(this.dbFile, `SELECT * FROM ${PERMISSIONS} where role='${role}' and resource='${resource}';`, { successStatusCode: 200 })
        const perm = result.data as Permissions[]
        return (perm && perm[0]) || { create: false, remove: false, read: false, update: false }
    }
    async getAllUserPermissions(role: string): Promise<PERMISSIONS_SCHEMA[]>{
        const result = await dataBaseQuery(this.dbFile, `SELECT * FROM ${PERMISSIONS} where role='${role}';`, {successStatusCode: 200})
        return result.data as PERMISSIONS_SCHEMA[] || []
    }
    async getUserRole(username: string) : Promise<string>{
        const result = await dataBaseQuery(this.dbFile, `SELECT * FROM ${USER_ROLES} where user='${username}';`, {successStatusCode: 200})
        const users = result?.data as USER_ROLE_SCHEMA[]
        return users && users[0].role || ""
    }
    async getRoles(): Promise<Result<UserRole[]>>{
        return await dataBaseQuery(this.dbFile, `SELECT * FROM ${ROLES};`, {successStatusCode: 200})
    }
    async addRole(name: string): Promise<Result<null>>{
        return dataBaseQuery<null>(this.dbFile, `INSERT INTO ${ROLES} (name) VALUES('${name}');`, {successStatusCode: 201, successMessage: messages.ROLE_ADDED})
    }
    async deleteRole(name: string): Promise<Result<null>>{
        return dataBaseTransaction(this.dbFile, [
            `DELETE FROM ${PERMISSIONS} where role='${name}';`,
            `DELETE FROM ${USER_ROLES} where role='${name}';`,
            `DELETE FROM ${ROLES} where name='${name}';`
        ], { successStatusCode: 200, successMessage: messages.ROLE_DELETED })
    }
}
