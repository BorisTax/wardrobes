import Fasad from "../classes/Fasad"
import { Division } from "../types/enums"

export function trySetWidth(fasad: Fasad | null, width: number): boolean {
    if (!fasad) return false
    if(fasad.FixedWidth()) return false
    if (width < fasad.MinSize) return false
    if (fasad.Parent === null) return false
    if (fasad.Parent.Division === Division.HEIGHT) {
        return trySetWidth(fasad.Parent, width)
    }
    else
        return fasad.Parent.DistributePartsOnWidth(fasad, width, false)
}

export function trySetHeight(fasad: Fasad | null, height: number): boolean {
    if(!fasad) return false
    if(fasad.FixedHeight()) return false
    if (height < fasad.MinSize) return false
    if (fasad.Parent === null) return false
    if (fasad.Parent.Division === Division.WIDTH) {
        return trySetHeight(fasad.Parent, height)
    }
    else
        return fasad.Parent.DistributePartsOnHeight(fasad, height, false)
}

