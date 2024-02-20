import { AppData, AppState, WardType } from "../types/app"
import { Profile, ProfileType } from "../types/materials"
import FasadState from "../classes/FasadState"
import { getFasadState, newFasadFromState } from "./fasades"
import { Division, FasadMaterial } from "../types/enums"
import Fasad from "../classes/Fasad"

export const WardTypes: Map<string, string> = new Map()
WardTypes.set("ШКАФ", WardType.WARDROBE)
WardTypes.set("СИСТЕМА", WardType.SYSTEM)


export const WardTypesCaptions: Map<string, string> = new Map()
WardTypesCaptions.set(WardType.WARDROBE, "ШКАФ")
WardTypesCaptions.set(WardType.SYSTEM, "СИСТЕМА")

export function getFasadWidth(wardWidth: number, fasadCount: number, wardType: WardType, profileType: ProfileType): number {
    let offset: number
    if (wardType === WardType.WARDROBE) {
        offset = profileType === ProfileType.STANDART ? [94, 108, 120, 135, 144][fasadCount - 2] : 47
    } else offset = profileType === ProfileType.STANDART ? [61, 75, 87, 104, 112][fasadCount - 2] : 15
    return Math.round((wardWidth - offset) / fasadCount) + 3
}
export function getFasadHeight(wardHeight: number, wardType: WardType, profileType: ProfileType): number {
    let offset: number
    if (wardType === WardType.WARDROBE) {
        offset = profileType === ProfileType.STANDART ? 157 : 103
    } else offset = profileType === ProfileType.STANDART ? 97 : 43
    return wardHeight - offset
}

export function getAppDataFromState(state: AppState): AppData {
    const data: AppData = {
        order: state.order,
        wardHeight: state.wardHeight,
        wardWidth: state.wardWidth,
        fasadCount: state.fasadCount,
        profile: { ...state.profile },
        type: state.type,
        rootFasades: state.rootFasadesState.map((s: FasadState) => newFasadFromState(s))
    }
    return data
}

export function getInitialAppState(): AppState {
    const wardWidth = 2400
    const wardHeight = 2400
    const fasadCount = 2
    const profile: Profile = { type: ProfileType.STANDART, name: "", code: "" }
    const wardType: WardType = WardType.WARDROBE
    return createAppState("", wardWidth, wardHeight, fasadCount, profile, wardType)
}

export function createAppState(order:string, wardWidth: number, wardHeight: number, fasadCount: number, profile: Profile, wardType: WardType): AppState {
    const fasadHeight = getFasadHeight(wardHeight, wardType, profile.type)
    const fasadWidth = getFasadWidth(wardWidth, fasadCount, wardType, profile.type)
    const state: AppState = {
        order,
        wardWidth,
        wardHeight,
        fasadCount,
        profile,
        type: wardType,
        rootFasadesState: new Array(fasadCount).fill(null).map(() => getFasadState(fasadWidth, fasadHeight, Division.HEIGHT, FasadMaterial.EMPTY))
    }
    return state
}

export function getAppState(data: AppData): AppState {
    const state: AppState = {
        order: data.order,
        wardHeight: data.wardHeight,
        wardWidth: data.wardWidth,
        fasadCount: data.fasadCount,
        profile: { ...data.profile },
        type: data.type,
        rootFasadesState: data.rootFasades.map((f: Fasad) => f.getState())
    }
    return state
}