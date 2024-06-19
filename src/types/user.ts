export enum RESOURCE {
    USERS = 'users',
    MATERIALS = 'materials',
    PRICES = 'prices',
    SPECIFICATION = 'specification',
    TEMPLATE = 'template',
}

export type Permissions = {
    read: boolean
    create: boolean
    update: boolean
    remove: boolean
}

export type UserRole = {
    name: string,
    caption: string
}

export type User = {
    name: string
    password: string
}
export type UserData = {
    name: string
    role: string
    permissions: [RESOURCE, Permissions][]
}
export enum UserRoles {
    ADMIN = 'ADMIN',
    EDITOR = 'EDITOR',
    MANAGER = 'MANAGER',
    CLIENT = 'CLIENT',
    ANONYM = 'ANONYM'
}
export type ActiveUser = {
    name: string
    role: string
    token: string
    time: number
    lastActionTime: number
}
