import { DIVIDE_FASAD, SELECT_PARENT, SET_ACTIVE_FASAD, SET_EXTMATERIAL, SET_FIXED_HEIGHT, SET_FIXED_WIDTH, SET_HEIGHT, SET_MATERIAL, SET_MATERIAL_LIST, SET_PROFILE_DIRECTION, SET_ROOTFASAD, SET_WIDTH } from '../actions/AppActions'
import Fasad from '../classes/Fasad'
import FasadState from '../classes/FasadState'
import { trySetHeight, trySetWidth } from '../functions/fasadFunc'
import { Division, FasadMaterial } from "../types/enums"
import { ExtMaterial } from '../types/materials'

export type AppState = {
    rootFasades: Fasad[]
    activeRootFasadIndex: number
    materials: Map<string, ExtMaterial[]>
}

export function appReducer(state: AppState, action: { type: string, payload?: any }) {
    const rootFasad = state.rootFasades[state.activeRootFasadIndex]
    const activeFasad = rootFasad.getActiveFasad()
    switch (action.type) {
        case DIVIDE_FASAD:
            activeFasad?.divideFasad(action.payload)
            return { ...state }
        case SELECT_PARENT:
            rootFasad.setActiveFasad(action.payload.Parent)
            return { ...state }
        case SET_ACTIVE_FASAD:
            rootFasad.setActiveFasad(action.payload)
            return { ...state }
        case SET_FIXED_HEIGHT:
            if (activeFasad) {
                if (action.payload && (activeFasad.Parent?.Division === Division.WIDTH)) activeFasad.Parent.fixHeight(action.payload); else activeFasad.fixHeight(action.payload)
            }
            return { ...state }
        case SET_FIXED_WIDTH:
            if (activeFasad) {
                if (action.payload && (activeFasad.Parent?.Division === Division.HEIGHT)) activeFasad.Parent.fixWidth(action.payload); else activeFasad.fixWidth(action.payload)
            }
            return { ...state }
        case SET_EXTMATERIAL:
            if (activeFasad) activeFasad.ExtMaterial = action.payload
            return { ...state }
        case SET_MATERIAL:
            if (activeFasad) activeFasad.Material = action.payload
            return { ...state }
        case SET_MATERIAL_LIST:
            state.materials = action.payload
            return { ...state }
        case SET_PROFILE_DIRECTION:
            if (activeFasad) {
                activeFasad.Division = action.payload
                activeFasad.divideFasad(activeFasad.Children.length)
            }
            return { ...state }
        case SET_ROOTFASAD:
            return { ...state, activeRootFasadIndex: action.payload }
        case SET_HEIGHT:
            let newRootFasad: Fasad
            if (activeFasad) {
                const height = activeFasad.Material === FasadMaterial.DSP ? action.payload : action.payload + 3
                newRootFasad = rootFasad.clone()
                const newActiveFasad = newRootFasad.getActiveFasad()
                if (trySetHeight(newActiveFasad, height)) return { ...state, rootFasad: newRootFasad }
            }
            return { ...state }
        case SET_WIDTH:
            if (activeFasad) {
                let newRootFasad: Fasad
                const width = activeFasad.Material === FasadMaterial.DSP ? action.payload : action.payload + 3
                newRootFasad = rootFasad.clone()
                const newActiveFasad = newRootFasad.getActiveFasad()
                if (trySetWidth(newActiveFasad, width)) return { ...state, rootFasad: newRootFasad }
            }
            return { ...state }
    }
    return state
}

function getFasadState(width: number, height: number, division: Division, material: FasadMaterial) {
    const state = new FasadState()
    state.height = height
    state.width = width
    state.division = division
    state.material = material
    return state
}
export function getInitialState(): AppState {
    const fasades: Fasad[] = []
    const fasadCount = 3
    for (let i = 0; i < fasadCount; i++) {
        const fasad = new Fasad()
        fasad.setState(getFasadState(1179, 2243, Division.HEIGHT, FasadMaterial.DSP))
        fasades.push(fasad)
    }
    return { rootFasades: fasades, activeRootFasadIndex: 0, materials: new Map() }
}