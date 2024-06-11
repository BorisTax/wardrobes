import { FasadMaterial } from "./enums"
import { SPEC_GROUP } from "./specification"
import { SpecificationItem } from "./specification"

export interface IWardrobe {
    getDetails: () => Detail[]
    getDSP: () => number
    getDVP: () => number
    getEdge2: () => number
    getEdge05: () => number
    getGlue: () => number
    getLegs: () => number
    getConfirmat: () => number
    getMinifix: () => number
    getNails: () => number
    getDVPPlanka: () => number
    getTrempel: () => {length: number, count: number}
    getTruba: () => {length: number, count: number}
    getSamorez16: () => number
    getStyagka: () => number
    getKarton: () => number
    getNaprav: () => number
}

export type FasadesData = {
    dsp: { count: number, names: string[] },
    mirror: { count: number, names: string[] },
    fmp: { count: number, names: string[] },
    sand: { count: number, names: string[] },
    lacobel: { count: number, names: string[] },
    lacobelGlass: { count: number, names: string[] }
}
export type WardrobeData = {
    wardKind: WARDROBE_KIND
    wardType: WARDROBE_TYPE
    width: number
    depth: number
    height: number
    dspName: string
    fasades: FasadesData
    profileName: string
    extComplect: {
        telescope: number
        console: {
            count: number
            height: number
            depth: number
            width: number
            type: CONSOLE_TYPE
        }
        blinder: number
        shelf: number
        shelfPlat: number
        pillar: number
        stand: {
            count: number
            height: number
        }
        truba: number
        trempel: number
        light: number
    }
}

export type SpecificationRow = {
    name: SpecificationItem
    code_char: string
    amount: number
}

export type SpecificationResultFasades = [
    { type: FasadMaterial, spec: [SpecificationItem, number][] },
    { type: FasadMaterial, spec: [SpecificationItem, number][] },
    { type: FasadMaterial, spec: [SpecificationItem, number][] },
    { type: FasadMaterial, spec: [SpecificationItem, number][] },
    { type: FasadMaterial, spec: [SpecificationItem, number][] },
    { type: FasadMaterial, spec: [SpecificationItem, number][] },
]
export type SpecificationResult = { type: SPEC_GROUP, spec: [SpecificationItem, number][] }[]

export enum WARDROBE_TYPE {
    WARDROBE = 'WARDROBE',
    CORPUS = 'CORPUS',
    SYSTEM = 'SYSTEM',
}

export enum CONSOLE_TYPE {
    STANDART = 'STANDART',
    RADIAL = 'RADIAL',
}

export enum WARDROBE_KIND {
    STANDART = 'STANDART'
}


export type WardrobeDetailTable = {
    type: WARDROBE_KIND
    name: DETAIL_NAME
    width1: number
    width2: number
    height1: number
    height2: number
    count: number
    size: string
    enabled: boolean
}

export type Detail = {
    name: DETAIL_NAME
    length: number
    width: number
    count: number
}

export enum DETAIL_NAME {
    ROOF = 'ROOF',
    STAND = 'STAND',
    INNER_STAND = 'INNER_STAND',
    SHELF = 'SHELF',
    SHELF_PLAT = 'SHELF_PLAT',
    PILLAR = 'PILLAR'
}
