import { atom } from "jotai"
import { CONSOLE_TYPE, DETAIL_NAME, Detail, ExtComplectData, FasadesData, WARDROBE_KIND, WARDROBE_TYPE, WardrobeData } from "../types/wardrobe"
import { FetchResult, fetchGetData } from "../functions/fetch"
import { userAtom } from "./users"
import { calculateSpecificationsAtom } from "./specification"

export const initFasades: FasadesData = {
    dsp: { count: 0, names: [] },
    mirror: { count: 0, names: [] },
    fmp: { count: 0, names: [] },
    sand: { count: 0, names: [] },
    lacobel: { count: 0, names: [] },
    lacobelGlass: { count: 0, names: [] }
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
    width: 2400,
    depth: 600,
    height: 2400,
    dspName: "",
    profileName: "",
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
    if (loaded && dataDiffers) set(calculateSpecificationsAtom, result)
})

export const loadedInitialWardrobeDataAtom = atom(false)
export const loadInitialWardrobeDataAtom = atom(null, async (get, set) => {
    const { token } = get(userAtom)
    set(loadedInitialWardrobeDataAtom, false)
    const result: FetchResult<WardrobeData> = await fetchGetData(`/api/wardrobe/initialWardrobeData?token=${token}`)
    const data = result.data as WardrobeData
    if (result.success) {
        set(setWardrobeDataAtom, () => data)
        set(loadedInitialWardrobeDataAtom, true)
    }
})

export const detailAtom = atom<Detail | null>(null)
export const loadDetailAtom = atom(null, async (get, set, detailName: DETAIL_NAME, kind: WARDROBE_KIND, width: number, height: number) => {
    const { token } = get(userAtom)
    const result = await fetchGetData(`/api/wardrobe/getDetail?token=${token}&kind=${kind}&detailName=${detailName}&width=${width}&height=${height}`)
    if (result.success) set(detailAtom, result.data as Detail)
})

const isDataDiffers = (prev: WardrobeData, current: WardrobeData): boolean => {
    return prev.depth !== current.depth || prev.height !== current.height || prev.width !== current.width || prev.wardType !== current.wardType ||
        prev.wardKind !== current.wardKind || prev.dspName !== current.dspName || prev.profileName !== current.profileName || fasadesDiffers(prev.fasades, current.fasades)
        || extComplectDiffers(prev.extComplect, current.extComplect)

}
const fasadesDiffers = (prev: FasadesData, current: FasadesData): boolean => {
    return prev.dsp.count !== current.dsp.count || prev.dsp.names.find((n, index) => n !== current.dsp.names[index]) !== undefined
        || prev.fmp.count !== current.fmp.count || prev.fmp.names.find((n, index) => n !== current.fmp.names[index]) !== undefined
        || prev.lacobel.count !== current.lacobel.count || prev.lacobel.names.find((n, index) => n !== current.lacobel.names[index]) !== undefined
        || prev.lacobelGlass.count !== current.lacobelGlass.count || prev.lacobelGlass.names.find((n, index) => n !== current.lacobelGlass.names[index]) !== undefined
        || prev.mirror.count !== current.mirror.count || prev.mirror.names.find((n, index) => n !== current.mirror.names[index]) !== undefined
        || prev.sand.count !== current.sand.count || prev.sand.names.find((n, index) => n !== current.sand.names[index]) !== undefined
}
const extComplectDiffers = (prev: ExtComplectData, current: ExtComplectData): boolean => {
    return prev.telescope !== current.telescope || prev.shelf !== current.shelf || prev.shelfPlat !== current.shelfPlat || prev.pillar !== current.pillar
        || prev.blinder !== current.blinder || prev.truba !== current.truba || prev.trempel !== current.trempel || prev.stand.count !== current.stand.count || prev.stand.height !== current.stand.height
        || prev.console.count !== current.console.count || prev.console.depth !== current.console.depth || prev.console.height !== current.console.height || prev.console.type !== current.console.type || prev.console.width !== current.console.width
        || prev.light !== current.light
}