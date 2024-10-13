import { FASAD_TYPE } from "./enums"
import { SpecificationItem } from "./specification"

export type Query = {
    query: string,
    params: any[]
}

export type MaterialTypesSchema = {
    type: FASAD_TYPE,
    caption: string
}

export type WardrobeTableSchema = {
    name: string,
    caption: string
}
export type WardrobeDetailSchema = {
    name: string,
    caption: string
}

export type DVPTableSchema = {
    width: number,
    length: number
}
export type WardrobeDetailTableSchema = {
    wardrobe: string,
    name: string,
    minwidth: number,
    maxwidth: number,
    minheight: number,
    maxheight: number,
    count: number,
    size: string,
    enable: number
}

export type WardrobeFurnitureTableSchema = {
    wardrobe: string,
    name: SpecificationItem,
    minwidth: number,
    maxwidth: number,
    minheight: number,
    maxheight: number,
    mindepth: number,
    maxdepth: number,
    count: number,
    size: string,
    enable: number
}
export enum MAT_TABLE_NAMES {
    MATERIAL_TYPES = 'material_types',
    MATERIALS = 'materials',
    MATERIALS_IMAGES = 'materials_images',
    PROFILE_COLORS = 'profilecolors',
    BRUSH = 'brush',
    KROMKA = 'kromka',
    KROMKA_TYPES = 'kromka_types',
    TREMPEL = 'trempel',
    ZAGLUSHKA = 'zaglushka',
    UPLOTNITEL = 'uplotnitel',
    DSP_KROMKA_ZAGL = 'dsp_kromka_zagl',
}

export enum SPEC_TABLE_NAMES {
    PRICELIST = 'pricelist',
    MATERIALS = 'materials',
    UNITS = 'units',
    WARDROBES = 'wardrobes',
    WARDROBE_TYPES = 'wardrobe_types',
    CONSOLE_TYPES = 'console_types',
    DETAILS = 'details',
    DETAIL_TABLE = 'detail_table',
    DVP_TEMPLATES = 'dvp_templates',
    FURNITURE = 'furniture'
}

export enum USER_TABLE_NAMES {
    USERS = 'users',
    USERROLES = 'userroles',
    TOKENS = 'tokens',
    ROLES = 'roles',
    RESOURCES = 'resources',
    PERMISSIONS = 'permissions',
    USER_ROLES = 'user_roles',
    SUPERUSERS = 'superusers',
    SUPERROLES = 'superroles',
}
