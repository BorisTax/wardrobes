import FasadState from "../classes/FasadState"
import { Profile } from "./materials"

export type AppState = {
    type: WardType
    wardHeight: number
    wardWidth: number
    profile: Profile
    fasadCount: number
    rootFasades: FasadState[]
}
export enum WardType {
    WARDROBE = "WARDROBE",
    SYSTEM = "SYSTEM"
}