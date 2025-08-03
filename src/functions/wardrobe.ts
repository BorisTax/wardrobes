import { AppState } from "../types/app"
import { ProfileType } from "../types/enums"
import { cloneFasad, excludeFasadParent, getFasadState } from "./fasades"
import { Division, FASAD_TYPE } from "../types/enums"
import {  Detail, KROMKA_TYPE, WARDROBE_KIND, WARDROBE_TYPE, WardrobeData } from "../types/wardrobe"
import { Profile } from "../types/materials"
import { WardrobesDimensionsSchema } from "../types/schemas"



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

export function getInitialAppState(): AppState {
    const wardWidth = 2400
    const wardHeight = 2400
    const fasadCount = 3
    const profile = {id: 0, type: ProfileType.STANDART}
    const wardTypeId = WARDROBE_TYPE.WARDROBE
    return createAppState(wardWidth, wardHeight, fasadCount, profile, wardTypeId, FASAD_TYPE.EMPTY, 0)
}

export function createAppState(wardWidth: number, wardHeight: number, fasadCount: number, profile: Profile, wardTypeId: WARDROBE_TYPE, fasadType = FASAD_TYPE.EMPTY, materialId = 0): AppState {
    const fasadHeight = getFasadHeight(wardHeight, wardTypeId, profile.type)
    const fasadWidth = getFasadWidth(wardWidth, fasadCount, wardTypeId, profile.type)
    const state: AppState = {
        wardWidth,
        wardHeight,
        fasadCount,
        profile,
        type: wardTypeId,
        rootFasades: new Array(fasadCount).fill(null).map(() => getFasadState(fasadWidth, fasadHeight, Division.HEIGHT, fasadType, materialId))
    }
    return state
}

export function cloneAppState(state: AppState): AppState {
    const appState: AppState = {
        ...state,
        profile: { ...state.profile },
        rootFasades: state.rootFasades.map(f => cloneFasad(f))
    }
    return appState
}
export function stringifyAppState(state: AppState): string {
    const appState: AppState = {
        ...state,
        profile: { ...state.profile },
        rootFasades: state.rootFasades.map(f => excludeFasadParent(f))
    }
    return JSON.stringify(appState)
}

export function getFasadCount(data: WardrobeData): number {
    return Object.values(data.fasades).reduce((a, f) => f.count + a, 0);
}

export function getEdgeDescripton(detail: Detail, edge: KROMKA_TYPE): string {
    let length = 0
    let width = 0
    const result = []
    if (detail.kromka?.L1 === edge) length = 1
    if (detail.kromka?.L2 === edge) length += 1
    if (detail.kromka?.W1 === edge) width = 1
    if (detail.kromka?.W2 === edge) width += 1
    if (length > 0) result.push(`${length} по длине`)
    if (width > 0) result.push(`${width} по ширине`)
    return result.join(', ')
}

export function getInitialWardrobeDimensions(wardrobeId: WARDROBE_KIND, wardrobeDimensions: WardrobesDimensionsSchema[]) {
    return wardrobeDimensions.find(w => w.wardrobeId === wardrobeId) ||
    {
        minWidth: 0,
        maxWidth: 0,
        minHeight: 0,
        maxHeight: 0,
        minDepth: 0,
        maxDepth: 0,
        defaultDepth: 0,
        defaultHeight: 0,
        defaultWidth: 0,
        editDepth: false,
        editHeight: false,
        editWidth: false,
    }
}