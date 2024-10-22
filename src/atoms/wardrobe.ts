import { atom } from "jotai"
import { CONSOLE_TYPE, DETAIL_NAME, Detail, ExtComplectData, FasadesData, WARDROBE_KIND, WARDROBE_TYPE, WardrobeData } from "../types/wardrobe"
import { FetchResult, fetchGetData } from "../functions/fetch"
import { userAtom } from "./users"
import { calculateSpecificationsAtom } from "./specification"
import { API_ROUTE, DETAIL_ROUTE, DETAILS_ROUTE, WARDROBE_ID_PARAM, WARDROBE_ROUTE, WARDTYPE_ID_PARAM } from "../types/routes"
import { loadedInitialWardrobeDataAtom } from "./storage"

export const initFasades: FasadesData = {
    dsp: { count: 0, matId: [] },
    mirror: { count: 0, matId: [] },
    fmp: { count: 0, matId: [] },
    sand: { count: 0, matId: [] },
    lacobel: { count: 0, matId: [] },
}

export const getInitExtComplect = (height: number, depth: number) => ({
    telescope: 0,
    blinder: 0,
    console: { count: 0, height, depth, width: 0, typeId: CONSOLE_TYPE.STANDART },
    shelf: 0,
    shelfPlat: 0,
    stand: { count: 0, height: 0, },
    pillar: 0,
    truba: 0,
    trempel: 0,
    light: 0
})
const initState: WardrobeData = {
    wardKindId: WARDROBE_KIND.STANDART,
    wardTypeId: WARDROBE_TYPE.WARDROBE,
    schema: false,
    details: [],
    width: 2000,
    depth: 600,
    height: 2100,
    dspId: 0,
    profileId: 0,
    fasades: initFasades,
    extComplect: getInitExtComplect(2400, 600)
}

export const wardrobeDataAtom = atom<WardrobeData>(initState)

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


export const getDetailsAtom = atom(null, async (get, set) => {
    const { token } = get(userAtom)
    const {wardTypeId: wardType, wardKindId: wardKind, width, height, depth } = get(wardrobeDataAtom)
    const result: FetchResult<Detail> = await fetchGetData(`${API_ROUTE}${WARDROBE_ROUTE}${DETAILS_ROUTE}?token=${token}&${WARDTYPE_ID_PARAM}=${wardType}&${WARDROBE_ID_PARAM}=${wardKind}&width=${width}&height=${height}&depth=${depth}`)
    const data = result.data as Detail[]
    if (result.success) {
        set(setWardrobeDataAtom, (prev) => ({ ...prev, details: data }))
    }
})
export const detailAtom = atom<Detail | null>(null) 
export const loadDetailAtom = atom(null, async (get, set, detailName: DETAIL_NAME, wardType:WARDROBE_TYPE,  kind: WARDROBE_KIND, width: number, height: number) => {
    const { token } = get(userAtom)
    const result = await fetchGetData(`${API_ROUTE}${WARDROBE_ROUTE}${DETAIL_ROUTE}?token=${token}&${WARDTYPE_ID_PARAM}=${wardType}&${WARDROBE_ID_PARAM}=${kind}&detailName=${detailName}&width=${width}&height=${height}`)
    if (result.success) set(detailAtom, result.data[0] as Detail)
})


const isDataDiffers = (prev: WardrobeData, current: WardrobeData): boolean => {
    return isDimensionsDiffers(prev, current) || (prev.schema !== current.schema) || prev.dspId !== current.dspId || prev.profileId !== current.profileId || fasadesDiffers(prev.fasades, current.fasades)
        || extComplectDiffers(prev.extComplect, current.extComplect)
}

const isDimensionsDiffers = (prev: WardrobeData, current: WardrobeData): boolean => {
    return prev.depth !== current.depth || prev.height !== current.height || prev.width !== current.width || prev.wardTypeId !== current.wardTypeId ||
        prev.wardKindId !== current.wardKindId
}
const fasadesDiffers = (prev: FasadesData, current: FasadesData): boolean => {
    return prev.dsp.count !== current.dsp.count || prev.dsp.matId.find((n, index) => n !== current.dsp.matId[index]) !== undefined
        || prev.fmp.count !== current.fmp.count || prev.fmp.matId.find((n, index) => n !== current.fmp.matId[index]) !== undefined
        || prev.lacobel.count !== current.lacobel.count || prev.lacobel.matId.find((n, index) => n !== current.lacobel.matId[index]) !== undefined
        || prev.mirror.count !== current.mirror.count || prev.mirror.matId.find((n, index) => n !== current.mirror.matId[index]) !== undefined
        || prev.sand.count !== current.sand.count || prev.sand.matId.find((n, index) => n !== current.sand.matId[index]) !== undefined
}
const extComplectDiffers = (prev: ExtComplectData, current: ExtComplectData): boolean => {
    return prev.telescope !== current.telescope || prev.shelf !== current.shelf || prev.shelfPlat !== current.shelfPlat || prev.pillar !== current.pillar
        || prev.blinder !== current.blinder || prev.truba !== current.truba || prev.trempel !== current.trempel || prev.stand.count !== current.stand.count || prev.stand.height !== current.stand.height
        || prev.console.count !== current.console.count || prev.console.depth !== current.console.depth || prev.console.height !== current.console.height || prev.console.typeId !== current.console.typeId || prev.console.width !== current.console.width
        || prev.light !== current.light
}