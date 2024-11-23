import { FASAD_TYPE } from "./enums"
import { SpecSchema } from "./schemas"
import { PriceData } from "./server"
import { SPEC_GROUP } from "./specification"
import { SpecItem } from "./specification"

export type FasadesData = {
    dsp: { count: number, matId: number[] },
    mirror: { count: number, matId: number[] },
    fmp: { count: number, matId: number[] },
    sand: { count: number, matId: number[] },
    lacobel: { count: number, matId: number[] },
}
export type ExtComplectData = {
    telescope: number
    console: {
        count: number
        height: number
        depth: number
        width: number
        typeId: CONSOLE_TYPE
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


export type WardrobeData = {
    wardrobeTypeId: WARDROBE_TYPE
    wardrobeId: WARDROBE_KIND
    schema: boolean
    width: number
    depth: number
    height: number
    details: Detail[]
    dspId: number
    fasades: FasadesData
    profileId: number
    extComplect: ExtComplectData
}

export type DVPData = {
    dvpWidth: number,
    dvpLength: number,
    dvpRealWidth: number,
    dvpRealLength: number,
    dvpCount: number,
    dvpPlanka: number,
    dvpPlankaCount: number
}

export type TotalData = SpecSchema & SpecResultItem & {verbose: VerboseData}

export type SpecResultItem = {
    amount: number
    charId?: number
}

export type VerboseData = (string | number)[][]
export type FullData = { data: SpecResultItem; verbose?: VerboseData}

export type SpecificationMultiResultFasades = [
    { type: FASAD_TYPE, spec: [SpecItem, SpecResultItem][] },
    { type: FASAD_TYPE, spec: [SpecItem, SpecResultItem][] },
    { type: FASAD_TYPE, spec: [SpecItem, SpecResultItem][] },
    { type: FASAD_TYPE, spec: [SpecItem, SpecResultItem][] },
    { type: FASAD_TYPE, spec: [SpecItem, SpecResultItem][] },
]

export type CombiSpecificationResult = SpecificationResult[][]
export type SpecificationResult = [SpecItem, FullData]

export type SpecificationMultiResult = { 
    type: SPEC_GROUP, 
    spec: SpecificationResult[] 
}

export enum WARDROBE_TYPE {
    WARDROBE = 1,
    SYSTEM = 2,
    GARDEROB = 3,
}

export enum CONSOLE_TYPE {
    STANDART = 1,
    RADIAL = 2,
}
export enum KROMKA_TYPE {
    THICK = 'THICK',
    THIN = 'THIN',
    NONE = 'NONE'
}
export type KROMKA_SIDE = {
    L1: KROMKA_TYPE
    L2: KROMKA_TYPE
    W1: KROMKA_TYPE
    W2: KROMKA_TYPE
}
export enum DRILL_TYPE {
    CONFIRMAT2 = 'CONFIRMAT2',
    MINIFIX2 = 'MINIFIX2',
    CONFIRMAT1 = 'CONFIRMAT1`',
    MINIFIX1 = 'MINIFIX1',
    NONE = 'NONE'
}

export enum WARDROBE_KIND {
    STANDART = 1,
    ULTRA = 2,
    LUXE = 3,
    COMFORT = 4,
    CORNER = 5,
}

export type Detail = {
    id: number
    length: number
    width: number
    count: number
    kromka: KROMKA_SIDE
    drill?: DRILL_TYPE[]
}

export enum DETAIL_NAME {
    ROOF = 1,
    STAND = 2,
    INNER_STAND = 3,
    SHELF = 4,
    SHELF_PLAT = 5,
    PILLAR = 6,
    DRAWER_FASAD = 7,
    DRAWER_SIDE = 8,
    DRAWER_BRIDGE = 9,
    DRAWER_BOTTOM_DVP = 10,
    CONSOLE_STAND = 11,
    CONSOLE_BACK_STAND = 12,
    CONSOLE_ROOF = 13,
    CONSOLE_SHELF = 14,
    BLINDER = 15,
}


