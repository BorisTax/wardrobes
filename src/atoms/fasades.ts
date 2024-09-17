import { atom } from 'jotai'
import Fasad from '../classes/Fasad'
import { FasadMaterial } from '../types/enums'
import { getRootFasad, isFasadExist, trySetHeight, trySetWidth } from '../functions/fasades'
import { getProfileDirection } from '../functions/materials'
import { materialListAtom } from './materials/materials'
import { appDataAtom } from './app'
import { AppData } from '../types/app'
import { settingsAtom } from './settings'

export const copyFasadAtom = atom(null, (get, set, dest: number, source: number) => {
    const appData = get(appDataAtom)
    appData.rootFasades[dest].setState(appData.rootFasades[source].getState())
    set(appDataAtom, { ...appData }, true)
})

export const activeFasadAtom = atom<Fasad | null>((get) => {
    const appData: AppData = get(appDataAtom)
    let activeFasad: Fasad | null = null
    appData.rootFasades.forEach((f: Fasad) => {
        const active = f.getActiveFasad()
        if (active) activeFasad = active
    })
    return activeFasad
})
export const setActiveFasadAtom = atom(null, (get, set, activeFasad: Fasad | null) => {
    const appData = get(appDataAtom)
    if (activeFasad !== null && appData.rootFasades.every(f => !isFasadExist(f, activeFasad))) return
    appData.rootFasades.forEach((f: Fasad) => f.setActiveFasad(activeFasad))
    set(appDataAtom, { ...appData }, false, false)
})
export const activeRootFasadIndexAtom = atom((get) => {
    const { rootFasades } = get(appDataAtom)
    return rootFasades.findIndex(r => r.getActiveFasad() !== null)
})
export const setHeightAtom = atom(null, (get, set, newHeight: number) => {
    const activeFasad = get(activeFasadAtom)
    if (!activeFasad) return
    const { minSize } = get(settingsAtom)
    const appData = get(appDataAtom)
    const rootFasad = getRootFasad(activeFasad)
    const rootFasadIndex = appData.rootFasades.findIndex((f: Fasad) => f === rootFasad)
    const height = activeFasad.Material === FasadMaterial.DSP ? newHeight : newHeight + 3
    const newRootFasad = rootFasad.clone()
    const newActiveFasad = newRootFasad.getActiveFasad()
    if (trySetHeight(newActiveFasad, height, minSize)) {
        newActiveFasad?.fixHeight(true)
        appData.rootFasades[rootFasadIndex] = newRootFasad
        set(appDataAtom, { ...appData }, true)
    }
})

export const setWidthAtom = atom(null, (get, set, newWidth: number) => {
    const activeFasad = get(activeFasadAtom)
    if (!activeFasad) return
    const appData = get(appDataAtom)
    const { minSize } = get(settingsAtom)
    const rootFasad = getRootFasad(activeFasad)
    const rootFasadIndex = appData.rootFasades.findIndex((f: Fasad) => f === rootFasad)
    const width = activeFasad.Material === FasadMaterial.DSP ? newWidth : newWidth + 3
    const newRootFasad = rootFasad.clone()
    const newActiveFasad = newRootFasad.getActiveFasad()
    if (trySetWidth(newActiveFasad, width, minSize)) {
        newActiveFasad?.fixWidth(true)
        appData.rootFasades[rootFasadIndex] = newRootFasad
        set(appDataAtom, { ...appData }, true)
    }
})
export const divideFasadAtom = atom(null, (get, set, count: number) => {
    const activeFasad = get(activeFasadAtom)
    const { minSize } = get(settingsAtom)
    if (!activeFasad) return
    const appData = get(appDataAtom)
    activeFasad.divideFasad(count, minSize)
    set(appDataAtom, { ...appData }, true)
    set(setActiveFasadAtom, activeFasad)
})

export const setFixedHeightAtom = atom(null, (get, set, fixed: boolean) => {
    const activeFasad = get(activeFasadAtom)
    if (!activeFasad) return
    const appData = get(appDataAtom)
    //if (fixed && (activeFasad.Parent?.Division === Division.WIDTH)) activeFasad.Parent.fixHeight(fixed);
    activeFasad.fixHeight(fixed)
    set(appDataAtom, { ...appData }, true)
})
export const setFixedWidthAtom = atom(null, (get, set, fixed: boolean) => {
    const activeFasad = get(activeFasadAtom)
    if (!activeFasad) return
    const appData = get(appDataAtom)
    //if (fixed && (activeFasad.Parent?.Division === Division.HEIGHT)) activeFasad.Parent.fixWidth(fixed);
    activeFasad.fixWidth(fixed)
    set(appDataAtom, { ...appData }, true)
})

export const setExtMaterialAtom = atom(null, (get, set, extMaterial: string) => {
    const activeFasad = get(activeFasadAtom)
    if (!activeFasad) return
    const appData = get(appDataAtom)
    activeFasad.setExtMaterial(extMaterial)
    set(appDataAtom, { ...appData }, true)
})
export const setMaterialAtom = atom(null, (get, set, material: FasadMaterial, useHistory = true) => {
    const activeFasad = get(activeFasadAtom)
    if (!activeFasad) return
    const appData = get(appDataAtom)
    activeFasad.setMaterial(material)
    const matList = get(materialListAtom)
    const mat = matList.find(m => m.material === activeFasad.Material)?.name || ""
    activeFasad.setExtMaterial(mat)
    set(appDataAtom, { ...appData }, useHistory as boolean)
})


export const setProfileDirectionAtom = atom(null, (get, set, direction: string) => {
    const activeFasad = get(activeFasadAtom)
    const { minSize } = get(settingsAtom)
    if (!activeFasad) return
    const appData = get(appDataAtom)
    activeFasad.Division = getProfileDirection(direction)
    activeFasad.divideFasad(activeFasad.Children.length, minSize)
    set(appDataAtom, { ...appData }, true)
})

