import { CHAR_PURPOSE, CHAR_TYPE } from "./enums"
import { SettingsThemeSchema } from "./themes"
import { KROMKA_TYPE } from "./wardrobe"

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

export type SpecSchema = {
    id: number,
    name: string,
    units: number,
    coef: number,
    code: string,
    charType: CHAR_TYPE
}

export type SpecToCharSchema = IdToCharIdSchema
export type FasadTypeToCharSchema = IdToCharIdSchema

export type CharsSchema = {
    id: number,
    name: string,
    char_type_id: number,
    code: string,
    image: string
}
export type CharPurposeSchema ={
    charId: number,
    purposeId: CHAR_PURPOSE
}

export type CharTypesSchema = DefaultSchema
export type FasadTypesSchema = DefaultSchema
export type WardrobeDetailSchema = DefaultSchema
export type LacobelTypesSchema = DefaultSchema
export type MatPurposeSchema = DefaultSchema
export type ConsoleTypesSchema = DefaultSchema
export type WardrobeTypesSchema = DefaultSchema
export type WardrobesSchema = DefaultSchema & {use: boolean}
export type ProfileTypesSchema = DefaultSchema
export type UnitsSchema = DefaultSchema

export type DVPTableSchema = {
    id: number,
    width: number,
    length: number
}
export type DetailSchema = {
    id: number,
    name: string,
    el1: KROMKA_TYPE,
    el2: KROMKA_TYPE,
    ew1: KROMKA_TYPE,
    ew2: KROMKA_TYPE,
    confirmat: number,
    minifix: number
}
export type FurnitureTableSchema = {
    id: number
    wardrobeId: number,
    specId: number,
    minWidth: number,
    maxWidth: number,
    minHeight: number,
    maxHeight: number,
    minDepth: number,
    maxDepth: number,
    count: number,
    size: string,
    charId: number,
}
export type WardrobesDimensionsSchema = {
    id: number
    wardrobeId: number,
    minWidth: number,
    maxWidth: number,
    minHeight: number,
    maxHeight: number,
    minDepth: number,
    maxDepth: number,
    defaultWidth: number,
    defaultHeight: number,
    defaultDepth: number,
    editWidth: boolean,
    editHeight: boolean,
    editDepth: boolean,
}
export type WardrobesFasadCountSchema = {
    id: number
    wardrobeId: number,
    minWidth: number,
    maxWidth: number,
    fasadCount: number,
}
export type DspKromkaZaglSchema = {
    id: number,
    kromkaId: number,
    zaglushkaId: number
}

export type ProfileSchema = {
    id: number,
    charId: number,
    type: number,
    brushSpecId: number,
}

export type LacobelSchema = {
    id: number,
    lacobelTypeId: number,
}
export type FasadDefaultCharSchema = {
    id: number,
    charId: number,
}
export type WardrobeDetailTableSchema = {
    id: number
    wardrobeId: number
    detailId: number
    minWidth: number
    maxWidth: number
    minHeight: number
    maxHeight: number
    count: number
    length: string
    width: string
}

export type AllData = {
    chars: CharsSchema[],
    fasadDefaultChars: FasadDefaultCharSchema[],
    charTypes: CharTypesSchema[],
    charPurpose: CharPurposeSchema[],
    matPurposes: DefaultSchema[],
    lacobels: LacobelSchema[],
    consoleTypes: ConsoleTypesSchema[],
    fasadTypes: FasadTypesSchema[],
    fasadTypeToChar: FasadTypeToCharSchema[],
    wardrobeTypes: WardrobeTypesSchema[],
    wardrobes: WardrobesSchema[],
    units: UnitsSchema[],
    profiles: ProfileSchema[],
    profileTypes: ProfileTypesSchema[],
    spec: SpecSchema[],
    specToChar: SpecToCharSchema[],
    detailNames: DetailSchema[],
    wardrobesDimensions: WardrobesDimensionsSchema[],
    wardrobesFasadCount: WardrobesFasadCountSchema[],
    settings: {
        themes: SettingsThemeSchema[]
    }
}


export type TABLE_NAMES = DATA_TABLE_NAMES | USER_TABLE_NAMES | TEMPLATE_TABLE_NAMES | SKLAD_TABLE_NAMES | SETTINGS_TABLE_NAMES;

export enum DATA_TABLE_NAMES {
    CHARS = 'chars',
    CHAR_TYPES = 'char_types',
    CHAR_PURPOSE = 'char_purpose',
    CONSOLE_TYPES = 'console_types',
    WARDROBE_DETAIL_TABLE = 'wardrobe_detail_table',
    DETAILS = 'details',
    DSP_KROMKA_ZAGL = 'dsp_kromka_zagl',
    DVP_TABLE = 'dvp_table',
    FURNITURE = 'furniture',
    LACOBEL = 'lacobel',
    LACOBEL_TYPES = 'lacobel_types',
    MAT_PURPOSE = 'mat_purpose',
    FASAD_TYPES_TABLE = 'fasad_types',
    FASAD_DEFAULT_CHAR = 'fasad_default_char',
    FASAD_TYPE_TO_CHAR = 'fasad_type_to_char',
    PROFILES = 'profiles',
    PROFILE_TYPE = 'profiletype',
    SPEC = 'spec',
    SPEC_TO_CHAR = 'spec_to_char',
    UNITS = 'units',
    WARDROBE_TYPES = 'wardrobe_types',
    WARDROBES = 'wardrobes',
    WARDROBES_DIMENSIONS = 'wardrobes_dimensions',
    WARDROBES_FASAD_COUNT = 'wardrobes_fasad_count',
    TREMPEL = 'trempel',
    PANTOGRAF = 'pantograf',
}
export enum TEMPLATE_TABLE_NAMES {
    FASAD = 'fasad',
}
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

export enum SKLAD_TABLE_NAMES {
    STOL_SKLAD = 'stol_sklad',
    STOL_INCOME = 'stol_income',
    STOL_OUTCOME = 'stol_outcome',
    STOL_COLORS = 'stol_colors',
}

export enum SETTINGS_TABLE_NAMES {
    THEMES = 'themes',
}

export type StolColorsTableSchema = {
    id: number
    name: string
}
export type StolTableSchema = {
    id: number
    length: number
    amount: number
}
export type IncomeTableSchema = StolTableSchema & {
    date: number
}
export type OutcomeTableSchema = IncomeTableSchema
