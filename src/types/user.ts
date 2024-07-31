export enum RESOURCE {
    USERS = 'users',
    MATERIALS = 'materials',
    MATERIALS_DB = 'materials_db',
    PRICES = 'prices',
    SPECIFICATION = 'specification',
    TEMPLATE = 'template',
    FILES = 'files',
    DATABASE = 'database',
    VERBOSE = 'verbose',
    COMBIFASADES = 'combifasades',
    WARDROBES = 'wardrobes',
}
export enum PERMISSION {
    READ = 'read',
    CREATE = 'create',
    UPDATE = 'update',
    REMOVE = 'remove',
}
export type Permissions = {
    read: boolean
    create: boolean
    update: boolean
    remove: boolean
}
export type Resource = {
    name: RESOURCE,
    caption: string
}
export type UserRole = {
    id: number
    name: string
}
export type User = {
    name: string
    password: string
}
export type UserData = {
    name: string
    roleId: number
    permissions: PERMISSIONS_SCHEMA[]
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
export type PERMISSIONS_SCHEMA = {
    roleId: number,
    resource: RESOURCE,
    create: boolean,
    read: boolean,
    update: boolean,
    remove: boolean,
}

export type UserLoginResult = { token: string, permissions: PERMISSIONS_SCHEMA[] }
