import { Result, Token } from '../../types/server.js'
import { Action, RESOURCE, User, UserPermissions } from "../../types/user.js"
import messages from '../messages.js'
import { getUserService } from '../options.js'
import { SERVER_EVENTS } from "../../types/enums.js"
import { StatusCodes } from 'http-status-codes'
import { badRequestResponse, conflictResponse, forbidResponse } from '../functions/response.js'
import { Response } from 'express'
import { getAllUserPermissions } from '../routers/permissions.js'

export const events: Map<string, Response> = new Map()


export async function getTokens(): Promise<Token[]> {
  const userService = getUserService()
  const result = await userService.getTokens()
  if (result.success) return result.data as Token[]
  return []
}

export async function deleteToken(token: string) {
  const userService = getUserService()
  const result = await userService.deleteToken(token)
  if (result.success) notifyActiveUsers(SERVER_EVENTS.UPDATE_ACTIVE_USERS)
  return result
}

export async function getUserPermissions(userName: string, resource: RESOURCE): Promise<UserPermissions> {
  const userService = getUserService()
  const roleId = await userService.getUserRoleId(userName)
  const permissions = await getAllUserPermissions(roleId)
  const perm = permissions.find(p => p.resourceId === resource)
  return { Read: !!perm?.read, Create: !!perm?.create, Update: !!perm?.update, Delete: !!perm?.delete }
}

const expiredInterval = 3600 * 1000
const clearExpiredTokens = async () => {
  const tokens = await getTokens()
  for (let t of tokens) {
    if (Date.now() - t.lastActionTime > expiredInterval) {
      const service = getUserService()
      await deleteToken(t.token)
      service.dispatchUserAction(t.userName, Action.EXPIRE_LOGOUT)
      console.log('Token was deleted by expiration', t.userName, t.userId, t.token)
      events.forEach((v, k) => {
        try {
          if (k === t.token) {
            logoutUser(t.token, SERVER_EVENTS.EXPIRE)
            v.end()
            events.delete(k)
          }
        } catch (e) { 
          console.error(e)
        }
      })
    }
  }
}

setInterval(clearExpiredTokens, 60000)

export async function notifyActiveUsers(message: SERVER_EVENTS) {
  const tokens = await getTokens()
  events.forEach(async (v, k) => {
    const name = tokens.find(t => t.token === k)?.userName || ""
    const perm = await getUserPermissions(name, RESOURCE.USERS)
    if (!perm.Read) return
    try {
      v.write(getEventSourceMessage(message))
    } catch (e) {
      console.error(e)
    }
  })
}

export function logoutUser(token: string, message: SERVER_EVENTS) {
  events.forEach((v, k) => {
    try {
      if (k === token) {
        v.write(getEventSourceMessage(message))
        events.delete(k)
      }
    } catch (e) {
      console.error(e)
    }
  })
}

export async function registerUser(userName: string, password: string, roleId: number) {
  const userService = getUserService()
  const result = await isUserNameExist(userName)
  if (!result.success) return result
  return userService.registerUser(userName, password, roleId)
}

 export async function updateUser({ userName, password, roleId }: { userName: string, password?: string, roleId?: number }): Promise<Result<null>>{
  const userService = getUserService()
    const superusers = (await userService.getSuperUsers()).data?.map(m => m.name)
    if (superusers?.find(s => s === userName)) return forbidResponse(messages.USER_UPDATE_DENIED)
    return userService.updateUser({userName, password, roleId})
}

export async function deleteUser(user: User) {
  const userService = getUserService()
  const superusers = (await userService.getSuperUsers()).data?.map(m => m.name)
  if (superusers?.find(s => s === user.name)) return forbidResponse(messages.USER_DELETE_DENIED)
  const result = await userService.deleteUser(user)
  if (result.success) notifyActiveUsers(SERVER_EVENTS.UPDATE_ACTIVE_USERS)
  return result
}

export async function addRole(name: string): Promise<Result<null>> {
  const userService = getUserService()
  const roles = (await userService.getRoles()).data
  if (roles?.find(r => r.name === name)) return conflictResponse(messages.ROLE_EXIST)
  return userService.addRole(name)
}

export async function deleteRole(id: number): Promise<Result<null>> {
  const userService = getUserService()
  const superroles = (await userService.getSuperRoles()).data.map(m => m.roleId)
  if (superroles?.find(s => s === id)) return forbidResponse(messages.ROLE_DELETE_DENIED)
  return userService.deleteRole(id)
}

export async function isUserNameExist(name: string) {
  if (!name) return badRequestResponse(messages.INVALID_USER_DATA)
  const userService = getUserService()
  const result = await userService.getUsers()
  if (!result.success) return { ...result, data: [] }
  const userList = result.data || []
  const user = (userList as User[]).find(u => u.name === name)
  if (user) return conflictResponse(messages.USER_NAME_EXIST)
  return { success: true, data: [], status: StatusCodes.OK, message: messages.USER_NAME_ALLOWED }
}


export async function getUserActions() {
  const userService = getUserService()
  return userService.getUserActions()
}
export async function clearUserActions() {
  const userService = getUserService()
  return userService.clearUserActions()
}

function getEventSourceMessage(message: string, comment: string = ""){
  return `data: {"message":"${message}", "comment":"${comment}"}\n\n`
}





