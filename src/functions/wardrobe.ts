import { AppData, AppState, WardType, Workspace } from "../types/app"
import { Profile, ProfileType } from "../server/types/materials"
import FasadState from "../classes/FasadState"
import { getFasadState, newFasadFromState } from "./fasades"
import { Division, FasadMaterial } from "../types/enums"
import Fasad from "../classes/Fasad"
import ShapeState from "../classes/corpus/shapeState"
import { createSingleWardrobe, newShapeFromState } from "./corpus/init"
import Shape from "../classes/corpus/shape"

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
        wardDepth: state.wardDepth,
        wardWidth: state.wardWidth,
        workspace: state.workspace,
        type: state.type,
        fasades: {
            fasadCount: state.fasades.fasadCount,
            profile: { ...state.fasades.profile },
            rootFasades: state.fasades.rootFasadesState.map((s: FasadState) => newFasadFromState(s))
        },
        corpus: {
            material: state.corpus.material,
            shapes: state.corpus.shapes.map((s: ShapeState) => newShapeFromState(s))
            }
    }
    return data
}

export function getInitialAppState(): AppState {
    const wardWidth = 2400
    const wardDepth = 600
    const wardHeight = 2400
    const fasadCount = 2
    const profile: Profile = { type: ProfileType.STANDART, name: "", code: "" }
    const wardType: WardType = WardType.WARDROBE
    return getAppState(createAppData("", wardWidth, wardDepth, wardHeight, fasadCount, profile, wardType))
}

export function createAppData(order: string, wardWidth: number, wardDepth: number, wardHeight: number, fasadCount: number, profile: Profile, wardType: WardType): AppData {
    const fasadHeight = getFasadHeight(wardHeight, wardType, profile.type)
    const fasadWidth = getFasadWidth(wardWidth, fasadCount, wardType, profile.type)
    const data: AppData = {
        order,
        wardWidth,
        wardDepth,
        wardHeight,
        type: wardType,
        workspace: Workspace.CORPUS,
        fasades: {
            fasadCount,
            profile,
            rootFasades: new Array(fasadCount).fill(null).map(() => newFasadFromState(getFasadState(fasadWidth, fasadHeight, Division.HEIGHT, FasadMaterial.EMPTY)))
        },
        corpus: {
            material: "",
            shapes: createSingleWardrobe(wardHeight, wardDepth, wardWidth)
        }
    }
    return data
}

export function getAppState(data: AppData): AppState {
    const state: AppState = {
        order: data.order,
        wardHeight: data.wardHeight,
        wardDepth: data.wardDepth,
        wardWidth: data.wardWidth,
        type: data.type,
        workspace: data.workspace,
        fasades: {
            fasadCount: data.fasades.fasadCount,
            profile: { ...data.fasades.profile },
            rootFasadesState: data.fasades.rootFasades.map((f: Fasad) => f.getState())
        },
        corpus: {
            material: data.corpus.material,
            shapes: data.corpus.shapes.map((s: Shape) => s.getState())
        }
    }
    return state
}