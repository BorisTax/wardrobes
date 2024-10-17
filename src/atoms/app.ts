import { Getter, Setter, atom } from 'jotai';
import { AppData, AppState, HistoryState, InitialAppState, SetAtomComfirm } from "../types/app";
import { createAppState, getAppDataFromState, getAppState, getFasadHeight, getFasadWidth, getInitialAppState } from "../functions/wardrobe";
import Fasad from "../classes/Fasad";
import { trySetHeight, trySetWidth } from "../functions/fasades";
import { openFile, readFile, saveState } from '../functions/file';
import { calculateCombiSpecificationsAtom } from './specification';
import { FetchResult, fetchGetData } from '../functions/fetch';
import { settingsAtom } from './settings';
import { WARDROBE_TYPE } from '../types/wardrobe';
import { API_ROUTE, INITIAL_COMBISTATE_ROUTE, VERSION_ROUTE, WARDROBE_ROUTE } from '../types/routes';
import { ProfileSchema } from '../types/schemas';
import { profileAtom } from './storage';
import { Profile } from '../types/materials';
import { ProfileType } from '../types/enums';

export const versionAtom = atom("")
export const loadVersionAtom = atom(null, async (get, set) => {
    const result: FetchResult<string> = await fetchGetData(`${API_ROUTE}${VERSION_ROUTE}`)
    if (result.success) set(versionAtom, result.data[0] as string)
})


export const loadedInitialCombiStateAtom = atom(false)
export const loadInitialCombiStateAtom = atom(null, async (get, set) => {
    set(loadedInitialCombiStateAtom, false)
    const result: FetchResult<InitialAppState> = await fetchGetData(`${API_ROUTE}${WARDROBE_ROUTE}${INITIAL_COMBISTATE_ROUTE}`) 
    if (result.success){
        const { wardWidth, wardHeight, fasadCount, profile, wardType, fasadType, materialId } = result.data[0] as InitialAppState
        const state = createAppState("", wardWidth, wardHeight, fasadCount, profile, wardType, fasadType, materialId)
        set(appAtom, { state, next: null, previous: null })
        set(calculateCombiSpecificationsAtom)
        set(loadedInitialCombiStateAtom, true)
    }
})
export const appAtom = atom<HistoryState>({ state: getInitialAppState(), next: null, previous: null })
export const historyAppAtom = atom((get: Getter) => { const data = get(appAtom); return { next: data.next, previous: data.previous } })
export const appDataAtom = atom((get) => getAppDataFromState(get(appAtom).state), (get, set, appData: AppData, useHistory: boolean, calculate = true) => {
    const app = get(appAtom)
    const state = getAppState(appData)
    localStorage.setItem('appState', JSON.stringify(state))
    if (useHistory) set(appAtom, { previous: app, state, next: null });
    else set(appAtom, { ...app, state })
    if (get(loadedInitialCombiStateAtom) && calculate) set(calculateCombiSpecificationsAtom)
})
export const saveToStorageAtom = atom(null, (get) => {
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
    set(loadInitialCombiStateAtom)
    // set(appAtom, { state: getInitialAppState(), next: null, previous: null })
    // const mList = get(materialListAtom)
    // const fasadType = mList[0].type
    // const materialId = mList[0].id
    // const { rootFasades } = get(appDataAtom)
    // setInitialMaterials(rootFasades, fasadType, materialId)
})
export const setFasadCountAtom = atom(null, async (get, set, [newCount, confirmCallback]: SetAtomComfirm<number>) => {
    const { order, wardWidth, wardHeight, profile, type, rootFasades } = get(appDataAtom)
    const prevCount = rootFasades.length
    const { minSize } = get(settingsAtom)
    const newAppData = getAppDataFromState(createAppState(order, wardWidth, wardHeight, newCount, profile, type), true)
    const fasadWidth = getFasadWidth(wardWidth, newCount, type, profile.type)
    const newRootFasades = rootFasades.filter((_, index) => index < newCount).map((f: Fasad) => f.clone())
    newAppData.rootFasades = newRootFasades.map((f: Fasad) => { const r = f.clone(); r.Children = []; return r })
    if (newCount > prevCount) {
        for (let i = prevCount; i < newCount; i++) newRootFasades.push(newRootFasades[prevCount - 1].clone())
    }
    const setWidth = newRootFasades.every((f: Fasad) => trySetWidth(f, fasadWidth, minSize))
    await setAppDataAtom(setWidth, newAppData, newRootFasades, set, confirmCallback, true)
})

export const setProfileIdAtom = atom(null, async (get, set, [profileId, confirmCallback]: SetAtomComfirm<number>) => {
    const appData = get(appDataAtom)
    const profileList = get(profileAtom)
    const newProfile: Profile = { id: profileId, type: profileList.get(profileId)?.type || ProfileType.STANDART }
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