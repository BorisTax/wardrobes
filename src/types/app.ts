import Fasad from "../classes/Fasad"
import FasadState from "../classes/FasadState"
import Shape from "../classes/corpus/shape"
import ShapeState from "../classes/corpus/shapeState"
import { Profile } from "../server/types/materials"

export type AppState = {
    order: string
    type: WardType
    wardHeight: number
    wardDepth: number
    wardWidth: number
    workspace: Workspace
    corpus: CorpusState
    fasades: FasadesState
}

export type AppData = {
    order: string
    type: WardType
    wardHeight: number
    wardDepth: number
    wardWidth: number
    workspace: Workspace
    corpus: CorpusData
    fasades: FasadesData
}

export type FasadesState = {
    profile: Profile
    fasadCount: number
    rootFasadesState: FasadState[]
}

export type FasadesData = {
    profile: Profile
    fasadCount: number
    rootFasades: Fasad[]
}

export type CorpusData = {
    material: string
    shapes: Shape[]
}
export type CorpusState = {
    material: string
    shapes: ShapeState[]
}

export enum Workspace {
    CORPUS = "CORPUS",
    FASADES = "FASADES"
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

export type SetAtomConfirm<T> = [T, () => Promise<boolean>]