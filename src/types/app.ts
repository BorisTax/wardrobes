import Fasad from "../classes/Fasad"
import FasadState from "../classes/FasadState"
import { Profile } from "./materials"

export type AppState = {
    order: string
    type: WardType
    wardHeight: number
    wardWidth: number
    profile: Profile
    fasadCount: number
    rootFasadesState: FasadState[]
}
export type AppData = {
    order: string
    type: WardType
    wardHeight: number
    wardWidth: number
    profile: Profile
    fasadCount: number
    rootFasades: Fasad[]
}
export enum WardType {
    WARDROBE = "WARDROBE",
    SYSTEM = "SYSTEM"
}

export type HistoryState = {
    state: AppState
    next: HistoryState | null | undefined
    previous: HistoryState | null | undefined
}

export type SetAtomComfirm<T> = [T, () => Promise<boolean>]