import { dataBaseQuery, hashData } from '../functions/other.js'
import { IUserServiceProvider } from '../../types/services.js';
import { Result, Token, User } from '../../types/server.js';
import messages from '../messages.js';
import { USER_TABLE_NAMES } from '../functions/other.js';
const { USERS, TOKENS } = USER_TABLE_NAMES
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

    async registerUser(user: User): Promise<Result<null>> {
        const result = await hashData(user.password);
        return dataBaseQuery<null>(this.dbFile, `INSERT INTO ${USERS} (name, role, password) VALUES('${user.name}', '${user.role}', '${result.data}')`, {successStatusCode: 201, successMessage: messages.USER_ADDED})
    }

    async deleteUser(user: User): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `DELETE FROM ${USERS} where name='${user.name}';`, {successStatusCode: 200, successMessage: messages.USER_DELETED})
    }
}
