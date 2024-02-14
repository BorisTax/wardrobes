import Fasad from "../classes/Fasad"
import FasadState from "../classes/FasadState"
import { Division, FasadMaterial } from "../types/enums"

export function trySetWidth(fasad: Fasad | null, width: number): boolean {
    if (!fasad) return false
    if (fasad.FixedWidth()) return false
    if (width < fasad.MinSize) return false
    const { parent, initiator }: { parent: Fasad, initiator: Fasad | null } = fasad.Parent ? { parent: fasad.Parent, initiator: fasad } : { parent: fasad, initiator: null }
    if (parent.Division === Division.HEIGHT) {
        return parent.Parent ? trySetWidth(parent.Parent, width) : parent.DistributePartsOnHeight(null, 0, true)
    }
    else
        return parent.DistributePartsOnWidth(initiator, width, false) || false
}

export function trySetHeight(fasad: Fasad | null, height: number): boolean {
    if (!fasad) return false
    if (fasad.FixedHeight()) return false
    if (height < fasad.MinSize) return false
    const { parent, initiator } = fasad.Parent ? { parent: fasad.Parent, initiator: fasad } : { parent: fasad, initiator: null }
    if (parent.Division === Division.WIDTH) {
        return parent.Parent ? trySetHeight(parent.Parent, height) : parent.DistributePartsOnWidth(null, 0, true)
    }
    else
        return parent.DistributePartsOnHeight(initiator, height, false) || false
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