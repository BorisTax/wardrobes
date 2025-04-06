import { atom } from 'jotai'
import FasadState from '../classes/FasadState'
import { Division, FASAD_TYPE } from '../types/enums'
import { cloneFasad, DistributePartsOnHeight, DistributePartsOnWidth, divideFasad, fixFasadHeight, fixFasadWidth, getActiveFasad, getRootFasad, isFasadExist, setActiveFasad, setFasadMaterialId, setFasadType, trySetHeight, trySetWidth } from '../functions/fasades'
import { getProfileDirection } from '../functions/materials'
import { combiStateAtom } from './app'
import { AppState } from '../types/app'
import { settingsAtom } from './settings'
import { getFasadDefaultCharsAtom as getFasadDefaultChar } from './storage'
import { cloneAppState } from '../functions/wardrobe'

export const copyFasadAtom = atom(null, (get, set, dest: number, source: number) => {
    const appData = cloneAppState(get(combiStateAtom))
    appData.rootFasades[dest] = cloneFasad(appData.rootFasades[source])
    set(combiStateAtom, appData, true)
})

export const activeFasadAtom = atom<FasadState | undefined>((get) => {
    const appData: AppState = get(combiStateAtom)
    return getActiveFasad(appData.rootFasades)
})
export const setActiveFasadAtom = atom(null, (get, set, activeFasad?: FasadState) => {
    const appData = get(combiStateAtom)
    setActiveFasad( appData.rootFasades, activeFasad)
    set(combiStateAtom, { ...appData }, false, false)
})
export const setActiveRootFasadAtom = atom(null, (get, set, index: number) => {
    const appData = get(combiStateAtom)
    setActiveFasad( appData.rootFasades, appData.rootFasades[index])
    set(combiStateAtom, { ...appData }, false, false)
})
export const activeRootFasadIndexAtom = atom((get) => {
    const { rootFasades } = get(combiStateAtom)
    const active = getActiveFasad(rootFasades)
    if(!active) return -1
    const root = getRootFasad(active, rootFasades)
    return rootFasades.findIndex(r => r === root)
})

export const resetRootFasadAtom = atom(null, (get, set) => {
    const appData = get(combiStateAtom)
    const newAppState = cloneAppState(appData)
    const activeFasad = getActiveFasad(newAppState.rootFasades)
    if(!activeFasad) return
    const rootFasad = getRootFasad(activeFasad, newAppState.rootFasades)
    rootFasad.children = []
    setActiveFasad(newAppState.rootFasades, rootFasad)
    set(combiStateAtom, newAppState, true, true)
})
export const setHeightAtom = atom(null, (get, set, newHeight: number) => {
    const { minSize } = get(settingsAtom)
    const state = cloneAppState(get(combiStateAtom))
    const activeFasad = getActiveFasad(state.rootFasades)
    if(!activeFasad) return
    if (activeFasad && newHeight < 20) {
        activeFasad.heightRatio = newHeight
        const parent = activeFasad.parent
        if(parent) DistributePartsOnHeight(parent, null, 0, false, minSize)
            set(combiStateAtom, state, true)
        return
    }
    const height = activeFasad.fasadType === FASAD_TYPE.DSP ? newHeight : newHeight + 3
    if (trySetHeight(activeFasad, state.rootFasades, height, minSize)) {
        if(activeFasad) fixFasadHeight(activeFasad, true)
        set(combiStateAtom, state, true)
    }
})

export const setWidthAtom = atom(null, (get, set, newWidth: number) => {
    const state = cloneAppState(get(combiStateAtom))
    const activeFasad = getActiveFasad(state.rootFasades)
    if (!activeFasad) return
    const { minSize } = get(settingsAtom)
    if (activeFasad && newWidth < 20) {
        activeFasad.widthRatio = newWidth
        const parent = activeFasad.parent
        if(parent) DistributePartsOnWidth(parent, null, 0, false, minSize)
            set(combiStateAtom, state, true)
        return
    }
    const width = activeFasad.fasadType === FASAD_TYPE.DSP ? newWidth : newWidth + 3
    if (trySetWidth(activeFasad, state.rootFasades, width, minSize)) {
        if(activeFasad) fixFasadWidth(activeFasad, true)
        set(combiStateAtom, state, true)
    }
})
export const divideFasadAtom = atom(null, (get, set, count: number) => {
    let activeFasad = get(activeFasadAtom)
    const { minSize } = get(settingsAtom)
    if (!activeFasad) return
    const appData = cloneAppState(get(combiStateAtom))
    activeFasad = getActiveFasad(appData.rootFasades)
    if (!activeFasad) return
    const prevCount = activeFasad.children.length
    if (!divideFasad(activeFasad, count, minSize)) return
    setActiveFasad(appData.rootFasades, activeFasad)
    set(combiStateAtom, appData, true, !(prevCount === activeFasad.children.length && prevCount === 0))
})

export const setFixedHeightAtom = atom(null, (get, set, fixed: boolean) => {
    const { minSize } = get(settingsAtom)
    const appData = cloneAppState(get(combiStateAtom))
    const activeFasad = getActiveFasad(appData.rootFasades)
    if (!activeFasad) return
    fixFasadHeight(activeFasad, fixed)
    const parent = activeFasad.parent
    if (!fixed && parent)
        if (parent.division === Division.WIDTH) 
                DistributePartsOnWidth(parent, null, 0, false, minSize);
            else DistributePartsOnHeight(parent, null, 0, false, minSize);
    set(combiStateAtom, appData, true)
})

export const setFixedWidthAtom = atom(null, (get, set, fixed: boolean) => {
    const { minSize } = get(settingsAtom)
    const appData = cloneAppState(get(combiStateAtom))
    const activeFasad = getActiveFasad(appData.rootFasades)
    if (!activeFasad) return
    fixFasadWidth(activeFasad, fixed)
    const parent = activeFasad.parent
    if (!fixed && parent)
        if (parent.division === Division.WIDTH) 
                DistributePartsOnWidth(parent, null, 0, false, minSize);
            else DistributePartsOnHeight(parent, null, 0, false, minSize);
    set(combiStateAtom, appData, true)
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
    if (!activeFasad) return
    activeFasad.division = direction as Division
    const count = activeFasad?.children.length
    set(divideFasadAtom, count)
})

