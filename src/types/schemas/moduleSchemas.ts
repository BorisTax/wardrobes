import { DefaultSchema } from "./schemas"

export enum MODULE_TABLE_NAMES {
    MAT_BASE = 'matBase',
    GROUPS = 'groups',
    EDGES = 'edges',
    GROOVES = 'grooves',
    MODULES = 'modules',
    CORRESPOND = 'correspond',
    COLORS = 'colors',
    COMMENTS = 'comments',
    SERIES = 'series',
    MATERIALS = 'materials',
    FILM = 'film',
    SERIES_MATERIALS = 'seriesMaterials',
    DETAILS = 'details',
    MATERIAL_CORRESPOND = 'materialCorrespond',
}


export type ModuleMatBaseTableSchema = {
    id: number
    name: string
    code: number
    thickness: number
}
export type ModuleGroupsTableSchema = DefaultSchema

export type ModuleEdgesTableSchema = DefaultSchema & { thickness: number }

export type ModuleGroovesTableSchema = DefaultSchema

export type ModuleModulesTableSchema = {
    id: number
    name: string
    serieId: number
    shortName: string
    sortIndex: number
}

export type ModuleCorrespondTableSchema = {
    id: number
    serieId: number
    moduleId: number
    name1C: string
    code1C: number
    orderName: string
}

export type ModuleColorsTableSchema = {
    id: number
    name: string
    code: string
    texture: number
}


export type ModuleCommentsTableSchema = DefaultSchema


export type ModuleSeriesTableSchema = {
    id: number
    name: string
    groupId: number
}


export type ModuleDetailsTableSchema = {
    id: number
    moduleId: number
    name: string
    matIndex: number
    length: number
    width: number
    count: number
    grooveId: number
    commentId: number
    el1: number
    el2: number
    ew1: number
    ew2: number
    texture: number
}


export type ModuleMaterialsTableSchema = {
    id: number
    baseId: number
    colorId: number
    length: number
    width: number
    shortName: string
}


export type ModuleFilmTableSchema = {
    id: number
    materialId: number
    glossy: number
}


export type ModuleSerieMaterialsTableSchema = {
    id: number
    serieId: number
    moduleId: number
    matIndex: number
    materialId: number
}


export type ModuleMaterialCorrespondTableSchema = {
    id: number
    material1C: string
    materialId: number
    matIndex: number
}