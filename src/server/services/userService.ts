import EventEmitter from 'events'
import { Results, Token, User } from '../../types/server.js'
import { IUserService, IUserServiceProvider } from '../../types/services.js'
import messages from '../messages.js'
import { userServiceProvider } from '../options.js'

export const activeTokens: { tokenList: Token[] } = { tokenList: [] }
export const events: Map<string, EventEmitter> = new Map()
export async function getTokens(): Promise<Token[]> {
  const userService = new UserService(userServiceProvider);
  const result = await userService.getTokens()
  if (result.success) return result.data as Token[]
  return []
}

const expiredInterval = 3600 * 24 * 1000
const clearExpiredTokens = () => {
  const userService = new UserService(userServiceProvider);
  activeTokens.tokenList.forEach((t: Token) => {
    if (Date.now() - t.time > expiredInterval) userService.deleteToken(t.token)
  })
}
setInterval(clearExpiredTokens, 60000)

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
    const time = Date.now()
    const result = await this.provider.addToken({ token, userName, time })
    if (result.success) activeTokens.tokenList.push({ token, username: userName, time })
    return result
  }
  async deleteToken(token: string, extAction = () => {})  {
    const result = await this.provider.deleteToken(token)
    if (result.success) {
      activeTokens.tokenList = activeTokens.tokenList.filter(t => t.token !== token)
      extAction()
      events.delete(token)
    }
    return result
  }
  async clearAllTokens() {
    const result = await this.provider.clearAllTokens()
    if (result.success) activeTokens.tokenList = []
    return result
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

getTokens().then(r => activeTokens.tokenList = r)


