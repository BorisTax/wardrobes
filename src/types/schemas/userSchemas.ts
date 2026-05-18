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

export type RolesSchema = DefaultSchema

export type UserSuperRolesSchema = {
    id: number
}

export type UserSuperUsersSchema = {
    id: number
}

export type UserTokenSchema = {
    token: string
    userSessionId: string
    userId: number
    loginTime: number
    lastActionTime: number
}


export type UserRolesSchema = {
    id: number
    userId: number
    roleId: number
}

export type UserLogSchema = {
    userId: number
    time: number
    action: string
}