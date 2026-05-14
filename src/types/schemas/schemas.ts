import { MODULE_TABLE_NAMES } from "./moduleSchemas"
import { SKLAD_STOL_TABLE_NAMES, SKLAD_TABLE_NAMES } from "./skladSchemas"
import { DATA_TABLE_NAMES, TEMPLATE_TABLE_NAMES } from "./wardrobeSchemas"

export type KeySet<T> = (keyof T)[]

export type Query = {
    query: string,
    params: any[]
}

export type DataBaseSelectOptions<T> = {
    order: keyof T,
    orderDesc?: boolean
}

export type DefaultSchema = {
    id: number,
    name: string
}

export type IdToCharIdSchema = {
    id: number,
    charId: number,
}

export type TABLE_NAMES = DATA_TABLE_NAMES | USER_TABLE_NAMES | TEMPLATE_TABLE_NAMES | MODULE_TABLE_NAMES | SKLAD_STOL_TABLE_NAMES | SKLAD_TABLE_NAMES | SETTINGS_TABLE_NAMES;

export enum USER_TABLE_NAMES {
    USERS = 'users',
    TOKENS = 'tokens',
    ROLES = 'roles',
    RESOURCES = 'resources',
    PERMISSIONS = 'permissions',
    USER_ROLES = 'user_roles',
    SUPERUSERS = 'superusers',
    SUPERROLES = 'superroles',
    USERLOG = 'userlog',
}

export enum SETTINGS_TABLE_NAMES {
    THEMES = 'themes',
}



