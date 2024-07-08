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
    name: string,
    //     caption: string
}
export type User = {
    name: string
    password: string
}
export type UserData = {
    name: string
    role: UserRole
    permissions: PERMISSIONS_SCHEMA[]
}

export type ActiveUser = {
    name: string
    role: UserRole
    token: string
    time: number
    lastActionTime: number
}

export type USER_ROLE_SCHEMA = {
    user: string,
    role: string
}
export type PERMISSIONS_SCHEMA = {
    role: string,
    resource: RESOURCE,
    create: boolean,
    read: boolean,
    update: boolean,
    remove: boolean,
}

export type UserLoginResult = { token: string, permissions: PERMISSIONS_SCHEMA[] }
