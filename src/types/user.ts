import { DefaultSchema } from "./schemas"

export enum RESOURCE {
    USERS = 1,
    MATERIALS = 2,
    PRICES = 3 ,
    SPECIFICATION = 4,
    TEMPLATE = 5,
    FILES = 6,
    DATABASE = 7,
    VERBOSE = 8,
    COMBIFASADES = 9,
    WARDROBES = 10,
    MATERIALS_DB = 11,
    SKLAD_STOL = 12,
    SETTINGS = 100
}
export enum PERMISSION {
    READ = 'READ',
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
}
export type UserPermissions = {
    Read: boolean
    Create: boolean
    Update: boolean
    Delete: boolean
}
export type ResourceSchema = DefaultSchema
export type UserRole = DefaultSchema

export type User = {
    name: string
    password: string
}
export type UserData = {
    name: string
    roleId: number
    userId: string
    permissions: PermissionSchema[]
}

export type ActiveUser = {
    name: string
    roleId: number
    userId: string
    time: number
    lastActionTime: number
}
export type UserAction = {
    name: string
    time: number
    action: Action
}

export enum Action {
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
    FORCE_LOGOUT = "FORCE_LOGOUT",
    EXPIRE_LOGOUT = "EXPIRE_LOGOUT",
}

export type USER_ROLE_SCHEMA = {
    user: string,
    roleId: number
}
export type PermissionSchema = {
    roleId: number,
    resourceId: RESOURCE,
    create: number,
    read: number,
    update: number,
    delete: number,
}

export type UserLoginResult = { name: string, roleId: number, userId: string, permissions: PermissionSchema[] }
