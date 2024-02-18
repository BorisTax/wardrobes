import { Results, Token, User } from '../../types/server.js'
import { IUserService, IUserServiceProvider } from '../../types/services.js'
import messages from '../messages.js'


export class UserService implements IUserService {
  provider: IUserServiceProvider
  constructor(provider: IUserServiceProvider) {
    this.provider = provider
  }
  async getUsers(): Promise<Results> {
    return await this.provider.getUsers()
  }
  async getUser(token: string): Promise<User | undefined> {
    const tokenList = await this.getTokens()
    if (!tokenList.success) return undefined
    const userList = await this.getUsers()
    if (!userList.success) return undefined
    const foundToken = (tokenList.data as Token[]).find(t => t.token === token)
    const userName = foundToken && foundToken.username
    const user = (userList.data as User[]).find(u => u.name === userName)
    return user
  }
  async getTokens() {
    return await this.provider.getTokens()
  }
  async addToken({ token, userName }: { token: string, userName: string }) {
    return await this.provider.addToken({ token, userName })
  }
  async deleteToken(token: string) {
    return await this.provider.deleteToken(token)
  }
  async clearAllTokens() {
    return await this.provider.clearAllTokens()
  }
  async registerUser(user: User) {
    let result = await this.isUserNameExist(user.name)
    if (!result.success) return result
    return this.provider.registerUser(user)
  }
  async isUserNameExist(name: string) {
    if (!name) return { success: false, status: 400, message: messages.INVALID_USER_DATA }
    const result = await this.getUsers()
    if (!result.success) return result
    const userList = result.data || []
    const user = (userList as User[]).find(u => u.name === name)
    if (user) return { success: false, status: 409, message: messages.USER_NAME_EXIST }
    return { success: true, status: 200, message: messages.USER_NAME_ALLOWED }
  }
}


