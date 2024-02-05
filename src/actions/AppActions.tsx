import Fasad from "../classes/Fasad"
export const DIVIDE_FASAD = "DIVIDE_FASAD"
export const SET_ACTIVE_FASAD = "SET_ACTIVE_FASAD"
export const SET_FIXED_HEIGHT = "SET_FIXED_HEIGHT"
export const SET_FIXED_WIDTH = "SET_FIXED_WIDTH"
export const SET_HEIGHT = "SET_HEIGHT"
export const SET_EXTMATERIAL = "SET_eXTMATERIAL"
export const SET_MATERIAL = "SET_MATERIAL"
export const SET_MATERIAL_LIST = "SET_MATERIAL_LIST"
export const SET_PROFILE_DIRECTION = "SET_PROFILE_DIRECTION"
export const SET_WIDTH = "SET_WIDTH"
export function divideFasad(count: number) {
    return {
        type: DIVIDE_FASAD,
        payload: count
    }
}
export function setActiveFasad(fasad: Fasad | null) {
    return {
        type: SET_ACTIVE_FASAD,
        payload: fasad
    }
}
export function setFixedHeight(fixed: boolean) {
    return {
        type: SET_FIXED_HEIGHT,
        payload: fixed
    }
}
export function setFixedWidth(fixed: boolean) {
    return {
        type: SET_FIXED_WIDTH,
        payload: fixed
    }
}
export function setHeight(height: number) {
    return {
        type: SET_HEIGHT,
        payload: height
    }
}
export function setExtMaterial(extmaterial: string) {
    return {
        type: SET_EXTMATERIAL,
        payload: extmaterial
    }
}
export function setMaterial(material: string) {
    return {
        type: SET_MATERIAL,
        payload: material
    }
}
export function setMaterialList(materials: Map<string, string>) {
    return {
        type: SET_MATERIAL_LIST,
        payload: materials
    }
}
export function setProfileDirection(direction: string) {
    return {
        type: SET_PROFILE_DIRECTION,
        payload: direction
    }
}
export function setWidth(width: number) {
    return {
        type: SET_WIDTH,
        payload: width
    }
}