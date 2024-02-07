import { atom } from 'jotai'
import Fasad from '../classes/Fasad'
import FasadState from '../classes/FasadState'
import { Division, FasadMaterial } from '../types/enums'
import { trySetHeight, trySetWidth } from '../functions/fasadFunc'
import { getFasadMaterial, getProfileDirection } from '../functions/functions'

export const rootFasadesAtom = atom(getInitialState())
export const activeRootFasadIndexAtom = atom(0)
export const activeFasadAtom = atom<Fasad | null>((get) => {
    const index = get(activeRootFasadIndexAtom)
    const rootFasades = get(rootFasadesAtom)
    return rootFasades[index].getActiveFasad()
})
export const setActiveFasadAtom = atom(null, (get, set, activeFasad: Fasad | null) => {
    const index = get(activeRootFasadIndexAtom)
    const rootFasades = get(rootFasadesAtom)
    rootFasades[index].setActiveFasad(activeFasad)
    set(rootFasadesAtom, [...rootFasades])
})
export const setHeightAtom = atom(null, (get, set, newHeight: number) => {
    const index = get(activeRootFasadIndexAtom)
    const rootFasades = get(rootFasadesAtom)
    const activeFasad = rootFasades[index].getActiveFasad()
    if (!activeFasad) return
    const height = activeFasad.Material === FasadMaterial.DSP ? newHeight : newHeight + 3
    const newRootFasad = rootFasades[index].clone()
    const newActiveFasad = newRootFasad.getActiveFasad()
    if (trySetHeight(newActiveFasad, height)) {
        rootFasades[index] = newRootFasad
        set(rootFasadesAtom, [...rootFasades])
    }
})
export const setWidthAtom = atom(null, (get, set, newWidth: number) => {
    const index = get(activeRootFasadIndexAtom)
    const rootFasades = get(rootFasadesAtom)
    const activeFasad = rootFasades[index].getActiveFasad()
    if (!activeFasad) return
    const width = activeFasad.Material === FasadMaterial.DSP ? newWidth : newWidth + 3
    const newRootFasad = rootFasades[index].clone()
    const newActiveFasad = newRootFasad.getActiveFasad()
    if (trySetWidth(newActiveFasad, width)) {
        rootFasades[index] = newRootFasad
        set(rootFasadesAtom, [...rootFasades])
    }
})
export const divideFasadAtom = atom(null, (get, set, count: number) => {
    const rootFasades = get(rootFasadesAtom)
    const activeFasad = get(activeFasadAtom)
    activeFasad?.divideFasad(count)
    set(rootFasadesAtom, [...rootFasades])
})

export const setFixedHeightAtom = atom(null, (get, set, fixed: boolean) => {
    const rootFasades = get(rootFasadesAtom)
    const activeFasad = get(activeFasadAtom)
    if (!activeFasad) return
    if (fixed && (activeFasad.Parent?.Division === Division.WIDTH)) activeFasad.Parent.fixHeight(fixed); else activeFasad.fixHeight(fixed)
    set(rootFasadesAtom, [...rootFasades])
})
export const setFixedWidthAtom = atom(null, (get, set, fixed: boolean) => {
    const rootFasades = get(rootFasadesAtom)
    const activeFasad = get(activeFasadAtom)
    if (!activeFasad) return
    if (fixed && (activeFasad.Parent?.Division === Division.HEIGHT)) activeFasad.Parent.fixWidth(fixed); else activeFasad.fixWidth(fixed)
    set(rootFasadesAtom, [...rootFasades])
})

export const setExtMaterialAtom = atom(null, (get, set, extMaterial: string) => {
    const rootFasades = get(rootFasadesAtom)
    const activeFasad = get(activeFasadAtom)
    if (!activeFasad) return
    activeFasad.ExtMaterial = extMaterial
    set(rootFasadesAtom, [...rootFasades])
})
export const setMaterialAtom = atom(null, (get, set, material: FasadMaterial | string) => {
    const rootFasades = get(rootFasadesAtom)
    const activeFasad = get(activeFasadAtom)
    if (!activeFasad) return
    activeFasad.Material = getFasadMaterial(material)
    set(rootFasadesAtom, [...rootFasades])
})
export const setProfileDirectionAtom = atom(null, (get, set, direction: string) => {
    const rootFasades = get(rootFasadesAtom)
    const activeFasad = get(activeFasadAtom)
    if (!activeFasad) return
    activeFasad.Division = getProfileDirection(direction)
    activeFasad.divideFasad(activeFasad.Children.length)
    set(rootFasadesAtom, [...rootFasades])
})



function getFasadState(width: number, height: number, division: Division, material: FasadMaterial) {
    const state = new FasadState()
    state.height = height
    state.width = width
    state.division = division
    state.material = material
    return state
}
export function getInitialState(): Fasad[] {
    const fasades: Fasad[] = []
    const fasadCount = 3
    for (let i = 0; i < fasadCount; i++) {
        const fasad = new Fasad()
        fasad.setState(getFasadState(1179, 2243, Division.HEIGHT, FasadMaterial.DSP))
        fasades.push(fasad)
    }
    return fasades
}