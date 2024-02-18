import { dataBaseQuery, hashData } from '../functions.js'
import { IUserServiceProvider } from '../../types/services.js';
import { Results, User } from '../../types/server.js';
import messages from '../messages.js';

export default class UserServiceSQLite implements IUserServiceProvider {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getUsers(): Promise<Results> {
        return dataBaseQuery(this.dbFile, "select * from 'users'", {successStatusCode: 200})
    }
    async getTokens(): Promise<Results> {
        return dataBaseQuery(this.dbFile, "select * from 'tokens'", {successStatusCode: 200})
    }
    async addToken({ token, userName }: { token: string, userName: string }): Promise<Results> {
        const time = Date.now()
        return dataBaseQuery(this.dbFile, `INSERT INTO tokens (token, username, time) VALUES('${token}', '${userName}', ${time})`, {successStatusCode: 201})
    }

    async deleteToken(token: string): Promise<Results> {
        return dataBaseQuery(this.dbFile, `DELETE FROM tokens WHERE token='${token}'`, {successStatusCode: 200})
    }

    async clearAllTokens(): Promise<Results> {
        return dataBaseQuery(this.dbFile, `DELETE FROM tokens`, {successStatusCode: 200})
    }

    async registerUser(user: User): Promise<Results> {
        const hash = await hashData(user.password);
        return dataBaseQuery(this.dbFile, `INSERT INTO users (name, role, password) VALUES('${user.name}', '${user.role}', '${hash}')`, {successStatusCode: 201, successMessage: messages.REG_SUCCEED})
    }

}
