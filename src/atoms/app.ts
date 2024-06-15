import { Getter, Setter, atom } from 'jotai';
import { AppData, AppState, HistoryState, SetAtomComfirm } from "../types/app";
import { createAppState, getAppDataFromState, getAppState, getFasadHeight, getFasadWidth, getInitialAppState } from "../functions/wardrobe";
import { Profile } from "../types/materials";
import Fasad from "../classes/Fasad";
import { trySetHeight, trySetWidth } from "../functions/fasades";
import { openFile, readFile, saveState } from '../functions/file';
import { materialListAtom, setInitialMaterials } from './materials/materials';
import { FasadMaterial } from '../types/enums';
import { calculateCombiSpecificationsAtom } from './specification';
import { FetchResult, fetchGetData } from '../functions/fetch';
import { settingsAtom } from './settings';
import { WARDROBE_TYPE } from '../types/wardrobe';

export const versionAtom = atom("")
export const loadVersionAtom = atom(null, async (get, set) => {
    const result: FetchResult<[] | string> = await fetchGetData(`api/version`)
    if (result.success) set(versionAtom, result.data as string)
})
export const appAtom = atom<HistoryState>({ state: getInitialAppState(), next: null, previous: null })
export const historyAppAtom = atom((get: Getter) => { const data = get(appAtom); return { next: data.next, previous: data.previous } })
export const appDataAtom = atom((get) => getAppDataFromState(get(appAtom).state), (get, set, appData: AppData, useHistory: boolean) => {
    const app = get(appAtom)
    const state = getAppState(appData)
    localStorage.setItem('appState', JSON.stringify(state))
    if (useHistory) set(appAtom, { previous: app, state, next: null });
    else set(appAtom, { ...app, state })
    set(calculateCombiSpecificationsAtom)
})
export const saveToStorageAtom = atom(null, (get, set) => {
    const app = get(appAtom)
    const state = app.state
    localStorage.setItem('appState', JSON.stringify(state))
})
export const undoAtom = atom(null, (get: Getter, set: Setter) => {
    const app = get(appAtom)
    if (!app.previous) return
    set(appAtom, { next: app, state: app.previous.state, previous: app.previous.previous })
})
export const redoAtom = atom(null, (get: Getter, set: Setter) => {
    const app = get(appAtom)
    if (!app.next) return
    set(appAtom, { previous: app, state: app.next.state, next: app.next.next })
})
export const saveStateAtom = atom(null, (get: Getter) => {
    saveState(get(appAtom).state)
})
export const openStateAtom = atom(null, async (get: Getter, set: Setter) => {
    const { result, file } = await openFile()
    if (result && file) {
        const { result, content } = await readFile(file)
        if (result && content) set(appAtom, { state: content.state as AppState, next: null, previous: null })
    }
})
export const resetAppDataAtom = atom(null, (get: Getter, set: Setter) => {
    set(appAtom, { state: getInitialAppState(), next: null, previous: null })
    const mList = get(materialListAtom)
    const material = mList[0].material
    const extMaterial = mList[0].name
    const { rootFasades } = get(appDataAtom)
    setInitialMaterials(rootFasades, material as FasadMaterial, extMaterial)
})
export const setFasadCountAtom = atom(null, async (get, set, [newCount, confirmCallback]: SetAtomComfirm<number>) => {
    const { order, wardWidth, wardHeight, profile, type, rootFasades } = get(appDataAtom)
    const prevCount = rootFasades.length
    const { minSize } = get(settingsAtom)
    const newAppData = getAppDataFromState(createAppState(order, wardWidth, wardHeight, newCount, profile, type))
    const fasadWidth = getFasadWidth(wardWidth, newCount, type, profile.type)
    const newRootFasades = rootFasades.filter((_, index) => index < newCount).map((f: Fasad) => f.clone())
    newAppData.rootFasades = newRootFasades.map((f: Fasad) => { const r = f.clone(); r.Children = []; return r })
    if (newCount > prevCount) {
        for (let i = prevCount; i < newCount; i++) newRootFasades.push(newRootFasades[prevCount - 1].clone())
    }
    const setWidth = newRootFasades.every((f: Fasad) => trySetWidth(f, fasadWidth, minSize))
    await setAppDataAtom(setWidth, newAppData, newRootFasades, set, confirmCallback, true)
})

export const setProfileAtom = atom(null, async (get, set, [newProfile, confirmCallback]: SetAtomComfirm<Profile>) => {
    const appData = get(appDataAtom)
    const { order, wardWidth, wardHeight, fasadCount, profile, type, rootFasades } = appData
    if (profile.type === newProfile.type) {
        appData.profile = newProfile
        set(appDataAtom, { ...appData }, true)
        return
    }
    const fasadWidth = getFasadWidth(wardWidth, fasadCount, type, newProfile.type)
    const fasadHeight = getFasadHeight(wardHeight, type, newProfile.type)
    const newAppData = getAppDataFromState(createAppState(order, wardWidth, wardHeight, fasadCount, newProfile, type))
    const newRootFasades = rootFasades.map((f: Fasad) => f.clone())
    const { minSize } = get(settingsAtom)
    newAppData.rootFasades = newRootFasades.map((f: Fasad) => { const r = f.clone(); r.Children = []; return r })
    const setWidth = newRootFasades.every((f: Fasad) => trySetWidth(f, fasadWidth, minSize))
    const setHeight = newRootFasades.every((f: Fasad) => trySetHeight(f, fasadHeight, minSize))
    await setAppDataAtom(setWidth && setHeight, newAppData, newRootFasades, set, confirmCallback, true)
})

export const setWardWidthAtom = atom(null, async (get, set, [wardWidth, confirmCallback]: SetAtomComfirm<number>) => {
    const { order, wardHeight, fasadCount, profile, type, rootFasades } = get(appDataAtom)
    const { minSize } = get(settingsAtom)
    const fasadWidth = getFasadWidth(wardWidth, fasadCount, type, profile.type)
    const newAppData = getAppDataFromState(createAppState(order, wardWidth, wardHeight, fasadCount, profile, type))
    const newRootFasades = rootFasades.map((f: Fasad) => f.clone())
    newAppData.rootFasades = newRootFasades.map((f: Fasad) => { const r = f.clone(); r.Children = []; return r })
    const setWidth = newRootFasades.every((f: Fasad) => trySetWidth(f, fasadWidth, minSize))
    await setAppDataAtom(setWidth, newAppData, newRootFasades, set, confirmCallback, true)
})

export const setWardHeightAtom = atom(null, async (get, set, [wardHeight, confirmCallback]: SetAtomComfirm<number>) => {
    const { order, wardWidth, fasadCount, profile, type, rootFasades } = get(appDataAtom)
    const { minSize } = get(settingsAtom)
    const fasadHeight = getFasadHeight(wardHeight, type, profile.type)
    const newAppData = getAppDataFromState(createAppState(order, wardWidth, wardHeight, fasadCount, profile, type))
    const newRootFasades = rootFasades.map((f: Fasad) => f.clone())
    newAppData.rootFasades = newRootFasades.map((f: Fasad) => { const r = f.clone(); r.Children = []; return r })
    const setHeight = newRootFasades.every((f: Fasad) => trySetHeight(f, fasadHeight, minSize))
    await setAppDataAtom(setHeight, newAppData, newRootFasades, set, confirmCallback, true)
})

export const setWardTypeAtom = atom(null, async (get, set, [wardType, confirmCallback]: SetAtomComfirm<WARDROBE_TYPE>) => {
    const { order, wardWidth, wardHeight, fasadCount, profile, rootFasades } = get(appDataAtom)
    const { minSize } = get(settingsAtom)
    const fasadWidth = getFasadWidth(wardWidth, fasadCount, wardType, profile.type)
    const fasadHeight = getFasadHeight(wardHeight, wardType, profile.type)
    const newAppData = getAppDataFromState(createAppState(order, wardWidth, wardHeight, fasadCount, profile, wardType))
    const newRootFasades = rootFasades.map((f: Fasad) => f.clone())
    newAppData.rootFasades = newRootFasades.map((f: Fasad) => { const r = f.clone(); r.Children = []; return r })
    const setWidth = newRootFasades.every((f: Fasad) => trySetWidth(f, fasadWidth, minSize))
    const setHeight = newRootFasades.every((f: Fasad) => trySetHeight(f, fasadHeight, minSize))
    await setAppDataAtom(setWidth && setHeight, newAppData, newRootFasades, set, confirmCallback, true)
})

export const setOrderAtom = atom(null, async (get, set, order: string) => {
    const appData = get(appDataAtom)
    appData.order = order
    set(appDataAtom, { ...appData }, false)
})

async function setAppDataAtom(condition: boolean, newAppData: AppData, newRootFasades: Fasad[], set: Setter, confirmCallback: () => Promise<boolean>, useHistory: boolean) {
    if (condition) {
        newAppData.rootFasades = newRootFasades
        set(appDataAtom, newAppData, useHistory)
        return true
    }
    const result = await confirmCallback()
    if (result) {
        set(appDataAtom, newAppData, useHistory)
        return true
    }
    return false
}