import Fasad from "../classes/Fasad";
import { FasadMaterial } from "../types/enums";

function combineFasadColors(fasad: Fasad, material: FasadMaterial): Set<string> {
    let colors = new Set<string>()
    if (fasad.Children.length === 0) {
        if (fasad.Material === material) colors.add(fasad.ExtMaterial)
        return colors
    }
    fasad.Children.forEach((c: Fasad) => {
        const col = combineFasadColors(c, material)
        colors = new Set([...colors, ...col])
    })
    return colors
}

export function combineColors(rootFasades: Fasad[], material: FasadMaterial): Set<string> {
    let colors = new Set<string>()
    rootFasades.forEach((r: Fasad) => {
        const col = combineFasadColors(r, material)
        colors = new Set([...colors, ...col])
    })
    return colors
}