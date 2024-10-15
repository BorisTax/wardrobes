import { atom } from "jotai";
import { OmitId } from "../types/materials";
import { FetchResult, fetchGetData } from "../functions/fetch";
import { UserPermissions, RESOURCE } from "../types/user";
import { AllData, CharsSchema, DefaultSchema, FasadDefaultCharSchema, ProfileSchema, SpecSchema } from "../types/schemas";
import { API_ROUTE, MATERIALS_ROUTE, ALLDATA_ROUTE, WARDROBE_ROUTE, INITIAL_WARDROBEDATA_ROUTE } from "../types/routes";
import { WardrobeData } from "../types/wardrobe";
import { setWardrobeDataAtom } from "./wardrobe";
import { appDataAtom } from "./app";
import { setInitialMaterials } from "./materials/chars";

export type DefaultMap = Map<number, string> 
export type ExtMap<T> = Map<number, OmitId<T>>

export const fasadTypesAtom = atom<DefaultMap>(new Map())
export const charAtom = atom<ExtMap<CharsSchema>>(new Map())
export const charTypesAtom = atom<DefaultMap>(new Map())
export const wardrobeTypesAtom = atom<DefaultMap>(new Map())
export const wardrobeAtom = atom<DefaultMap>(new Map())
export const consoleTypesAtom = atom<DefaultMap>(new Map())
export const specAtom = atom<ExtMap<SpecSchema>>(new Map())
export const profileAtom = atom<ExtMap<ProfileSchema>>(new Map())
export const profileTypeAtom = atom<DefaultMap>(new Map())
export const unitsAtom = atom<DefaultMap>(new Map())
export const fasadDefaultCharsAtom = atom<ExtMap<FasadDefaultCharSchema>>(new Map())

export const loadedInitialWardrobeDataAtom = atom(false)

export const loadAllDataAtom = atom(null, async (get, set, token, permissions: Map<RESOURCE, UserPermissions>) => {
    set(loadedInitialWardrobeDataAtom, false)
    if(!permissions.get(RESOURCE.MATERIALS)?.Read) return { success: false, message: "" }
    try {
        let fetchData: FetchResult<AllData> = await fetchGetData(`${API_ROUTE}${MATERIALS_ROUTE}${ALLDATA_ROUTE}?token=${token}`)
        set(fasadTypesAtom, makeDefaultMap(fetchData.data?.fasad_types || []))
        set(charAtom, makeExtMap(fetchData.data?.chars || []))
        set(charTypesAtom, makeDefaultMap(fetchData.data?.charTypes || []))
        set(specAtom, makeExtMap(fetchData.data?.spec || []))
        set(profileAtom, makeExtMap(fetchData.data?.profiles || []))
        set(profileTypeAtom, makeDefaultMap(fetchData.data?.profileTypes || []))
        set(unitsAtom, makeDefaultMap(fetchData.data?.units || []))
        set(fasadDefaultCharsAtom, makeExtMap(fetchData.data?.fasadDefaultChars || []))

        set(wardrobeTypesAtom, makeDefaultMap(fetchData.data?.wardrobe_types || []))
        set(wardrobeAtom, makeDefaultMap(fetchData.data?.wardrobes || []))
        set(consoleTypesAtom, makeDefaultMap(fetchData.data?.console_types || []))
        const result: FetchResult<WardrobeData> = await fetchGetData(`${API_ROUTE}${WARDROBE_ROUTE}${INITIAL_WARDROBEDATA_ROUTE}?token=${token}`)
        const data = result.data as WardrobeData
        if (result.success) {
            set(loadedInitialWardrobeDataAtom, true)
            set(setWardrobeDataAtom, () => data)
        }
        const rootFasades = get(appDataAtom).rootFasades
        setInitialMaterials(rootFasades, fetchData.data?.fasadDefaultChars[0]?.id || 0, fetchData.data?.fasadDefaultChars[0]?.charId || 0)
    } catch (e) { console.error(e) }
})

const makeDefaultMap = (data: DefaultSchema[]): DefaultMap => {
    const m = new Map()
    data.forEach(r => m.set(r.id, r.name))
    return m
}

const makeExtMap = <T extends { id: number }>(data: T[]): ExtMap<T> => {
    const m: Map<number, OmitId<T>> = new Map()
    data.forEach((r: T) => {
        const keys = Object.keys(r).filter(k => k !== "id")
        const d: OmitId<T> = { ...r }
        m.set(r.id, d)
    })
    return m
}



