import { WardType } from "../types/app"
import { ProfileType } from "../types/materials"

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
