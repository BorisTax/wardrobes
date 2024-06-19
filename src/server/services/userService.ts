import EventEmitter from 'events'
import { Result, Token } from '../../types/server.js'
import { User } from "../../types/user.js"
import { IUserService, IUserServiceProvider } from '../../types/services.js'
import messages from '../messages.js'
import { userServiceProvider } from '../options.js'
import { SERVER_EVENTS } from "../../types/enums.js"
import { Permissions, RESOURCE, UserRole } from '../../types/user.js'

export const activeTokens: { tokenList: Token[] } = { tokenList: [] }
export const events: Map<string, EventEmitter> = new Map()
export async function getTokens(): Promise<Token[]> {
  const userService = new UserService(userServiceProvider);
  const result = await userService.getTokens()
  if (result.success) return result.data as Token[]
  return []
}
Promise.resolve().then(() => getTokens().then(r => activeTokens.tokenList = r))

const expiredInterval = 3600 * 1000
const clearExpiredTokens = () => {
  const userService = new UserService(userServiceProvider);
  activeTokens.tokenList.forEach((t: Token) => {
    if (Date.now() - t.lastActionTime > expiredInterval) userService.deleteToken(t.token)
  })
}

setInterval(clearExpiredTokens, 60000)

export function notifyActiveUsers(){
  events.forEach(emitter => emitter.emit('message', SERVER_EVENTS.UPDATE_ACTIVE_USERS))
}
export function logoutUser(token: string){
  events.forEach(emitter => emitter.emit('message', SERVER_EVENTS.LOGOUT,  token)) 
}
export class UserService implements IUserService {
  provider: IUserServiceProvider
  constructor(provider: IUserServiceProvider) {
    this.provider = provider
  }
  async getUsers(): Promise<Result<User[]>> {
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

  async addToken({ token, username, time, lastActionTime }: Token) {
    const result = await this.provider.addToken({ token, username, time, lastActionTime })
    if (result.success) activeTokens.tokenList.push({ token, username, time, lastActionTime })
    return result
  }

  async updateToken(token: string) {
    const lastActionTime = Date.now()
    const result = await this.provider.updateToken(token, lastActionTime)
    if (result.success) {
      const t = activeTokens.tokenList.find(t => t.token === token)
      if (t) t.lastActionTime = lastActionTime
    }
    return result
  }

  async deleteToken(token: string, extAction = () => { notifyActiveUsers() }) {
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
  async registerUser(userName: string, password: string) {
    const result = await this.isUserNameExist(userName)
    if (!result.success) return result
    return this.provider.registerUser(userName, password)
  }
  async deleteUser(user: User) {
    const result = await this.provider.deleteUser(user)
    if (result.success) {
      const t = activeTokens.tokenList.find(t => t.username === user.name)
      if (t) await this.deleteToken(t.token, () => { logoutUser(t.token) })
    }
    return result
  }
  async isUserNameExist(name: string) {
    if (!name) return { success: false, status: 400, message: messages.INVALID_USER_DATA }
    const result = await this.getUsers()
    if (!result.success) return { ...result, data: null }
    const userList = result.data || []
    const user = (userList as User[]).find(u => u.name === name)
    if (user) return { success: false, status: 409, message: messages.USER_NAME_EXIST }
    return { success: true, status: 200, message: messages.USER_NAME_ALLOWED }
  }
  async getPermissions(role: string, resource: RESOURCE): Promise<Permissions>{
    return this.provider.getPermissions(role, resource)
  }
  async getAllUserPermissions(role: string): Promise<[RESOURCE, Permissions][]>{
    return this.provider.getAllUserPermissions(role)
}
  async getUserRole(username: string): Promise<UserRole> {
    const result = await this.provider.getUserRole(username)
    return result
  }
}




