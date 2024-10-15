import { FASAD_TYPE, MAT_PURPOSE } from "./enums"
import { ProfileSchema } from "./schemas"

export type Profile = Omit<Omit<ProfileSchema, "charId">, "brushSpecId">

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




