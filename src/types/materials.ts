import { FASAD_TYPE, MAT_PURPOSE } from "./enums"

export type OmitId<T> = Omit<T, "id">

export type FasadMaterial = {
    id: number
    name: string
    type: FASAD_TYPE
    image: string
    code: string
    purpose: MAT_PURPOSE
}

export const FasadEmptyMaterial: FasadMaterial = {
    id: 0,
    name: "",
    type: FASAD_TYPE.DSP,
    image: "",
    code: "",
    purpose: MAT_PURPOSE.BOTH,
}
export type Profile = {
    id: number
    name: string
    type: ProfileType
    code: string
    brushId: number
}

export type Kromka = {
    id: number
    name: string
    code: string
    typeId: number
}

export type KromkaType = {
    id: number
    caption: string
}
export type Zaglushka = {
    id: number
    name: string
    code: string
}

export type Brush = {
    id: number
    name: string
    code: string
}

export type Trempel = {
    id: number
    name: string
    caption: string
    code: string
}
export type Uplotnitel = {
    id: number
    name: string
    code: string
}

export type DspKromkaZagl = {
    dspId: number
    kromkaId: number
    zaglushkaId: number
}

export enum ProfileType {
    STANDART = 'STANDART',
    BAVARIA = 'BAVARIA'
}
