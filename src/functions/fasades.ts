import Fasad from "../classes/Fasad"
import FasadState from "../classes/FasadState"
import { Division, FasadMaterial } from "../types/enums"

export function trySetWidth(fasad: Fasad | null, width: number): boolean {
    if (!fasad) return false
    if (fasad.FixedWidth()) return false
    if (width < fasad.MinSize) return false
    if (!fasad.Parent) {
        fasad.Width = width;
        return fasad.Division === Division.HEIGHT
            ? fasad.DistributePartsOnHeight(null, 0, false)
            : fasad.DistributePartsOnWidth(null, 0, false);
    }

    if (fasad.Parent.Division === Division.HEIGHT)
        return trySetWidth(fasad.Parent, width);
    else
        return fasad.Parent.DistributePartsOnWidth(fasad, width, false)
}

export function trySetHeight(fasad: Fasad | null, height: number): boolean {
    if (!fasad) return false
    if (fasad.FixedHeight()) return false
    if (height < fasad.MinSize) return false
    if (!fasad.Parent) {
        fasad.Height = height;
        return fasad.Division === Division.HEIGHT
            ? fasad.DistributePartsOnHeight(null, 0, false)
            : fasad.DistributePartsOnWidth(null, 0, false);
    }
    if (fasad.Parent.Division === Division.WIDTH) {
        return trySetHeight(fasad.Parent, height)
    }
    else
        return fasad.Parent.DistributePartsOnHeight(fasad, height, false) || false
}

export function getFasadState(width: number, height: number, division: Division, material: FasadMaterial) {
    const state = new FasadState()
    state.height = height
    state.width = width
    state.division = division
    state.material = material
    return state
}

export function newFasadFromState(state: FasadState): Fasad {
    const f: Fasad = new Fasad()
    f.setState(state)
    return f
}

export function getRootFasad(fasad: Fasad): Fasad {
    if (fasad.Parent) return getRootFasad(fasad.Parent)
    return fasad
}
