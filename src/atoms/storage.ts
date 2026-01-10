import { atom, Getter } from "jotai";
import { OmitId } from "../types/materials";
import { FetchResult, fetchGetData } from "../functions/fetch";
import { UserPermissions, RESOURCE } from "../types/user";
import { AllData, DefaultSchema, WardrobesDimensionsSchema, WardrobesFasadCountSchema, WardrobesSchema } from "../types/schemas";
import { API_ROUTE, MATERIALS_ROUTE, ALLDATA_ROUTE, WARDROBE_ROUTE, INITIAL_WARDROBEDATA_ROUTE } from "../types/routes";
import { WardrobeData } from "../types/wardrobe";
import { setWardrobeDataAtom } from "./wardrobe";
import { combiStateAtom } from "./app";
import { charAtom, charPurposeAtom, charTypesAtom, fasadDefaultCharsAtom, fasadTypesToCharAtom, matPurposeAtom, setInitialMaterials } from "./materials/chars";
import { FASAD_TYPE } from "../types/enums";
import { setActiveFasadAtom } from "./fasades";
import { specListAtom, specToCharAtom } from "./specification";
import { profileAtom, profileTypeAtom } from "./materials/profiles";
import { themesAtom } from "./themes";

export type DefaultMap = Map<number, string> 
export type ExtMap<T> = Map<number, OmitId<T>>

export const fasadTypesAtom = atom<DefaultMap>(new Map())
export const wardrobeTypesAtom = atom<DefaultMap>(new Map())
export const wardrobeAtom = atom<DefaultMap>(new Map())
export const wardrobesDimensionsAtom = atom<WardrobesDimensionsSchema[]>([])
export const wardrobesFasadCountAtom = atom<WardrobesFasadCountSchema[]>([])
export const consoleTypesAtom = atom<DefaultMap>(new Map())
export const unitsAtom = atom<DefaultMap>(new Map())
export const detailNamesAtom = atom<DefaultMap>(new Map())
export const wardrobeUseAtom = atom<ExtMap<boolean>>(new Map())

export const getFasadDefaultCharsAtom = (get: Getter, fasadType: FASAD_TYPE) => {
    const defaultChars = get(fasadDefaultCharsAtom)
    return defaultChars.get(fasadType)?.charId || 0
}

export const loadedInitialWardrobeDataAtom = atom(false)

export const loadAllDataAtom = atom(null, async (get, set, permissions: Map<RESOURCE, UserPermissions>) => {
    set(loadedInitialWardrobeDataAtom, false)
    if(!permissions.get(RESOURCE.MATERIALS)?.Read) return { success: false, message: "" }
    try {
        let fetchData: FetchResult<AllData> = await (await fetchGetData(`${API_ROUTE}${MATERIALS_ROUTE}${ALLDATA_ROUTE}`))
        const allData = fetchData.data[0]
        set(fasadTypesAtom, makeDefaultMap(allData.fasadTypes || []))
        set(fasadTypesToCharAtom, allData.fasadTypeToChar || [])
        set(charAtom, makeExtMap(allData.chars || []))
        set(charPurposeAtom, allData.charPurpose || [])
        set(matPurposeAtom, makeDefaultMap(allData.matPurposes || []))
        set(charTypesAtom, makeDefaultMap(allData.charTypes || []))
        set(specListAtom, makeExtMap(allData.spec || []))
        set(specToCharAtom, allData.specToChar || [])
        set(profileAtom, makeExtMap(allData.profiles || []))
        set(profileTypeAtom, makeDefaultMap(allData.profileTypes || []))
        set(unitsAtom, makeDefaultMap(allData.units || []))
        set(fasadDefaultCharsAtom, makeExtMap(allData.fasadDefaultChars || []))
        set(detailNamesAtom, makeDefaultMap(allData.detailNames || []))

        set(wardrobeTypesAtom, makeDefaultMap(allData.wardrobeTypes || []))
        set(wardrobeAtom, makeDefaultMap(allData.wardrobes || []))
        set(wardrobeUseAtom, makeWardrobeUseMap(allData.wardrobes || []))
        set(wardrobesFasadCountAtom, allData.wardrobesFasadCount || [])
        set(wardrobesDimensionsAtom, allData.wardrobesDimensions || [])
        set(consoleTypesAtom, makeDefaultMap(allData.consoleTypes || []))

        set(themesAtom, allData.settings.themes.map(d => ({ ...d, in_use: !!d.in_use })))
        const result: FetchResult<WardrobeData> = await fetchGetData(`${API_ROUTE}${WARDROBE_ROUTE}${INITIAL_WARDROBEDATA_ROUTE}`)
        const wardData = result.data[0] as WardrobeData
        if (result.success) {
            set(loadedInitialWardrobeDataAtom, true)
            set(setWardrobeDataAtom, () => wardData)
        }
        const rootFasades = get(combiStateAtom).rootFasades
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

export const makeWardrobeUseMap = (data: WardrobesSchema[]): ExtMap<boolean> => {
    const m = new Map()
    data.forEach(r => m.set(r.id, r.use))
    return m
}


