import { dataBaseQuery, hashData } from '../functions.js'
import { IUserServiceProvider } from '../../types/services.js';
import { Results, User } from '../../types/server.js';

export default class UserServiceSQLite implements IUserServiceProvider {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getUsers(): Promise<Results> {
        return dataBaseQuery(this.dbFile, "select * from 'users'")
    }
    async getTokens(): Promise<Results> {
        return dataBaseQuery(this.dbFile, "select * from 'tokens'")
    }
    async addToken({ token, userName }: { token: string, userName: string }): Promise<Results> {
        const time = Date.now()
        return dataBaseQuery(this.dbFile, `INSERT INTO tokens (token, username, time) VALUES('${token}', '${userName}', ${time})`)
    }

    async deleteToken(token: string): Promise<Results> {
        return dataBaseQuery(this.dbFile, `DELETE FROM tokens WHERE token='${token}'`)
    }

    async clearAllTokens(): Promise<Results> {
        return dataBaseQuery(this.dbFile, `DELETE FROM tokens`)
    }

    async registerUser(user: User): Promise<Results> {
        const hash = await hashData(user.password);
        return dataBaseQuery(this.dbFile, `INSERT INTO users (name, role, password) VALUES('${user.name}', '${user.role}', '${hash}')`)
    }

}
