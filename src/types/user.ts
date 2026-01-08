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
    permissions: PermissionSchema[]
}

export type ActiveUser = {
    name: string
    roleId: number
    token: string
    time: number
    lastActionTime: number
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

export type UserLoginResult = { token: string, permissions: PermissionSchema[] }
