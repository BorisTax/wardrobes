import { Getter, Setter, atom } from 'jotai';
import { AppState, HistoryState, InitialAppState, SetAtomComfirm } from "../types/app";
import { cloneAppState, createAppState, getFasadHeight, getFasadWidth, getInitialAppState, stringifyAppState } from "../functions/wardrobe";
import FasadState from "../classes/FasadState";
import { excludeFasadParent, getFasadState, trySetHeight, trySetWidth } from "../functions/fasades";
import { openFile, readFile, saveState } from '../functions/file';
import { calculateCombiSpecificationsAtom } from './specification';
import { FetchResult, fetchGetData } from '../functions/fetch';
import { settingsAtom } from './settings';
import { WARDROBE_TYPE } from '../types/wardrobe';
import { API_ROUTE, INITIAL_COMBISTATE_ROUTE, VERSION_ROUTE, WARDROBE_ROUTE } from '../types/routes';
import { profileAtom } from "./materials/profiles";
import { Profile } from '../types/materials';
import { ProfileType } from '../types/enums';
import { setActiveRootFasadAtom } from './fasades';

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
        const state = createAppState(wardWidth, wardHeight, fasadCount, profile, wardType, fasadType, materialId)
        set(combiAtom, { state, next: null, previous: null })
        set(setActiveRootFasadAtom, 0)
        set(calculateCombiSpecificationsAtom)
        set(loadedInitialCombiStateAtom, true)
    }
})
export const combiAtom = atom<HistoryState>({ state: getInitialAppState(), next: null, previous: null })
export const historyCombiAtom = atom((get: Getter) => { const data = get(combiAtom); return { next: data.next, previous: data.previous } })
export const combiStateJSONAtom = atom(get => {
    const state = get(combiAtom).state
    return {
        ...state,
        profile: { ...state.profile },
        rootFasades: state.rootFasades.map(f => excludeFasadParent(f))
    }
})
export const combiStateAtom = atom((get) => get(combiAtom).state, (get, set, state: AppState, useHistory: boolean, calculate = true) => {
    const app = get(combiAtom)
    localStorage.setItem('combiState', stringifyAppState(state))
    if (useHistory) set(combiAtom, { previous: app, state, next: null });
    else set(combiAtom, { ...app, state })
    if (get(loadedInitialCombiStateAtom) && calculate) set(calculateCombiSpecificationsAtom)
})
export const saveToStorageAtom = atom(null, (get) => {
    const state = get(combiStateJSONAtom)
    localStorage.setItem('combiState', JSON.stringify(state))
})
export const undoAtom = atom(null, (get: Getter, set: Setter) => {
    const app = get(combiAtom)
    if (!app.previous) return
    set(combiAtom, { next: app, state: app.previous.state, previous: app.previous.previous })
})
export const redoAtom = atom(null, (get: Getter, set: Setter) => {
    const app = get(combiAtom)
    if (!app.next) return
    set(combiAtom, { previous: app, state: app.next.state, next: app.next.next })
})
export const saveStateAtom = atom(null, (get: Getter) => {
    saveState(get(combiAtom).state)
})
export const openStateAtom = atom(null, async (get: Getter, set: Setter) => {
    const { result, file } = await openFile()
    if (result && file) {
        const { result, content } = await readFile(file)
        if (result && content) set(combiAtom, { state: content.state as AppState, next: null, previous: null })
    }
})
export const resetAppDataAtom = atom(null, (get: Getter, set: Setter) => {
    set(loadInitialCombiStateAtom)
})
export const setFasadCountAtom = atom(null, async (get, set, [newCount, confirmCallback]: SetAtomComfirm<number>) => {
    const state = get(combiStateAtom)
    const prevCount = state.rootFasades.length
    const { minSize } = get(settingsAtom)
    const fasadWidth = getFasadWidth(state.wardWidth, newCount, state.type, state.profile.type)
    const newState = cloneAppState(state)
    newState.fasadCount = newCount
    if (newCount > prevCount) {
        const sample = newState.rootFasades[0]
        for (let i = prevCount; i < newCount; i++) newState.rootFasades.push(getFasadState(fasadWidth, sample.height, sample.division, sample.fasadType, sample.materialId))
    } else newState.rootFasades = newState.rootFasades.filter((_, index) => index < newCount)
    const setWidth = newState.rootFasades.every((f: FasadState) => trySetWidth(f,  newState.rootFasades, fasadWidth, minSize))
    await setAppDataAtom(setWidth, newState, set, confirmCallback, true)
})

export const setProfileIdAtom = atom(null, async (get, set, [profileId, confirmCallback]: SetAtomComfirm<number>) => {
    const newAppData = cloneAppState(get(combiStateAtom))
    const profileList = get(profileAtom)
    const newProfile: Profile = { id: profileId, type: profileList.get(profileId)?.type || ProfileType.STANDART }
    const { wardWidth, wardHeight, fasadCount, profile, type, rootFasades } = newAppData
    if (profile.type === newProfile.type) {
        newAppData.profile = newProfile
        set(combiStateAtom, newAppData, true)
        return
    }
    const fasadWidth = getFasadWidth(wardWidth, fasadCount, type, newProfile.type)
    const fasadHeight = getFasadHeight(wardHeight, type, newProfile.type)
    newAppData.profile = newProfile
    const { minSize } = get(settingsAtom)
    const setWidth = rootFasades.every((f: FasadState) => trySetWidth(f, rootFasades, fasadWidth, minSize))
    const setHeight = rootFasades.every((f: FasadState) => trySetHeight(f, rootFasades, fasadHeight, minSize))
    await setAppDataAtom(setWidth && setHeight, newAppData, set, confirmCallback, true)
})

export const setWardWidthAtom = atom(null, async (get, set, [wardWidth, confirmCallback]: SetAtomComfirm<number>) => {
    const state = get(combiStateAtom)
    const { minSize } = get(settingsAtom)
    const fasadWidth = getFasadWidth(wardWidth, state.fasadCount, state.type, state.profile.type)
    const newAppData = cloneAppState(state)
    newAppData.wardWidth = wardWidth
    const setWidth = newAppData.rootFasades.every((f: FasadState) => trySetWidth(f, newAppData.rootFasades, fasadWidth, minSize))
    const res = await setAppDataAtom(setWidth, newAppData, set, confirmCallback, true)
    if (!res) return
    const fasadCount = newAppData.wardWidth < 2200 ? 2 : 3
    set(setFasadCountAtom, [fasadCount, async () => true])
})

export const setWardHeightAtom = atom(null, async (get, set, [wardHeight, confirmCallback]: SetAtomComfirm<number>) => {
    const state = get(combiStateAtom)
    const { minSize } = get(settingsAtom)
    const fasadHeight = getFasadHeight(wardHeight, state.type, state.profile.type)
    const newAppData = cloneAppState(state)
    newAppData.wardHeight = wardHeight
    const setHeight = newAppData.rootFasades.every((f: FasadState) => trySetHeight(f, newAppData.rootFasades, fasadHeight, minSize))
    await setAppDataAtom(setHeight, newAppData, set, confirmCallback, true)
})

export const setWardTypeAtom = atom(null, async (get, set, [wardType, confirmCallback]: SetAtomComfirm<WARDROBE_TYPE>) => {
    const state = get(combiStateAtom)
    const { minSize } = get(settingsAtom)
    const fasadWidth = getFasadWidth(state.wardWidth, state.fasadCount, wardType, state.profile.type)
    const fasadHeight = getFasadHeight(state.wardHeight, wardType, state.profile.type)
    const newAppData = cloneAppState(state)
    newAppData.type = wardType
    const setWidth = newAppData.rootFasades.every((f: FasadState) => trySetWidth(f, newAppData.rootFasades, fasadWidth, minSize))
    const setHeight = newAppData.rootFasades.every((f: FasadState) => trySetHeight(f, newAppData.rootFasades, fasadHeight, minSize))
    await setAppDataAtom(setWidth && setHeight, newAppData, set, confirmCallback, true)
})


async function setAppDataAtom(condition: boolean, newAppData: AppState, set: Setter, confirmCallback: () => Promise<boolean>, useHistory: boolean) {
    if (condition) {
        set(combiStateAtom, newAppData, useHistory)
        return true
    }
    const result = await confirmCallback()
    if (result) {
        set(combiStateAtom, newAppData, useHistory)
        return true
    }
    return false
}