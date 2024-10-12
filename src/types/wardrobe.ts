import { FASAD_TYPE } from "./enums"
import { PriceData, SpecificationData } from "./server"
import { SPEC_GROUP } from "./specification"
import { SpecificationItem } from "./specification"

export interface IWardrobe {
    getTrempel: () => {length: number, count: number}
    getTruba: () => {length: number, count: number}
    getStyagka: () => number
    getNaprav: () => number
}

export type FasadesData = {
    dsp: { count: number, matId: number[] },
    mirror: { count: number, matId: number[] },
    fmp: { count: number, matId: number[] },
    sand: { count: number, matId: number[] },
    lacobel: { count: number, matId: number[] },
    lacobelGlass: { count: number, matId: number[] }
}
export type ExtComplectData = {
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


export type WardrobeData = {
    wardKind: WARDROBE_KIND
    wardType: WARDROBE_TYPE
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

export type TotalData = PriceData & SpecificationData & SpecificationResultItem & {verbose: VerboseData}

export type SpecificationResultItem = {
    amount: number
    char?: {
        code: string
        caption: string
    }
    useCharAsCode?: boolean
}

export type VerboseData = (string | number)[][]
export type FullData = { data: SpecificationResultItem; verbose?: VerboseData}

export type SpecificationMultiResultFasades = [
    { type: FASAD_TYPE, spec: [SpecificationItem, SpecificationResultItem][] },
    { type: FASAD_TYPE, spec: [SpecificationItem, SpecificationResultItem][] },
    { type: FASAD_TYPE, spec: [SpecificationItem, SpecificationResultItem][] },
    { type: FASAD_TYPE, spec: [SpecificationItem, SpecificationResultItem][] },
    { type: FASAD_TYPE, spec: [SpecificationItem, SpecificationResultItem][] },
    { type: FASAD_TYPE, spec: [SpecificationItem, SpecificationResultItem][] },
]

export type CombiSpecificationResult = { specifications: SpecificationResult[][], totalPrice: number[] }
export type SpecificationResult = [SpecificationItem, FullData]

export type SpecificationMultiResult = { 
    type: SPEC_GROUP, 
    spec: SpecificationResult[] 
}[]

export enum WARDROBE_TYPE {
    WARDROBE = 'WARDROBE',
    GARDEROB = 'GARDEROB',
    SYSTEM = 'SYSTEM',
}

export enum CONSOLE_TYPE {
    STANDART = 'STANDART',
    RADIAL = 'RADIAL',
}
export enum EDGE_TYPE {
    THICK = 'THICK',
    THIN = 'THIN',
    NONE = 'NONE'
}
export type EDGE_SIDE = {
    L1: EDGE_TYPE
    L2: EDGE_TYPE
    W1: EDGE_TYPE
    W2: EDGE_TYPE
}
export enum DRILL_TYPE {
    CONFIRMAT2 = 'CONFIRMAT2',
    MINIFIX2 = 'MINIFIX2',
    CONFIRMAT1 = 'CONFIRMAT1`',
    MINIFIX1 = 'MINIFIX1',
    NONE = 'NONE'
}

export enum WARDROBE_KIND {
    STANDART = 'STANDART'
}

export type WardrobeDetailTable = {
    type: WARDROBE_KIND
    name: DETAIL_NAME
    minwidth: number
    maxwidth: number
    minheight: number
    maxheight: number
    count: number
    size: string
    enabled: boolean
}

export type Detail = {
    name: DETAIL_NAME
    caption?: string
    length: number
    width: number
    count: number
    edge?: EDGE_SIDE
    drill?: DRILL_TYPE[]
}

export enum DETAIL_NAME {
    ROOF = 'ROOF',
    STAND = 'STAND',
    INNER_STAND = 'INNER_STAND',
    SHELF = 'SHELF',
    SHELF_PLAT = 'SHELF_PLAT',
    PILLAR = 'PILLAR',
    CONSOLE_STAND= "CONSOLE_STAND",
    CONSOLE_BACK_STAND= "CONSOLE_BACK_STAND",
    CONSOLE_ROOF = 'CONSOLE_ROOF',
    CONSOLE_SHELF = 'CONSOLE_SHELF',
    DRAWER_FASAD = 'DRAWER_FASAD',
    DRAWER_SIDE = 'DRAWER_SIDE', 
    DRAWER_BRIDGE = 'DRAWER_BRIDGE',
    DRAWER_BOTTOM_DVP = 'DRAWER_BOTTOM_DVP',
    BLINDER = 'BLINDER',
}


