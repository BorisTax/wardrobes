import { atom } from 'jotai'
import Fasad from '../classes/Fasad'
import { Division, FasadMaterial, SandBase } from '../types/enums'
import { getRootFasad, trySetHeight, trySetWidth } from '../functions/fasades'
import { getProfileDirection } from '../functions/materials'
import { materialListAtom } from './materials'
import { appDataAtom } from './app'

export const activeRootFasadIndexAtom = atom(0)
export const activeFasadAtom = atom<Fasad | null>((get) => {
    const appData = get(appDataAtom)
    let activeFasad: Fasad | null = null
    appData.rootFasades.forEach((f: Fasad) => {
        const active = f.getActiveFasad()
        if (active) activeFasad = active
    })
    return activeFasad
})
export const setActiveFasadAtom = atom(null, (get, set, activeFasad: Fasad | null) => {
    const appData = get(appDataAtom)
    appData.rootFasades.forEach((f: Fasad) => f.setActiveFasad(activeFasad))
    set(appDataAtom, { ...appData })
})
export const setHeightAtom = atom(null, (get, set, newHeight: number) => {
    const activeFasad = get(activeFasadAtom)
    if (!activeFasad) return
    const appData = get(appDataAtom)
    const rootFasad = getRootFasad(activeFasad)
    const rootFasadIndex = appData.rootFasades.findIndex((f: Fasad) => f === rootFasad)
    const height = activeFasad.Material === FasadMaterial.DSP ? newHeight : newHeight + 3
    const newRootFasad = rootFasad.clone()
    const newActiveFasad = newRootFasad.getActiveFasad()
    if (trySetHeight(newActiveFasad, height)) {
        appData.rootFasades[rootFasadIndex] = newRootFasad
        set(appDataAtom, { ...appData })
    }
})

export const setWidthAtom = atom(null, (get, set, newWidth: number) => {
    const activeFasad = get(activeFasadAtom)
    if (!activeFasad) return
    const appData = get(appDataAtom)
    const rootFasad = getRootFasad(activeFasad)
    const rootFasadIndex = appData.rootFasades.findIndex((f: Fasad) => f === rootFasad)
    const width = activeFasad.Material === FasadMaterial.DSP ? newWidth : newWidth + 3
    const newRootFasad = rootFasad.clone()
    const newActiveFasad = newRootFasad.getActiveFasad()
    if (trySetWidth(newActiveFasad, width)) {
        appData.rootFasades[rootFasadIndex] = newRootFasad
        set(appDataAtom, { ...appData })
    }
})
export const divideFasadAtom = atom(null, (get, set, count: number) => {
    const activeFasad = get(activeFasadAtom)
    if (!activeFasad) return
    const appData = get(appDataAtom)
    activeFasad.divideFasad(count)
    set(appDataAtom, { ...appData })
})

export const setFixedHeightAtom = atom(null, (get, set, fixed: boolean) => {
    const activeFasad = get(activeFasadAtom)
    if (!activeFasad) return
    const appData = get(appDataAtom)
    if (fixed && (activeFasad.Parent?.Division === Division.WIDTH)) activeFasad.Parent.fixHeight(fixed);
    activeFasad.fixHeight(fixed)
    set(appDataAtom, { ...appData })
})
export const setFixedWidthAtom = atom(null, (get, set, fixed: boolean) => {
    const activeFasad = get(activeFasadAtom)
    if (!activeFasad) return
    const appData = get(appDataAtom)
    if (fixed && (activeFasad.Parent?.Division === Division.HEIGHT)) activeFasad.Parent.fixWidth(fixed);
    activeFasad.fixWidth(fixed)
    set(appDataAtom, { ...appData })
})

export const setExtMaterialAtom = atom(null, (get, set, extMaterial: string) => {
    const activeFasad = get(activeFasadAtom)
    if (!activeFasad) return
    const appData = get(appDataAtom)
    activeFasad.setExtMaterial(extMaterial)
    set(appDataAtom, { ...appData })
})
export const setMaterialAtom = atom(null, (get, set, material: FasadMaterial) => {
    const activeFasad = get(activeFasadAtom)
    if (!activeFasad) return
    const appData = get(appDataAtom)
    activeFasad.setMaterial(material)
    const matList = get(materialListAtom)
    activeFasad.setExtMaterial(matList.get(activeFasad.Material)[0]?.name)
    set(appDataAtom, { ...appData })
})

export const setSandBaseAtom = atom(null, (get, set, sandBase: SandBase) => {
    const activeFasad = get(activeFasadAtom)
    if (!activeFasad) return
    const appData = get(appDataAtom)
    activeFasad.setSandBase(sandBase)
    set(appDataAtom, { ...appData })
})

export const setProfileDirectionAtom = atom(null, (get, set, direction: string) => {
    const activeFasad = get(activeFasadAtom)
    if (!activeFasad) return
    const appData = get(appDataAtom)
    activeFasad.Division = getProfileDirection(direction)
    activeFasad.divideFasad(activeFasad.Children.length)
    set(appDataAtom, { ...appData })
})

