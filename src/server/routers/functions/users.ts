import { USER_TABLE_NAMES } from '../../../types/schemas/schemas.js';
import { UserLogSchema, RolesSchema, UserSchema, UserSuperRolesSchema, UserSuperUsersSchema, UserTokenSchema, UserRolesSchema } from '../../../types/schemas/userSchemas.js';
import { getDataBaseUserService } from '../../options.js';
import { OmitId } from '../../../types/materials.js';
import { RESOURCE, UserPermissions } from '../../../types/user.js';
import { getAllUserPermissions } from '../permissions.js';

export async function getUserPermissions(userId: number, resource: RESOURCE): Promise<UserPermissions> {
    const roles = (await getUserRolesByUserId(userId)).map(r => r.roleId)
    const permissions = await getAllUserPermissions(roles)
    const perm = { Read: false, Create: false, Update: false, Delete: false }
    permissions.filter(p => p.resourceId === resource).forEach(p=>{
        perm.Read = perm.Read || !!p.read
        perm.Create = perm.Create || !!p.create
        perm.Update = perm.Update || !!p.update
        perm.Delete = perm.Delete || !!p.delete
    })
    return perm
}

export async function getUserName(userId: number) {
    const users = (await getUsers()).data
    return users.find(u => u.id === userId)?.name
}

export async function getUsers() {
    const service = getDataBaseUserService<UserSchema>()
    return await service.getData(USER_TABLE_NAMES.USERS, [], {})
}

export async function getUserIdByToken(token: string) {
    const tokens = await getTokens()
    return tokens.find(t => t.token === token)?.userId
}
export async function getUserByToken(token: string) {
    const tokens = await getTokens()
    const users = (await getUsers()).data
    const userId = tokens.find(t => t.token === token)?.userId
    return users.find(u => u.id === userId)
}
export async function getUserIdByName(name: string) {
    const users = (await getUsers()).data
    return users.find(u => u.name === name)?.id
}
export async function getTokenByUserSessionId(userSessionId: string): Promise<UserTokenSchema> {
    const tokens = await getTokens()
    return tokens.find(t => t.userSessionId === userSessionId) as UserTokenSchema
}
export async function getTokenData(token: string): Promise<UserTokenSchema> {
    const tokens = await getTokens()
    return tokens.find(t => t.token === token) as UserTokenSchema
}
export async function getTokens() {
    const service = getDataBaseUserService<UserTokenSchema>()
    return (await service.getData(USER_TABLE_NAMES.TOKENS, [], {})).data
}
export async function addToken(data: UserTokenSchema) {
    const service = getDataBaseUserService<UserTokenSchema>()
    return await service.addData(USER_TABLE_NAMES.TOKENS, data)
}
export async function updateToken(data: UserTokenSchema) {
    const service = getDataBaseUserService<UserTokenSchema>()
    data.lastActionTime = Date.now()
    return await service.updateData(USER_TABLE_NAMES.TOKENS, { token: data.token }, data)
}
export async function deleteToken(token: string) {
    const service = getDataBaseUserService<UserTokenSchema>()
    return await service.deleteData(USER_TABLE_NAMES.TOKENS, { token })
}

export async function getRoles() {
    const service = getDataBaseUserService<RolesSchema>()
    return await service.getData(USER_TABLE_NAMES.ROLES, [], {})
}
export async function addRole(data: OmitId<RolesSchema>) {
    const service = getDataBaseUserService<RolesSchema>()
    return await service.addData(USER_TABLE_NAMES.ROLES, data)
}
export async function updateRole(data: RolesSchema) {
    const service = getDataBaseUserService<RolesSchema>()
    return await service.updateData(USER_TABLE_NAMES.ROLES, { id: data.id }, data)
}
export async function deleteRole(id: number) {
    const service = getDataBaseUserService<RolesSchema>()
    return await service.deleteData(USER_TABLE_NAMES.ROLES, { id })
}


export async function getUserRolesByUserId(userId: number) {
    const result = (await getUserRoles()).data.filter(r => r.userId === userId)
    return result
}

export async function getUserRoles() {
    const service = getDataBaseUserService<UserRolesSchema>()
    return await service.getData(USER_TABLE_NAMES.USER_ROLES, [], {})
}
export async function addUserRole(data: OmitId<UserRolesSchema>) {
    const service = getDataBaseUserService<UserRolesSchema>()
    return await service.addData(USER_TABLE_NAMES.USER_ROLES, data)
}
export async function updateUserRole(data: UserRolesSchema) {
    const service = getDataBaseUserService<UserRolesSchema>()
    return await service.updateData(USER_TABLE_NAMES.USER_ROLES, { id: data.id }, data)
}
export async function deleteUserRole(id: number) {
    const service = getDataBaseUserService<UserRolesSchema>()
    return await service.deleteData(USER_TABLE_NAMES.USER_ROLES, { id })
}


export async function getSuperUsers() {
    const service = getDataBaseUserService<UserSuperUsersSchema>()
    return await service.getData(USER_TABLE_NAMES.SUPERUSERS, [], {})
}
export async function getSuperRoles() {
    const service = getDataBaseUserService<UserSuperRolesSchema>()
    return await service.getData(USER_TABLE_NAMES.SUPERROLES, [], {})
}


export async function getUserLog() {
    const service = getDataBaseUserService<UserLogSchema>()
    return await service.getData(USER_TABLE_NAMES.USERLOG, [], {})
}
export async function addUserLog(data: UserLogSchema) {
    const service = getDataBaseUserService<UserLogSchema>()
    return await service.addData(USER_TABLE_NAMES.USERLOG, data)
}
export async function clearUserLog() {
    const service = getDataBaseUserService<UserLogSchema>()
    return await service.clearData(USER_TABLE_NAMES.USERLOG)
}


