import EventEmitter from 'events'
import { Result, Token } from '../../types/server.js'
import { PERMISSIONS_SCHEMA, User } from "../../types/user.js"
import { IUserService, IUserServiceProvider } from '../../types/services.js'
import messages from '../messages.js'
import { userServiceProvider } from '../options.js'
import { SERVER_EVENTS } from "../../types/enums.js"
import { Permissions, RESOURCE, UserRole } from '../../types/user.js'

export const events: Map<string, EventEmitter> = new Map()
export async function getTokens(): Promise<Token[]> {
  const userService = new UserService(userServiceProvider);
  const result = await userService.getTokens()
  if (result.success) return result.data as Token[]
  return []
}

const expiredInterval = 3600 * 1000
const clearExpiredTokens = async () => {
  const userService = new UserService(userServiceProvider);
  const tokens = await getTokens()
  for (let t of tokens) {
    if (Date.now() - t.lastActionTime > expiredInterval) await userService.deleteToken(t.token)
  }
}

setInterval(clearExpiredTokens, 60000)

export function notifyActiveUsers() {
  events.forEach(emitter => emitter.emit('message', SERVER_EVENTS.UPDATE_ACTIVE_USERS))
}
export function logoutUser(token: string) {
  events.forEach(emitter => emitter.emit('message', SERVER_EVENTS.LOGOUT, token))
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
    return result
  }

  async updateToken(token: string) {
    const lastActionTime = Date.now()
    const result = await this.provider.updateToken(token, lastActionTime)
    return result
  }

  async deleteToken(token: string, extAction = () => { notifyActiveUsers() }) {
    const result = await this.provider.deleteToken(token)
    if (result.success) {
      extAction()
      events.delete(token)
    }
    return result
  }
  async clearAllTokens() {
    const result = await this.provider.clearAllTokens()
    return result
  }
  async registerUser(userName: string, password: string, role: UserRole) {
    const result = await this.isUserNameExist(userName)
    if (!result.success) return result
    return this.provider.registerUser(userName, password, role)
  }
  async deleteUser(user: User) {
    const superusers = (await this.getSuperUsers()).data?.map(m => m.name)
    if (superusers?.find(s => s === user.name)) return { success: false, status: 403, message: messages.USER_DELETE_DENIED }
    const result = await this.provider.deleteUser(user)
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
  async getPermissions(role: string, resource: RESOURCE): Promise<Permissions> {
    return this.provider.getPermissions(role, resource)
  }
  async getAllUserPermissions(role: string): Promise<PERMISSIONS_SCHEMA[]> {
    return this.provider.getAllUserPermissions(role)
  }
  async getAllPermissions(): Promise<PERMISSIONS_SCHEMA[]> {
    return this.provider.getAllPermissions()
  }
  async getUserRole(username: string): Promise<string> {
    const result = await this.provider.getUserRole(username)
    return result
  }
  async getRoles(): Promise<Result<UserRole[]>> {
    return await this.provider.getRoles()
  }
  async addRole(name: string): Promise<Result<null>> {
    const roles = (await this.provider.getRoles()).data
    if (roles?.find(r => r.name === name)) return { success: false, status: 409, message: messages.ROLE_EXIST }
    return this.provider.addRole(name)
  }
  async deleteRole(name: string): Promise<Result<null>> {
    const superroles = (await this.getSuperRoles()).data?.map(m => m.name)
    if (superroles?.find(s => s === name)) return { success: false, status: 403, message: messages.ROLE_DELETE_DENIED }
    return this.provider.deleteRole(name)
  }
  async getSuperUsers(): Promise<Result<{ name: string }[]>> {
    return await this.provider.getSuperUsers()
  }
  async getSuperRoles(): Promise<Result<{ name: string }[]>> {
    return await this.provider.getSuperRoles()
  }
}




