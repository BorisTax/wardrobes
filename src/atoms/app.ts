import { Setter, atom } from "jotai";
import { AppData, SetAtomComfirm, WardType } from "../types/app";
import { getAppDataFromState, getAppState, getFasadHeight, getFasadWidth, getInitialAppState } from "../functions/wardrobe";
import { Profile } from "../types/materials";
import Fasad from "../classes/Fasad";
import { trySetHeight, trySetWidth } from "../functions/fasades";
import { activeRootFasadIndexAtom } from "./fasades";

export const appDataAtom = atom<AppData>(getAppDataFromState(getInitialAppState()))

export const setFasadCountAtom = atom(null, async (get, set, [newCount, confirmCallback]: SetAtomComfirm<number>) => {
    const { wardWidth, wardHeight, profile, type, rootFasades } = get(appDataAtom)
    const prevCount = rootFasades.length
    const newAppData = getAppDataFromState(getAppState(wardWidth, wardHeight, newCount, profile, type))
    const fasadWidth = getFasadWidth(wardWidth, newCount, type, profile.type)
    const newRootFasades = rootFasades.filter((_, index) => index < newCount).map((f: Fasad) => f.clone())
    newAppData.rootFasades = newRootFasades.map((f: Fasad) => { const r = f.clone(); r.Children = []; return r })
    if (newCount > prevCount) {
        for (let i = prevCount; i < newCount; i++) newRootFasades.push(newRootFasades[prevCount - 1].clone())
    }
    const setWidth = newRootFasades.every((f: Fasad) => trySetWidth(f, fasadWidth))
    if (await setAppData(setWidth, newAppData, newRootFasades, set, confirmCallback)) set(activeRootFasadIndexAtom, 0)
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
    const newAppData = getAppDataFromState(getAppState(wardWidth, wardHeight, fasadCount, newProfile, type))
    const newRootFasades = rootFasades.map((f: Fasad) => f.clone())
    newAppData.rootFasades = newRootFasades.map((f: Fasad) => { const r = f.clone(); r.Children = []; return r })
    const setWidth = newRootFasades.every((f: Fasad) => trySetWidth(f, fasadWidth))
    const setHeight = newRootFasades.every((f: Fasad) => trySetHeight(f, fasadHeight))
    await setAppData(setWidth && setHeight, newAppData, newRootFasades, set, confirmCallback)
})

export const setWardWidthAtom = atom(null, async (get, set, [wardWidth, confirmCallback]: SetAtomComfirm<number>) => {
    const { wardHeight, fasadCount, profile, type, rootFasades } = get(appDataAtom)
    const fasadWidth = getFasadWidth(wardWidth, fasadCount, type, profile.type)
    const newAppData = getAppDataFromState(getAppState(wardWidth, wardHeight, fasadCount, profile, type))
    const newRootFasades = rootFasades.map((f: Fasad) => f.clone())
    newAppData.rootFasades = newRootFasades.map((f: Fasad) => { const r = f.clone(); r.Children = []; return r })
    const setWidth = newRootFasades.every((f: Fasad) => trySetWidth(f, fasadWidth))
    await setAppData(setWidth, newAppData, newRootFasades, set, confirmCallback)
})

export const setWardHeightAtom = atom(null, async (get, set, [wardHeight, confirmCallback]: SetAtomComfirm<number>) => {
    const { wardWidth, fasadCount, profile, type, rootFasades } = get(appDataAtom)
    const fasadHeight = getFasadHeight(wardHeight, type, profile.type)
    const newAppData = getAppDataFromState(getAppState(wardWidth, wardHeight, fasadCount, profile, type))
    const newRootFasades = rootFasades.map((f: Fasad) => f.clone())
    newAppData.rootFasades = newRootFasades.map((f: Fasad) => { const r = f.clone(); r.Children = []; return r })
    const setHeight = newRootFasades.every((f: Fasad) => trySetHeight(f, fasadHeight))
    await setAppData(setHeight, newAppData, newRootFasades, set, confirmCallback)
})

export const setWardTypeAtom = atom(null, async (get, set, [wardType, confirmCallback]: SetAtomComfirm<WardType>) => {
    const { wardWidth, wardHeight, fasadCount, profile, rootFasades } = get(appDataAtom)
    const fasadWidth = getFasadWidth(wardWidth, fasadCount, wardType, profile.type)
    const fasadHeight = getFasadHeight(wardHeight, wardType, profile.type)
    const newAppData = getAppDataFromState(getAppState(wardWidth, wardHeight, fasadCount, profile, wardType))
    const newRootFasades = rootFasades.map((f: Fasad) => f.clone())
    newAppData.rootFasades = newRootFasades.map((f: Fasad) => { const r = f.clone(); r.Children = []; return r })
    const setWidth = newRootFasades.every((f: Fasad) => trySetWidth(f, fasadWidth))
    const setHeight = newRootFasades.every((f: Fasad) => trySetHeight(f, fasadHeight))
    await setAppData(setWidth && setHeight, newAppData, newRootFasades, set, confirmCallback)
})


async function setAppData(condition: boolean, newAppData: AppData, newRootFasades: Fasad[], set: Setter, confirmCallback: () => Promise<boolean>) {
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