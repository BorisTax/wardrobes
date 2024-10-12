import Fasad from "../classes/Fasad"
import FasadState from "../classes/FasadState"
import { FASAD_TYPE } from "./enums"
import { Profile } from "./materials"
import { WARDROBE_TYPE } from "./wardrobe"

export type InitialAppState = {
    wardWidth: number
    wardHeight: number
    fasadCount: number
    profile: Profile
    wardType: WARDROBE_TYPE
    fasadType: FASAD_TYPE
    materialId: number
}
export type AppState = {
    order: string
    type: WARDROBE_TYPE
    wardHeight: number
    wardWidth: number
    profile: Profile
    fasadCount: number
    rootFasadesState: FasadState[]
}
export type AppData = {
    order: string
    type: WARDROBE_TYPE
    wardHeight: number
    wardWidth: number
    profile: Profile
    fasadCount: number
    rootFasades: Fasad[]
}


export type HistoryState = {
    state: AppState
    next: HistoryState | null | undefined
    previous: HistoryState | null | undefined
}

export type SetAtomComfirm<T> = [T, () => Promise<boolean>]