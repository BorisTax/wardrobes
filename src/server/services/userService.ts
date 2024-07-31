import { Result, Token } from '../../types/server.js'
import { PERMISSIONS_SCHEMA, User } from "../../types/user.js"
import { IUserService, IUserServiceProvider } from '../../types/services.js'
import messages from '../messages.js'
import { userServiceProvider } from '../options.js'
import { SERVER_EVENTS } from "../../types/enums.js"
import { Permissions, RESOURCE, UserRole } from '../../types/user.js'
import { StatusCodes } from 'http-status-codes'
import { badRequestResponse, conflictResponse, forbidResponse } from '../functions/response.js'
import { Response } from 'express'

export const events: Map<string, Response> = new Map()

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
    if (Date.now() - t.lastActionTime > expiredInterval) {
      await userService.deleteToken(t.token)
      console.log('Token was deleted by expiration', t.username, t.token.substring(0, 7) + "....." + t.token.substring(t.token.length - 7))
      events.forEach((v, k) => {
        try{
          if (k === t.token) v.end()
        } catch (e) { 
          console.error(e)
        }
      })
    }
  }
}

setInterval(clearExpiredTokens, 60000)

export function notifyActiveUsers(message: SERVER_EVENTS) {
  events.forEach((v, k) => {
    try {
      v.write(getEventSourceMessage(message))
    } catch (e) {
      console.error(e)
    }
  })
}

export function logoutUser(token: string) {
  events.forEach((v, k) => {
    try {
      
      if (k === token) v.write(getEventSourceMessage(SERVER_EVENTS.LOGOUT))
    } catch (e) {
      console.error(e)
    }
  })
}

function getEventSourceMessage(message: string, comment: string = ""){
  return `data: {"message":"${message}", "comment":"${comment}"}\n\n`
}
export class UserService implements IUserService {
  provider: IUserServiceProvider
  constructor(provider: IUserServiceProvider) {
    this.provider = provider
  }
  async getUsers(): Promise<Result<User[]>> {
    return await this.provider.getUsers()
  }

  async getUser(token: string): Promise<Result<User[]>> {
    return this.provider.getUser(token)
  }

  async getTokens() {
    return await this.provider.getTokens()
  }
  async getToken(token: string): Promise<Result<Token[]>> {
    return this.provider.getToken(token)
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

  async deleteToken(token: string) {
    const result = await this.provider.deleteToken(token)
    if (result.success) notifyActiveUsers(SERVER_EVENTS.UPDATE_ACTIVE_USERS)
    return result
  }

  async clearAllTokens() {
    const result = await this.provider.clearAllTokens()
    return result
  }
  async registerUser(userName: string, password: string, roleId: number) {
    const result = await this.isUserNameExist(userName)
    if (!result.success) return result
    return this.provider.registerUser(userName, password, roleId)
  }
  async updateUser({ userName, password, roleId }: { userName: string, password?: string, roleId?: number }): Promise<Result<null>>{
    const superusers = (await this.getSuperUsers()).data?.map(m => m.name)
    if (superusers?.find(s => s === userName)) return forbidResponse(messages.USER_UPDATE_DENIED)
    return this.provider.updateUser({userName, password, roleId})
}
  async deleteUser(user: User) {
    const superusers = (await this.getSuperUsers()).data?.map(m => m.name)
    if (superusers?.find(s => s === user.name)) return forbidResponse(messages.USER_DELETE_DENIED)
    const result = await this.provider.deleteUser(user)
    if (result.success) notifyActiveUsers(SERVER_EVENTS.UPDATE_ACTIVE_USERS)
    return result
  }
  async isUserNameExist(name: string) {
    if (!name) return badRequestResponse(messages.INVALID_USER_DATA)
    const result = await this.getUsers()
    if (!result.success) return { ...result, data: null }
    const userList = result.data || []
    const user = (userList as User[]).find(u => u.name === name)
    if (user) return conflictResponse(messages.USER_NAME_EXIST)
    return { success: true, status: StatusCodes.OK, message: messages.USER_NAME_ALLOWED }
  }
  async getPermissions(roleId: number, resource: RESOURCE): Promise<Permissions> {
    return this.provider.getPermissions(roleId, resource)
  }
  async getAllUserPermissions(roleId: number): Promise<PERMISSIONS_SCHEMA[]> {
    return this.provider.getAllUserPermissions(roleId)
  }
  async getAllPermissions(): Promise<PERMISSIONS_SCHEMA[]> {
    return this.provider.getAllPermissions()
  }
  async getUserRoleId(username: string): Promise<number> {
    const result = await this.provider.getUserRoleId(username)
    return result
  }
  async getRoles(): Promise<Result<UserRole[]>> {
    return await this.provider.getRoles()
  }
  async addRole(name: string): Promise<Result<null>> {
    const roles = (await this.provider.getRoles()).data
    if (roles?.find(r => r.name === name)) return conflictResponse(messages.ROLE_EXIST)
    return this.provider.addRole(name)
  }
  async deleteRole(id: number): Promise<Result<null>> {
    const superroles = (await this.getSuperRoles()).data?.map(m => m.roleId)
    if (superroles?.find(s => s === id)) return forbidResponse(messages.ROLE_DELETE_DENIED)
    return this.provider.deleteRole(id)
  }
  async getSuperUsers(): Promise<Result<{ name: string }[]>> {
    return await this.provider.getSuperUsers()
  }
  async getSuperRoles(): Promise<Result<{ roleId: number }[]>> {
    return await this.provider.getSuperRoles()
  }
}




