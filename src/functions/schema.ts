import Fasad from "../classes/Fasad";
import { FASAD_TYPE } from "../types/enums";

function combineFasadColors(fasad: Fasad, fasadType: FASAD_TYPE): Set<number> {
    let colors = new Set<number>()
    if (fasad.Children.length === 0) {
        if (fasad.FasadType === fasadType) colors.add(fasad.MaterialId)
        return colors
    }
    fasad.Children.forEach((c: Fasad) => {
        const col = combineFasadColors(c, fasadType)
        colors = new Set([...colors, ...col])
    })
    return colors
}

export function combineColors(rootFasades: Fasad[], fasadType: FASAD_TYPE): Set<number> {
    let colors = new Set<number>()
    rootFasades.forEach((r: Fasad) => {
        const col = combineFasadColors(r, fasadType)
        colors = new Set([...colors, ...col])
    })
    return colors
}