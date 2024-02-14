import Fasad from "../classes/Fasad"
import FasadState from "../classes/FasadState"
import { Profile } from "./materials"

export type AppState = {
    type: WardType
    wardHeight: number
    wardWidth: number
    profile: Profile
    fasadCount: number
    rootFasadesState: FasadState[]
}
export type AppData = {
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