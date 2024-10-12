import { atom } from "jotai"
import { CONSOLE_TYPE, DETAIL_NAME, Detail, ExtComplectData, FasadesData, WARDROBE_KIND, WARDROBE_TYPE, WardrobeData } from "../types/wardrobe"
import { FetchResult, fetchGetData } from "../functions/fetch"
import { userAtom } from "./users"
import { calculateSpecificationsAtom } from "./specification"
import { WardrobeTableSchema } from "../types/schemas"

export const initFasades: FasadesData = {
    dsp: { count: 0, matId: [] },
    mirror: { count: 0, matId: [] },
    fmp: { count: 0, matId: [] },
    sand: { count: 0, matId: [] },
    lacobel: { count: 0, matId: [] },
    lacobelGlass: { count: 0, matId: [] }
}

export const getInitExtComplect = (height: number, depth: number) => ({
    telescope: 0,
    blinder: 0,
    console: { count: 0, height, depth, width: 0, type: CONSOLE_TYPE.STANDART },
    shelf: 0,
    shelfPlat: 0,
    stand: { count: 0, height: 0, },
    pillar: 0,
    truba: 0,
    trempel: 0,
    light: 0
})
const initState: WardrobeData = {
    wardKind: WARDROBE_KIND.STANDART,
    wardType: WARDROBE_TYPE.WARDROBE,
    schema: false,
    details: [],
    width: 2000,
    depth: 600,
    height: 2100,
    dspId: -1,
    profileId: -1,
    fasades: initFasades,
    extComplect: getInitExtComplect(2400, 600)
}
export type WardTypes = Map<WARDROBE_TYPE, string>
export type WardKinds = Map<WARDROBE_KIND, string> 
export type ConsoleTypes = Map<CONSOLE_TYPE, string> 

export const wardrobeDataAtom = atom<WardrobeData>(initState)
export const wardrobeKindsAtom = atom<WardKinds>(new Map())
export const wardrobeTypesAtom = atom<WardTypes>(new Map())
export const consoleTypesAtom = atom<ConsoleTypes>(new Map())

export const setWardrobeDataAtom = atom(null, (get, set, setter: (prev: WardrobeData) => WardrobeData) => {
    const loaded = get(loadedInitialWardrobeDataAtom)
    const prev = get(wardrobeDataAtom)
    const result = setter(prev)
    const dataDiffers = isDataDiffers(prev, result)
    set(wardrobeDataAtom, result)
    if (result.schema !== prev.schema) set(getDetailsAtom)
    const resetDetails = !result.schema 
    if (loaded && dataDiffers) set(calculateSpecificationsAtom, resetDetails)
})

export const loadedInitialWardrobeDataAtom = atom(false)
export const loadInitialWardrobeDataAtom = atom(null, async (get, set) => {
    const { token } = get(userAtom)
    set(loadedInitialWardrobeDataAtom, false)
    const fetchWardTypes: FetchResult<WardrobeTableSchema[]> = await fetchGetData(`/api/wardrobe/wardrobe_types?token=${token}`)
    if (fetchWardTypes.success) {
        const m = new Map()
        fetchWardTypes.data?.forEach(element => {
            m.set(element.name, element.caption)
        });
        set(wardrobeTypesAtom, m)
    }
    const fetchWardKinds: FetchResult<WardrobeTableSchema[]> = await fetchGetData(`/api/wardrobe/wardrobe_kinds?token=${token}`)
    if (fetchWardKinds.success) {
        const m = new Map()
        fetchWardKinds.data?.forEach(element => {
            m.set(element.name, element.caption)
        });
        set(wardrobeKindsAtom, m)
    }
    const fetchConsoleTypes: FetchResult<WardrobeTableSchema[]> = await fetchGetData(`/api/wardrobe/console_types?token=${token}`)
    if (fetchWardTypes.success) {
        const m = new Map()
        fetchConsoleTypes.data?.forEach(element => {
            m.set(element.name, element.caption)
        });
        set(consoleTypesAtom, m)
    }
    const result: FetchResult<WardrobeData> = await fetchGetData(`/api/wardrobe/initialWardrobeData?token=${token}`)
    const data = result.data as WardrobeData
    if (result.success) {
        set(loadedInitialWardrobeDataAtom, true)
        set(setWardrobeDataAtom, () => data)
    }
})

export const getDetailsAtom = atom(null, async (get, set) => {
    const { token } = get(userAtom)
    const {wardType, wardKind, width, height, depth } = get(wardrobeDataAtom)
    const result: FetchResult<Detail[]> = await fetchGetData(`/api/wardrobe/getDetails?token=${token}&wardType=${wardType}&kind=${wardKind}&width=${width}&height=${height}&depth=${depth}`)
    const data = result.data as Detail[]
    if (result.success) {
        set(setWardrobeDataAtom, (prev) => ({ ...prev, details: data }))
    }
})
export const detailAtom = atom<Detail | null>(null)
export const loadDetailAtom = atom(null, async (get, set, detailName: DETAIL_NAME, wardType:WARDROBE_TYPE,  kind: WARDROBE_KIND, width: number, height: number) => {
    const { token } = get(userAtom)
    const result = await fetchGetData(`/api/wardrobe/getDetail?token=${token}&wardType=${wardType}&kind=${kind}&detailName=${detailName}&width=${width}&height=${height}`)
    if (result.success) set(detailAtom, result.data as Detail)
})



const isDataDiffers = (prev: WardrobeData, current: WardrobeData): boolean => {
    return isDimensionsDiffers(prev, current) || (prev.schema !== current.schema) || prev.dspId !== current.dspId || prev.profileId !== current.profileId || fasadesDiffers(prev.fasades, current.fasades)
        || extComplectDiffers(prev.extComplect, current.extComplect)
}

const isDimensionsDiffers = (prev: WardrobeData, current: WardrobeData): boolean => {
    return prev.depth !== current.depth || prev.height !== current.height || prev.width !== current.width || prev.wardType !== current.wardType ||
        prev.wardKind !== current.wardKind
}
const fasadesDiffers = (prev: FasadesData, current: FasadesData): boolean => {
    return prev.dsp.count !== current.dsp.count || prev.dsp.matId.find((n, index) => n !== current.dsp.matId[index]) !== undefined
        || prev.fmp.count !== current.fmp.count || prev.fmp.matId.find((n, index) => n !== current.fmp.matId[index]) !== undefined
        || prev.lacobel.count !== current.lacobel.count || prev.lacobel.matId.find((n, index) => n !== current.lacobel.matId[index]) !== undefined
        || prev.lacobelGlass.count !== current.lacobelGlass.count || prev.lacobelGlass.matId.find((n, index) => n !== current.lacobelGlass.matId[index]) !== undefined
        || prev.mirror.count !== current.mirror.count || prev.mirror.matId.find((n, index) => n !== current.mirror.matId[index]) !== undefined
        || prev.sand.count !== current.sand.count || prev.sand.matId.find((n, index) => n !== current.sand.matId[index]) !== undefined
}
const extComplectDiffers = (prev: ExtComplectData, current: ExtComplectData): boolean => {
    return prev.telescope !== current.telescope || prev.shelf !== current.shelf || prev.shelfPlat !== current.shelfPlat || prev.pillar !== current.pillar
        || prev.blinder !== current.blinder || prev.truba !== current.truba || prev.trempel !== current.trempel || prev.stand.count !== current.stand.count || prev.stand.height !== current.stand.height
        || prev.console.count !== current.console.count || prev.console.depth !== current.console.depth || prev.console.height !== current.console.height || prev.console.type !== current.console.type || prev.console.width !== current.console.width
        || prev.light !== current.light
}