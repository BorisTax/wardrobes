import { atom } from 'jotai'
import FasadState from '../classes/FasadState'
import { Division, FASAD_TYPE } from '../types/enums'
import { cloneFasad, DistributePartsOnHeight, DistributePartsOnWidth, divideFasad, fixFasadHeight, fixFasadWidth, getActiveFasad, getRootFasad, hasSameParent, isFasadExist, setActiveFasad, setFasadMaterialId, setFasadType, trySetHeight, trySetWidth } from '../functions/fasades'
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

export const activeFasadAtom = atom<FasadState[]>((get) => {
    const appData: AppState = get(combiStateAtom)
    return getActiveFasad(appData.rootFasades)
})
export const setActiveFasadAtom = atom(null, (get, set, activeFasad: FasadState | undefined, multiple: boolean = false) => {
    const appData = get(combiStateAtom)
    setActiveFasad( appData.rootFasades, activeFasad, multiple)
    set(combiStateAtom, { ...appData }, false, false)
})
export const setActiveRootFasadAtom = atom(null, (get, set, index: number) => {
    const appData = get(combiStateAtom)
    setActiveFasad( appData.rootFasades, appData.rootFasades[index], false)
    set(combiStateAtom, { ...appData }, false, false)
})
export const activeRootFasadIndexAtom = atom((get) => {
    const { rootFasades } = get(combiStateAtom)
    const active = getActiveFasad(rootFasades)[0]
    if(!active) return -1
    const root = getRootFasad(active, rootFasades)
    return rootFasades.findIndex(r => r === root)
})

export const resetRootFasadAtom = atom(null, (get, set) => {
    const appData = get(combiStateAtom)
    const newAppState = cloneAppState(appData)
    const activeFasad = getActiveFasad(newAppState.rootFasades)[0]
    if(!activeFasad) return
    const rootFasad = getRootFasad(activeFasad, newAppState.rootFasades)
    rootFasad.children = []
    setActiveFasad(newAppState.rootFasades, rootFasad, false)
    set(combiStateAtom, newAppState, true, true)
})

export const setHeightAtom = atom(null, (get, set, newHeight: number) => {
    const { minSize } = get(settingsAtom)
    const state = cloneAppState(get(combiStateAtom))
    const activeFasades = getActiveFasad(state.rootFasades)
    if (activeFasades.length === 0) return
    //if(!hasSameParent(activeFasades)) return
    if (newHeight < 20) {
        if (activeFasades.every(activeFasad => {
            activeFasad.heightRatio = newHeight
            const parent = activeFasad.parent
            if (parent) {
                DistributePartsOnHeight(parent, null, 0, false, minSize)
                return true
            }
        })) {
            set(combiStateAtom, state, true)
        }
    } else {
        if (activeFasades.every(activeFasad => {
            if (trySetHeight(activeFasad, state.rootFasades, newHeight, minSize)) {
                if (activeFasad) fixFasadHeight(activeFasad, true)
                return true
            }
        })) {
            set(combiStateAtom, state, true)
        }
    }
})

export const setWidthAtom = atom(null, (get, set, newWidth: number) => {
    const { minSize } = get(settingsAtom)
    const state = cloneAppState(get(combiStateAtom))
    const activeFasades = getActiveFasad(state.rootFasades)
    if (activeFasades.length === 0) return
    //if(!hasSameParent(activeFasades)) return
    if (newWidth < 20) {
        if (activeFasades.every(activeFasad => {
            activeFasad.widthRatio = newWidth
            const parent = activeFasad.parent
            if (parent) {
                DistributePartsOnWidth(parent, null, 0, false, minSize)
                return true
            }
        })) {
            set(combiStateAtom, state, true)
        }
    } else {
        if (activeFasades.every(activeFasad => {
            if (trySetWidth(activeFasad, state.rootFasades, newWidth, minSize)) {
                if (activeFasad) fixFasadWidth(activeFasad, true)
                return true
            }
        })) {
            set(combiStateAtom, state, true)
        }
    }
})

export const divideFasadAtom = atom(null, (get, set, count: number) => {
    const { minSize } = get(settingsAtom)
    const appData = cloneAppState(get(combiStateAtom))
    const activeFasades = getActiveFasad(appData.rootFasades)
    if (activeFasades.length === 0) return
    let calculate = true
    if (activeFasades.every(activeFasad => {
        const prevCount = activeFasad.children.length
        calculate = calculate || !(prevCount === activeFasad.children.length && prevCount === 0)
        if (divideFasad(activeFasad, count, minSize)) return true
    })) {
        //setActiveFasad(appData.rootFasades, activeFasad, false)
        set(combiStateAtom, appData, true, calculate)
    }
})

export const setFixedHeightAtom = atom(null, (get, set, fixed: boolean) => {
    const { minSize } = get(settingsAtom)
    const appData = cloneAppState(get(combiStateAtom))
    const activeFasades = getActiveFasad(appData.rootFasades)
    if (activeFasades.length === 0) return
    if (activeFasades.every(activeFasad => {
        fixFasadHeight(activeFasad, fixed)
        const parent = activeFasad.parent
        if (!fixed && parent)
            if (parent.division === Division.WIDTH)
                DistributePartsOnWidth(parent, null, 0, false, minSize);
            else DistributePartsOnHeight(parent, null, 0, false, minSize);
        return true
    })) {
        set(combiStateAtom, appData, true)
    }
})

export const setFixedWidthAtom = atom(null, (get, set, fixed: boolean) => {
    const { minSize } = get(settingsAtom)
    const appData = cloneAppState(get(combiStateAtom))
    const activeFasades = getActiveFasad(appData.rootFasades)
    if (activeFasades.length === 0) return
    if (activeFasades.every(activeFasad => {
        fixFasadWidth(activeFasad, fixed)
        const parent = activeFasad.parent
        if (!fixed && parent)
            if (parent.division === Division.WIDTH)
                DistributePartsOnWidth(parent, null, 0, false, minSize);
            else DistributePartsOnHeight(parent, null, 0, false, minSize);
        return true
    })) {
        set(combiStateAtom, appData, true)
    }
})

export const setMaterialIdAtom = atom(null, (get, set, matId: number) => {
    const appData = cloneAppState(get(combiStateAtom))
    const activeFasades = getActiveFasad(appData.rootFasades)
    if (activeFasades.length === 0) return
    activeFasades.forEach(activeFasad => {
        setFasadMaterialId(activeFasad, matId)
    })
    set(combiStateAtom, { ...appData }, true)
})

export const setFasadTypeAtom = atom(null, (get, set, type: FASAD_TYPE, useHistory = true) => {
    const appData = cloneAppState(get(combiStateAtom))
    const activeFasades = getActiveFasad(appData.rootFasades)
    if (activeFasades.length === 0) return
    if (activeFasades.every(activeFasad => {
        setFasadType(activeFasad, type)
        const matId = getFasadDefaultChar(get, type)
        setFasadMaterialId(activeFasad, matId)
        return true
    })) {
        set(combiStateAtom, { ...appData }, useHistory as boolean)
    }
})

export const setProfileDirectionAtom = atom(null, (get, set, direction: string) => {
    const activeFasad = get(activeFasadAtom)[0]
    if (!activeFasad) return
    activeFasad.division = direction as Division
    const count = activeFasad?.children.length
    set(divideFasadAtom, count)
})

