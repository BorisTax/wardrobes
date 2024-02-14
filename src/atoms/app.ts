import { atom } from "jotai";
import { AppData, WardType } from "../types/app";
import { getAppDataFromState, getAppState, getFasadHeight, getFasadWidth, getInitialAppState } from "../functions/wardrobe";
import { Profile } from "../types/materials";
import Fasad from "../classes/Fasad";
import { trySetHeight, trySetWidth } from "../functions/fasades";
import { activeRootFasadIndexAtom } from "./fasades";

export const appDataAtom = atom<AppData>(getAppDataFromState(getInitialAppState()))

export const setFasadCountAtom = atom(null, (get, set, newCount: number) => {
    const { wardWidth, wardHeight, profile, type, rootFasades } = get(appDataAtom)
    const newAppData = getAppDataFromState(getAppState(wardWidth, wardHeight, newCount, profile, type))
    set(appDataAtom, newAppData)
    set(activeRootFasadIndexAtom, 0)
})

export const setProfileAtom = atom(null, (get, set, profile: Profile) => {
    const { wardWidth, wardHeight, fasadCount, type, rootFasades } = get(appDataAtom)
    const fasadWidth = getFasadWidth(wardWidth, fasadCount, type, profile.type)
    const fasadHeight = getFasadHeight(wardHeight, type, profile.type)
    const newAppData = getAppDataFromState(getAppState(wardWidth, wardHeight, fasadCount, profile, type))
    const newRootFasades = rootFasades.map((f: Fasad) => f.clone())
    const setWidth = newRootFasades.every((f: Fasad) => trySetWidth(f, fasadWidth))
    const setHeight = newRootFasades.every((f: Fasad) => trySetHeight(f, fasadHeight))
    if(setWidth && setHeight) newAppData.rootFasades = newRootFasades
    set(appDataAtom, newAppData)
})

export const setWardWidthAtom = atom(null, (get, set, wardWidth: number) => {
    const { wardHeight, fasadCount, profile, type, rootFasades } = get(appDataAtom)
    const newAppData = getAppDataFromState(getAppState(wardWidth, wardHeight, fasadCount, profile, type))
    set(appDataAtom, newAppData)
})

export const setWardHeightAtom = atom(null, (get, set, wardHeight: number) => {
    const { wardWidth, fasadCount, profile, type, rootFasades } = get(appDataAtom)
    const newAppData = getAppDataFromState(getAppState(wardWidth, wardHeight, fasadCount, profile, type))
    set(appDataAtom, newAppData)
})

export const setWardTypeAtom = atom(null, (get, set, wardType: WardType) => {
    const { wardWidth, wardHeight, fasadCount, profile, rootFasades } = get(appDataAtom)
    const fasadWidth = getFasadWidth(wardWidth, fasadCount, wardType, profile.type)
    const fasadHeight = getFasadHeight(wardHeight, wardType, profile.type)
    const newAppData = getAppDataFromState(getAppState(wardWidth, wardHeight, fasadCount, profile, wardType))
    const newRootFasades = rootFasades.map((f: Fasad) => f.clone())
    const setWidth = newRootFasades.every((f: Fasad) => trySetWidth(f, fasadWidth))
    const setHeight = newRootFasades.every((f: Fasad) => trySetHeight(f, fasadHeight))
    if(setWidth && setHeight) newAppData.rootFasades = newRootFasades
    set(appDataAtom, newAppData)
})