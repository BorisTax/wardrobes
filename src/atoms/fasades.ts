import { atom } from 'jotai'
import FasadState from '../classes/FasadState'
import { Division, FASAD_TYPE } from '../types/enums'
import { cloneFasad, DistributePartsOnHeight, DistributePartsOnWidth, divideFasad, fixFasadHeight, fixFasadWidth, getActiveFasad, getFasadParent, getRootFasad, isFasadExist, setActiveFasad, setFasadMaterialId, setFasadType, setNewFasadesId, trySetHeight, trySetWidth } from '../functions/fasades'
import { getProfileDirection } from '../functions/materials'
import { combiStateAtom } from './app'
import { AppState } from '../types/app'
import { settingsAtom } from './settings'
import { getFasadDefaultCharsAtom as getFasadDefaultChar } from './storage'
import { cloneAppState } from '../functions/wardrobe'

export const copyFasadAtom = atom(null, (get, set, dest: number, source: number) => {
    const appData = cloneAppState(get(combiStateAtom))
    appData.rootFasades[dest] = cloneFasad(appData.rootFasades[source])
    setNewFasadesId(appData.rootFasades[dest])
    set(combiStateAtom, appData, true)
})

export const activeFasadAtom = atom<FasadState | undefined>((get) => {
    const appData: AppState = get(combiStateAtom)
    return getActiveFasad(appData.rootFasades)
})
export const setActiveFasadAtom = atom(null, (get, set, activeFasad?: FasadState) => {
    const appData = get(combiStateAtom)
    appData.rootFasades.forEach((f: FasadState) => setActiveFasad(f, activeFasad))
    set(combiStateAtom, { ...appData }, false, false)
})
export const setActiveFasadParentAtom = atom(null, (get, set, activeFasad: FasadState | undefined) => {
    const appData = get(combiStateAtom)
    const parent = getFasadParent(appData.rootFasades, activeFasad?.parentId)
    if (parent && appData.rootFasades.every(f => !isFasadExist(f, parent))) return
    appData.rootFasades.forEach((f: FasadState) => setActiveFasad(f, parent))
    set(combiStateAtom, { ...appData }, false, false)
})
export const activeRootFasadIndexAtom = atom((get) => {
    const { rootFasades } = get(combiStateAtom)
    const active = getActiveFasad(rootFasades)
    if(!active) return -1
    const root = getRootFasad(active, rootFasades)
    return rootFasades.findIndex(r => r === root)
})
export const setHeightAtom = atom(null, (get, set, newHeight: number) => {
    const { minSize } = get(settingsAtom)
    const state = cloneAppState(get(combiStateAtom))
    const activeFasad = getActiveFasad(state.rootFasades)
    if(!activeFasad) return
    const height = activeFasad.fasadType === FASAD_TYPE.DSP ? newHeight : newHeight + 3
    if (activeFasad && newHeight < 20) {
        activeFasad.heightRatio = newHeight
        const parent = getFasadParent(state.rootFasades, activeFasad.parentId)
        if(parent) DistributePartsOnHeight(parent, null, 0, false, minSize)
        set(combiStateAtom, state, true)
        return
    }
    if (trySetHeight(activeFasad, state.rootFasades, height, minSize)) {
        if(activeFasad) fixFasadHeight(activeFasad, true)
        set(combiStateAtom, state, true)
    }
})

export const setWidthAtom = atom(null, (get, set, newWidth: number) => {
    const state = cloneAppState(get(combiStateAtom))
    const activeFasad = getActiveFasad(state.rootFasades)
    if (!activeFasad) return
    const appData = get(combiStateAtom)
    const { minSize } = get(settingsAtom)
    const width = activeFasad.fasadType === FASAD_TYPE.DSP ? newWidth : newWidth + 3
    if (activeFasad && newWidth < 20) {
        activeFasad.widthRatio = newWidth
        const parent = getFasadParent(appData.rootFasades, activeFasad.parentId)
        if(parent) DistributePartsOnWidth(parent, null, 0, false, minSize)
        set(combiStateAtom, { ...appData }, true)
        return
    }
    if (trySetWidth(activeFasad, appData.rootFasades, width, minSize)) {
        if(activeFasad) fixFasadWidth(activeFasad, true)
        set(combiStateAtom, { ...appData }, true)
    }
})
export const divideFasadAtom = atom(null, (get, set, count: number) => {
    const activeFasad = get(activeFasadAtom)
    const { minSize } = get(settingsAtom)
    if (!activeFasad) return
    const appData = get(combiStateAtom)
    divideFasad(activeFasad, count, minSize)
    set(combiStateAtom, { ...appData }, true)
    set(setActiveFasadAtom, activeFasad)
})

export const setFixedHeightAtom = atom(null, (get, set, fixed: boolean) => {
    const activeFasad = get(activeFasadAtom)
    const { minSize } = get(settingsAtom)
    if (!activeFasad) return
    const appData = get(combiStateAtom)
    fixFasadHeight(activeFasad, fixed)
    const parent = getFasadParent(appData.rootFasades, activeFasad.parentId)
    if (!fixed && parent)
        if (parent.division === Division.WIDTH) 
                DistributePartsOnWidth(parent, null, 0, false, minSize);
            else DistributePartsOnHeight(parent, null, 0, false, minSize);
    set(combiStateAtom, { ...appData }, true)
})

export const setFixedWidthAtom = atom(null, (get, set, fixed: boolean) => {
    const activeFasad = get(activeFasadAtom)
    const { minSize } = get(settingsAtom)
    if (!activeFasad) return
    const appData = get(combiStateAtom)
    fixFasadWidth(activeFasad, fixed)
    const parent = getFasadParent(appData.rootFasades, activeFasad.parentId)
    if (!fixed && parent)
        if (parent.division === Division.WIDTH) 
                DistributePartsOnWidth(parent, null, 0, false, minSize);
            else DistributePartsOnHeight(parent, null, 0, false, minSize);
    set(combiStateAtom, { ...appData }, true)
})

export const setMaterialIdAtom = atom(null, (get, set, matId: number) => {
    const appData = cloneAppState(get(combiStateAtom))
    const activeFasad = getActiveFasad(appData.rootFasades)
    if (!activeFasad) return
    setFasadMaterialId(activeFasad, matId)
    set(combiStateAtom, { ...appData }, true)
})
export const setFasadTypeAtom = atom(null, (get, set, type: FASAD_TYPE, useHistory = true) => {
    const appData = cloneAppState(get(combiStateAtom))
    const activeFasad = getActiveFasad(appData.rootFasades)
    if (!activeFasad) return
    setFasadType(activeFasad, type)
    const matId = getFasadDefaultChar(get, type)
    setFasadMaterialId(activeFasad, matId)
    set(combiStateAtom, { ...appData }, useHistory as boolean)
})

export const setProfileDirectionAtom = atom(null, (get, set, direction: string) => {
    const activeFasad = get(activeFasadAtom)
    const { minSize } = get(settingsAtom)
    if (!activeFasad) return
    const appData = get(combiStateAtom)
    activeFasad.division = getProfileDirection(direction)
    divideFasad(activeFasad, activeFasad.children.length, minSize)
    set(combiStateAtom, { ...appData }, true)
})

