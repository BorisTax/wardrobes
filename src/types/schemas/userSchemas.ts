import { DefaultSchema } from "./schemas"

export type UserSchema = {
    id: number
    name: string
    password: string
}

export type UserPermissionsSchema = {
    id: number,
    roleId: number
    resourceId: number
    create: number
    read: number
    update: number
    delete: number
}

export type UserResourcesSchema = DefaultSchema

export type UserRolesSchema = DefaultSchema

export type UserSuperRolesSchema = {
    id: number
}

export type UserSuperUsersSchema = {
    id: number
}

export type UserTokensSchema = {
    id: number
    token: string
    userUUID: string
    userName: string
    time: number
    lastActionTime: number
}


export type UserUserRolesSchema = {
    id: number
    userId: number
    roleId: number
}

export type UserLogSchema = {
    id: number
    userId: number
    time: number
    action: string
}