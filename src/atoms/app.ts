import { Getter, Setter, atom } from 'jotai';
import { AppData, AppState, HistoryState, SetAtomComfirm, WardType } from "../types/app";
import { createAppState, getAppDataFromState, getAppState, getFasadHeight, getFasadWidth, getInitialAppState } from "../functions/wardrobe";
import { Profile } from "../types/materials";
import Fasad from "../classes/Fasad";
import { trySetHeight, trySetWidth } from "../functions/fasades";

const storage = localStorage.getItem('appState')
const initialAppState: AppState = storage ? JSON.parse(storage) : getInitialAppState()

const appAtom = atom<HistoryState>({ state: initialAppState, next: null, previous: null })
export const historyAppAtom = atom((get: Getter) => { const data = get(appAtom); return { next: data.next, previous: data.previous } })
export const appDataAtom = atom((get) => getAppDataFromState(get(appAtom).state), (get, set, appData: AppData, useHistory = true) => {
    const app = get(appAtom)
    const state = getAppState(appData)
    localStorage.setItem('appState', JSON.stringify(state))
    if (useHistory) set(appAtom, { previous: app, state, next: null });
    else set(appAtom, { ...app, state })
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

export const resetAppDataAtom = atom(null, (get: Getter, set: Setter) => {
    set(appAtom, { state: getInitialAppState(), next: null, previous: null })
})

export const setFasadCountAtom = atom(null, async (get, set, [newCount, confirmCallback]: SetAtomComfirm<number>) => {
    const { wardWidth, wardHeight, profile, type, rootFasades } = get(appDataAtom)
    const prevCount = rootFasades.length
    const newAppData = getAppDataFromState(createAppState(wardWidth, wardHeight, newCount, profile, type))
    const fasadWidth = getFasadWidth(wardWidth, newCount, type, profile.type)
    const newRootFasades = rootFasades.filter((_, index) => index < newCount).map((f: Fasad) => f.clone())
    newAppData.rootFasades = newRootFasades.map((f: Fasad) => { const r = f.clone(); r.Children = []; return r })
    if (newCount > prevCount) {
        for (let i = prevCount; i < newCount; i++) newRootFasades.push(newRootFasades[prevCount - 1].clone())
    }
    const setWidth = newRootFasades.every((f: Fasad) => trySetWidth(f, fasadWidth))
    await setAppDataAtom(setWidth, newAppData, newRootFasades, set, confirmCallback)
})

export const setProfileAtom = atom(null, async (get, set, [newProfile, confirmCallback]: SetAtomComfirm<Profile>) => {
    const appData = get(appDataAtom)
    const { wardWidth, wardHeight, fasadCount, profile, type, rootFasades } = appData
    if (profile.type === newProfile.type) {
        appData.profile = newProfile
        set(appDataAtom, { ...appData })
        return
    }
    const fasadWidth = getFasadWidth(wardWidth, fasadCount, type, newProfile.type)
    const fasadHeight = getFasadHeight(wardHeight, type, newProfile.type)
    const newAppData = getAppDataFromState(createAppState(wardWidth, wardHeight, fasadCount, newProfile, type))
    const newRootFasades = rootFasades.map((f: Fasad) => f.clone())
    newAppData.rootFasades = newRootFasades.map((f: Fasad) => { const r = f.clone(); r.Children = []; return r })
    const setWidth = newRootFasades.every((f: Fasad) => trySetWidth(f, fasadWidth))
    const setHeight = newRootFasades.every((f: Fasad) => trySetHeight(f, fasadHeight))
    await setAppDataAtom(setWidth && setHeight, newAppData, newRootFasades, set, confirmCallback)
})

export const setWardWidthAtom = atom(null, async (get, set, [wardWidth, confirmCallback]: SetAtomComfirm<number>) => {
    const { wardHeight, fasadCount, profile, type, rootFasades } = get(appDataAtom)
    const fasadWidth = getFasadWidth(wardWidth, fasadCount, type, profile.type)
    const newAppData = getAppDataFromState(createAppState(wardWidth, wardHeight, fasadCount, profile, type))
    const newRootFasades = rootFasades.map((f: Fasad) => f.clone())
    newAppData.rootFasades = newRootFasades.map((f: Fasad) => { const r = f.clone(); r.Children = []; return r })
    const setWidth = newRootFasades.every((f: Fasad) => trySetWidth(f, fasadWidth))
    await setAppDataAtom(setWidth, newAppData, newRootFasades, set, confirmCallback)
})

export const setWardHeightAtom = atom(null, async (get, set, [wardHeight, confirmCallback]: SetAtomComfirm<number>) => {
    const { wardWidth, fasadCount, profile, type, rootFasades } = get(appDataAtom)
    const fasadHeight = getFasadHeight(wardHeight, type, profile.type)
    const newAppData = getAppDataFromState(createAppState(wardWidth, wardHeight, fasadCount, profile, type))
    const newRootFasades = rootFasades.map((f: Fasad) => f.clone())
    newAppData.rootFasades = newRootFasades.map((f: Fasad) => { const r = f.clone(); r.Children = []; return r })
    const setHeight = newRootFasades.every((f: Fasad) => trySetHeight(f, fasadHeight))
    await setAppDataAtom(setHeight, newAppData, newRootFasades, set, confirmCallback)
})

export const setWardTypeAtom = atom(null, async (get, set, [wardType, confirmCallback]: SetAtomComfirm<WardType>) => {
    const { wardWidth, wardHeight, fasadCount, profile, rootFasades } = get(appDataAtom)
    const fasadWidth = getFasadWidth(wardWidth, fasadCount, wardType, profile.type)
    const fasadHeight = getFasadHeight(wardHeight, wardType, profile.type)
    const newAppData = getAppDataFromState(createAppState(wardWidth, wardHeight, fasadCount, profile, wardType))
    const newRootFasades = rootFasades.map((f: Fasad) => f.clone())
    newAppData.rootFasades = newRootFasades.map((f: Fasad) => { const r = f.clone(); r.Children = []; return r })
    const setWidth = newRootFasades.every((f: Fasad) => trySetWidth(f, fasadWidth))
    const setHeight = newRootFasades.every((f: Fasad) => trySetHeight(f, fasadHeight))
    await setAppDataAtom(setWidth && setHeight, newAppData, newRootFasades, set, confirmCallback)
})


async function setAppDataAtom(condition: boolean, newAppData: AppData, newRootFasades: Fasad[], set: Setter, confirmCallback: () => Promise<boolean>) {
    if (condition) {
        newAppData.rootFasades = newRootFasades
        set(appDataAtom, newAppData)
        return true
    }
    const result = await confirmCallback()
    if (result) {
        set(appDataAtom, newAppData)
        return true
    }
    return false
}