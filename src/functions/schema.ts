import FasadState from "../classes/FasadState";
import { FASAD_TYPE } from "../types/enums";

function combineFasadColors(fasad: FasadState, fasadType: FASAD_TYPE): Set<number> {
    let colors = new Set<number>()
    if (fasad.children.length === 0) {
        if (fasad.fasadType === fasadType) colors.add(fasad.materialId)
        return colors
    }
    fasad.children.forEach((c: FasadState) => {
        const col = combineFasadColors(c, fasadType)
        colors = new Set([...colors, ...col])
    })
    return colors
}

export function combineColors(rootFasades: FasadState[], fasadType: FASAD_TYPE): Set<number> {
    let colors = new Set<number>()
    rootFasades.forEach((r: FasadState) => {
        const col = combineFasadColors(r, fasadType)
        colors = new Set([...colors, ...col])
    })
    return colors
}