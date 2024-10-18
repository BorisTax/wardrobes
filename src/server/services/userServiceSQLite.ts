import { dataBaseQuery, dataBaseTransaction, hashData } from '../functions/database.js'
import { IUserServiceProvider } from '../../types/services.js';
import { Result, Token } from '../../types/server.js';
import { PermissionSchema, USER_ROLE_SCHEMA, User } from "../../types/user.js";
import messages from '../messages.js';
import { Query, USER_TABLE_NAMES } from '../../types/schemas.js';
import { UserPermissions, RESOURCE, UserRole } from '../../types/user.js';
import { StatusCodes } from 'http-status-codes';
const { USERS, TOKENS, PERMISSIONS, USER_ROLES, ROLES, SUPERUSERS, SUPERROLES } = USER_TABLE_NAMES
export default class UserServiceSQLite implements IUserServiceProvider {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getUsers(): Promise<Result<User>> {
        const result = await dataBaseQuery<User>(this.dbFile, `select * from ${USERS};`, [], { successStatusCode: StatusCodes.OK })
        return { ...result, data: result.data }
    }
    async getUser(token: string): Promise<Result<User>> {
        const result = await dataBaseQuery<User>(this.dbFile, `SELECT * FROM ${USERS} join ${TOKENS} on ${TOKENS}.token=? and ${USERS}.name=${TOKENS}.username;`, [token], { successStatusCode: StatusCodes.OK })
        return { ...result, data: result.data }
    }
    async getTokens(): Promise<Result<Token>> {
        const result = await dataBaseQuery<Token>(this.dbFile, `select * from ${TOKENS};`, [], { successStatusCode: StatusCodes.OK })
        return { ...result, data: result.data }
    }
    async getToken(token: string): Promise<Result<Token>> {
        const result = await dataBaseQuery<Token>(this.dbFile, `select * from ${TOKENS} where token=?;`, [token], { successStatusCode: StatusCodes.OK })
        return { ...result, data: result.data }
    }
    async addToken({ token, username, time, lastActionTime }: Token): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `INSERT INTO ${TOKENS} (token, username, time, lastActionTime) VALUES(?, ?, ?, ?)`, [token, username, time, lastActionTime], { successStatusCode: StatusCodes.CREATED })
    }
    async updateToken(token: string, lastActionTime: number): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `UPDATE ${TOKENS} set lastActionTime=? WHERE token=?;`, [lastActionTime, token], { successStatusCode: StatusCodes.OK })
    }
    async deleteToken(token: string): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `DELETE FROM ${TOKENS} WHERE token=?`, [token], { successStatusCode: StatusCodes.OK })
    }

    async clearAllTokens(): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `DELETE FROM ${TOKENS}`, [], { successStatusCode: StatusCodes.OK })
    }

    async registerUser(userName: string, password: string, roleId: number): Promise<Result<null>> {
        const result = await hashData(password);
        return await dataBaseTransaction(this.dbFile, [
           {query: `INSERT INTO ${USERS} (name, password) VALUES(?, ?)`, params: [userName, result.data[0]]},
            {query: `INSERT INTO ${USER_ROLES} (user, roleId) VALUES(?, ?)`, params: [userName, roleId]},
        ], { successStatusCode: StatusCodes.CREATED, successMessage: messages.USER_ADDED })
    }
    async updateUser({ userName, password, roleId }: { userName: string, password?: string, roleId?: number }): Promise<Result<null>> {
        const passHash = (await hashData(password || "")).data[0]
        const queries: Query[] = []
        if (password) queries.push({ query: `update ${USERS} set password=? where name=?;`, params: [passHash, userName] })
        if (roleId) queries.push({ query: `update ${USER_ROLES} set roleId=? where user=?;`, params: [roleId, userName] })
        if (queries.length === 0) return { success: false, data: [], status: StatusCodes.NO_CONTENT, message: messages.QUERY_ERROR }
        return await dataBaseTransaction(this.dbFile, queries, { successStatusCode: StatusCodes.OK, successMessage: messages.USER_UPDATED })
    }

    async deleteUser(user: User): Promise<Result<null>> {
        return await dataBaseTransaction(this.dbFile, [
            { query: `DELETE FROM ${TOKENS} where username=?;`, params: [user.name] },
            { query: `DELETE FROM ${USER_ROLES} where user=?;`, params: [user.name] },
            { query: `DELETE FROM ${USERS} where name=?;`, params: [user.name] },
        ], { successStatusCode: StatusCodes.OK, successMessage: messages.USER_DELETED })
    }
    async getUserRoleId(username: string): Promise<number> {
        const result = await dataBaseQuery(this.dbFile, `SELECT * FROM ${USER_ROLES} where user=?;`, [username], { successStatusCode: StatusCodes.OK })
        const users = result?.data as USER_ROLE_SCHEMA[]
        return (users.length > 0 && users[0].roleId) || 0
    }
    async getRoles(): Promise<Result<UserRole>> {
        return await dataBaseQuery(this.dbFile, `SELECT * FROM ${ROLES};`, [], { successStatusCode: StatusCodes.OK })
    }
    async addRole(name: string): Promise<Result<null>> {
        return dataBaseQuery<null>(this.dbFile, `INSERT INTO ${ROLES} (name) VALUES(?);`, [name], { successStatusCode: StatusCodes.CREATED, successMessage: messages.ROLE_ADDED })
    }
    async deleteRole(id: number): Promise<Result<null>> {
        return dataBaseTransaction(this.dbFile, [
            { query: `DELETE FROM ${PERMISSIONS} where id=?;`, params: [id] },
            { query: `DELETE FROM ${ROLES} where id=?;`, params: [id] }
        ], { successStatusCode: StatusCodes.OK, successMessage: messages.ROLE_DELETED })
    }
    async getSuperUsers(): Promise<Result<{ name: string }>> {
        return await dataBaseQuery(this.dbFile, `SELECT * FROM ${SUPERUSERS};`, [], { successStatusCode: StatusCodes.OK })
    }
    async getSuperRoles(): Promise<Result<{ roleId: number }>> {
        return await dataBaseQuery(this.dbFile, `SELECT * FROM ${SUPERROLES};`, [], { successStatusCode: StatusCodes.OK })
    }
}
