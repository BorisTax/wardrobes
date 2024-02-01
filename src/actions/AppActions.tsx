import Fasad from "../classes/Fasad"
export const DIVIDE_FASAD = "DIVIDE_FASAD"
export const SET_ACTIVE_FASAD = "SET_ACTIVE_FASAD"
export const SET_MATERIAL = "SET_MATERIAL"
export const SET_HEIGHT = "SET_HEIGHT"
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
export function setMaterial(material: string) {
    return {
        type: SET_MATERIAL,
        payload: material
    }
}
export function setHeight(height: number) {
    return {
        type: SET_HEIGHT,
        payload: height
    }
}
export function setWidth(width: number) {
    return {
        type: SET_WIDTH,
        payload: width
    }
}