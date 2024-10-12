import { AppData, AppState } from "../types/app"
import { Profile, ProfileType } from "../types/materials"
import FasadState from "../classes/FasadState"
import { getFasadState, newFasadFromState } from "./fasades"
import { Division, FASAD_TYPE } from "../types/enums"
import Fasad from "../classes/Fasad"
import { CONSOLE_TYPE, Detail, EDGE_TYPE, WARDROBE_KIND, WARDROBE_TYPE, WardrobeData } from "../types/wardrobe"



export function getFasadWidth(wardWidth: number, fasadCount: number, wardType: WARDROBE_TYPE, profileType: ProfileType): number {
    let offset: number
    if (wardType === WARDROBE_TYPE.WARDROBE) {
        offset = profileType === ProfileType.STANDART ? [94, 108, 120, 135, 144][fasadCount - 2] : 47
    } else offset = profileType === ProfileType.STANDART ? [61, 75, 87, 104, 112][fasadCount - 2] : 15
    return Math.round((wardWidth - offset) / fasadCount) + 3
}
export function getFasadHeight(wardHeight: number, wardType: WARDROBE_TYPE, profileType: ProfileType): number {
    let offset: number
    if (wardType === WARDROBE_TYPE.WARDROBE) {
        offset = profileType === ProfileType.STANDART ? 157 : 103
    } else offset = profileType === ProfileType.STANDART ? 97 : 43
    return wardHeight - offset
}

export function getAppDataFromState(state: AppState, keepOriginalMaterial = false): AppData {
    const data: AppData = {
        order: state.order,
        wardHeight: state.wardHeight,
        wardWidth: state.wardWidth,
        fasadCount: state.fasadCount,
        profile: { ...state.profile },
        type: state.type,
        rootFasades: state.rootFasadesState.map((s: FasadState) => newFasadFromState(s, keepOriginalMaterial))
    }
    return data
}

export function getInitialAppState(): AppState {
    const wardWidth = 2400
    const wardHeight = 2400
    const fasadCount = 3
    const profile: Profile = {id:-1, type: ProfileType.STANDART, name: "", code: "", brushId: -1 }
    const wardType: WARDROBE_TYPE = WARDROBE_TYPE.WARDROBE
    return createAppState("", wardWidth, wardHeight, fasadCount, profile, wardType, FASAD_TYPE.EMPTY, -1)
}

export function createAppState(order: string, wardWidth: number, wardHeight: number, fasadCount: number, profile: Profile, wardType: WARDROBE_TYPE, fasadType = FASAD_TYPE.EMPTY, materialId = -1): AppState {
    const fasadHeight = getFasadHeight(wardHeight, wardType, profile.type)
    const fasadWidth = getFasadWidth(wardWidth, fasadCount, wardType, profile.type)
    const state: AppState = {
        order,
        wardWidth,
        wardHeight,
        fasadCount,
        profile,
        type: wardType,
        rootFasadesState: new Array(fasadCount).fill(null).map(() => getFasadState(fasadWidth, fasadHeight, Division.HEIGHT, fasadType, materialId))
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


export function getFasadCount(data: WardrobeData): number {
    return Object.values(data.fasades).reduce((a, f) => f.count + a, 0);
}

export function getEdgeDescripton(detail: Detail, edge: EDGE_TYPE): string {
    let length = 0
    let width = 0
    const result = []
    if (detail.edge?.L1 === edge) length = 1
    if (detail.edge?.L2 === edge) length += 1
    if (detail.edge?.W1 === edge) width = 1
    if (detail.edge?.W2 === edge) width += 1
    if (length > 0) result.push(`${length} по длине`)
    if (width > 0) result.push(`${width} по ширине`)
    return result.join(', ')
}