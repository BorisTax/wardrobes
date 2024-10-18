import { atom, Getter } from "jotai";
import { OmitId } from "../types/materials";
import { FetchResult, fetchGetData } from "../functions/fetch";
import { UserPermissions, RESOURCE } from "../types/user";
import { AllData, CharsSchema, DefaultSchema, FasadDefaultCharSchema, FasadTypeToCharSchema, ProfileSchema, SpecSchema, SpecToCharSchema } from "../types/schemas";
import { API_ROUTE, MATERIALS_ROUTE, ALLDATA_ROUTE, WARDROBE_ROUTE, INITIAL_WARDROBEDATA_ROUTE } from "../types/routes";
import { WardrobeData } from "../types/wardrobe";
import { setWardrobeDataAtom } from "./wardrobe";
import { appDataAtom } from "./app";
import { setInitialMaterials } from "./materials/chars";
import { FASAD_TYPE } from "../types/enums";
import { setActiveFasadAtom } from "./fasades";

export type DefaultMap = Map<number, string> 
export type ExtMap<T> = Map<number, OmitId<T>>

export const fasadTypesAtom = atom<DefaultMap>(new Map())
export const fasadTypesToCharAtom = atom<FasadTypeToCharSchema[]>([])
export const charAtom = atom<ExtMap<CharsSchema>>(new Map())
export const charTypesAtom = atom<DefaultMap>(new Map())
export const wardrobeTypesAtom = atom<DefaultMap>(new Map())
export const wardrobeAtom = atom<DefaultMap>(new Map())
export const consoleTypesAtom = atom<DefaultMap>(new Map())
export const specAtom = atom<ExtMap<SpecSchema>>(new Map())
export const specToCharAtom = atom<SpecToCharSchema[]>([])
export const profileAtom = atom<ExtMap<ProfileSchema>>(new Map())
export const profileTypeAtom = atom<DefaultMap>(new Map())
export const unitsAtom = atom<DefaultMap>(new Map())
export const fasadDefaultCharsAtom = atom<ExtMap<FasadDefaultCharSchema>>(new Map())

export const getFasadDefaultCharsAtom = (get: Getter, fasadType: FASAD_TYPE) => {
    const defaultChars = get(fasadDefaultCharsAtom)
    return defaultChars.get(fasadType)?.charId || 0
}

export const loadedInitialWardrobeDataAtom = atom(false)

export const loadAllDataAtom = atom(null, async (get, set, token, permissions: Map<RESOURCE, UserPermissions>) => {
    set(loadedInitialWardrobeDataAtom, false)
    if(!permissions.get(RESOURCE.MATERIALS)?.Read) return { success: false, message: "" }
    try {
        let fetchData: FetchResult<AllData> = await (await fetchGetData(`${API_ROUTE}${MATERIALS_ROUTE}${ALLDATA_ROUTE}?token=${token}`))
        const allData = fetchData.data[0]
        set(fasadTypesAtom, makeDefaultMap(allData.fasadTypes || []))
        set(fasadTypesToCharAtom, allData.fasadTypeToChar || [])
        set(charAtom, makeExtMap(allData.chars || []))
        set(charTypesAtom, makeDefaultMap(allData.charTypes || []))
        set(specAtom, makeExtMap(allData.spec || []))
        set(specToCharAtom, allData.specToChar || [])
        set(profileAtom, makeExtMap(allData.profiles || []))
        set(profileTypeAtom, makeDefaultMap(allData.profileTypes || []))
        set(unitsAtom, makeDefaultMap(allData.units || []))
        set(fasadDefaultCharsAtom, makeExtMap(allData.fasadDefaultChars || []))

        set(wardrobeTypesAtom, makeDefaultMap(allData.wardrobeTypes || []))
        set(wardrobeAtom, makeDefaultMap(allData.wardrobes || []))
        set(consoleTypesAtom, makeDefaultMap(allData.consoleTypes || []))
        const result: FetchResult<WardrobeData> = await fetchGetData(`${API_ROUTE}${WARDROBE_ROUTE}${INITIAL_WARDROBEDATA_ROUTE}?token=${token}`)
        const wardData = result.data[0] as WardrobeData
        if (result.success) {
            set(loadedInitialWardrobeDataAtom, true)
            set(setWardrobeDataAtom, () => wardData)
        }
        const rootFasades = get(appDataAtom).rootFasades
        setInitialMaterials(rootFasades, allData.fasadDefaultChars[0]?.id || 0, allData.fasadDefaultChars[0]?.charId || 0)
        set(setActiveFasadAtom, rootFasades[0])
    } catch (e) { console.error(e) }
})

export const makeDefaultMap = (data: DefaultSchema[]): DefaultMap => {
    const m = new Map()
    data.forEach(r => m.set(r.id, r.name))
    return m
}

export const makeExtMap = <T extends { id: number }>(data: T[]): ExtMap<T> => {
    const m: Map<number, OmitId<T>> = new Map()
    data.forEach((r: T) => {
        const keys = Object.keys(r).filter(k => k !== "id")
        const d: OmitId<T> = { ...r }
        m.set(r.id, d)
    })
    return m
}



