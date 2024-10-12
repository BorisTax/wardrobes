import Fasad from "../classes/Fasad"
import FasadState from "../classes/FasadState"
import { Division, FASAD_TYPE } from "../types/enums"

export function trySetWidth(fasad: Fasad | null, width: number, minSize: number): boolean {
    if (!fasad) return false
    if (fasad.FixedWidth()) return false
    if (width < minSize) return false
    if (!fasad.Parent) {
        fasad.Width = width;
        return fasad.Division === Division.HEIGHT
            ? fasad.DistributePartsOnHeight(null, 0, false, minSize)
            : fasad.DistributePartsOnWidth(null, 0, false, minSize);
    }

    if (fasad.Parent.Division === Division.HEIGHT)
        return trySetWidth(fasad.Parent, width, minSize);
    else
        return fasad.Parent.DistributePartsOnWidth(fasad, width, false, minSize)
}

export function trySetHeight(fasad: Fasad | null, height: number, minSize: number): boolean {
    if (!fasad) return false
    if (fasad.FixedHeight()) return false
    if (height < minSize) return false
    if (!fasad.Parent) {
        fasad.Height = height;
        return fasad.Division === Division.HEIGHT
            ? fasad.DistributePartsOnHeight(null, 0, false, minSize)
            : fasad.DistributePartsOnWidth(null, 0, false, minSize);
    }
    if (fasad.Parent.Division === Division.WIDTH) {
        return trySetHeight(fasad.Parent, height, minSize)
    }
    else
        return fasad.Parent.DistributePartsOnHeight(fasad, height, false, minSize) || false
}

export function getFasadState(width: number, height: number, division: Division, fasadType: FASAD_TYPE, materialId: number) {
    const state = new FasadState()
    state.height = height
    state.width = width
    state.division = division
    state.fasadType = fasadType
    state.materialId = materialId
    return state
}

export function newFasadFromState(state: FasadState, keepOriginalMaterial = false): Fasad {
    const f: Fasad = new Fasad()
    f.setState(state, keepOriginalMaterial)
    return f
}

export function getRootFasad(fasad: Fasad): Fasad {
    if (fasad.Parent) return getRootFasad(fasad.Parent)
    return fasad
}
export function hasFasadImage(fasad: Fasad){
    return fasad.FasadType === FASAD_TYPE.FMP || fasad.FasadType === FASAD_TYPE.SAND
}

export function isFasadExist(root: Fasad, fasad: Fasad): boolean{
    if(root === fasad) return true
    return root.Children.some(c => isFasadExist(c, fasad))
}

export function getTotalFasadWidthRatio(fasad: Fasad | null): number {
    let total = 0
    if (!fasad || !fasad.Parent || fasad.Parent.Division===Division.HEIGHT) return total
    for (let c of fasad.Parent.Children) {
        if (!c.FixedWidth()) total += c.WidthRatio
    }
    return total
}

export function getTotalFasadHeightRatio(fasad: Fasad | null): number {
    let total = 0
    if (!fasad || !fasad.Parent || fasad.Parent.Division === Division.WIDTH) return total
    for (let c of fasad.Parent.Children) {
        if (!c.FixedHeight()) total += c.HeightRatio
    }
    return total
}