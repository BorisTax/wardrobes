import { WardrobeDetail } from "../wardrobes/types"
import { ExtMaterial, Profile } from "./materials"

export interface IWardrobe {
    getDetails: () => WardrobeDetail[]
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
export type WardrobeData = {
    wardType: WARDROBE_TYPE
    width: number
    depth: number
    height: number
    dspName: string
    fasades: {
        dsp: {count: number, names: string[]}, 
        mirror: {count: number, names: string[]}, 
        fmp: {count: number, names: string[]}, 
        sand: {count: number, names: string[]}, 
        lacobel: {count: number, names: string[]}, 
        lacobelGlass: {count: number, names: string[]}
    }
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

export enum WARDROBE_TYPE {
    WARDROBE = 'WARDROBE',
    CORPUS = 'CORPUS',
    SYSTEM = 'SYSTEM',
}

export enum CONSOLE_TYPE {
    STANDART = 'STANDART',
    RADIAL = 'RADIAL',
}