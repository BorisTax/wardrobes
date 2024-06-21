import { atom } from "jotai"
import { CONSOLE_TYPE, WARDROBE_KIND, WARDROBE_TYPE, WardrobeData } from "../types/wardrobe"
import { FetchResult, fetchGetData } from "../functions/fetch"
import { userAtom } from "./users"

export const initFasades = {
    dsp: { count: 0, names: [] },
    mirror: { count: 0, names: [] },
    fmp: { count: 0, names: [] },
    sand: { count: 0, names: [] },
    lacobel: { count: 0, names: [] },
    lacobelGlass: { count: 0, names: [] }
}

const initState: WardrobeData = {
    wardKind: WARDROBE_KIND.STANDART,
    wardType: WARDROBE_TYPE.WARDROBE,
    width: 2400,
    depth: 600,
    height: 2400,
    dspName: "",
    profileName: "",
    fasades: initFasades,
    extComplect: {
        telescope: 0,
        blinder: 0,
        console: { count: 0, height: 0, depth: 0, width: 0, type: CONSOLE_TYPE.STANDART },
        shelf: 0,
        shelfPlat: 0,
        stand: { count: 0, height: 0, },
        pillar: 0,
        truba: 0,
        trempel: 0,
        light: 0
    }
}

export const wardrobeDataAtom = atom<WardrobeData>(initState)

export const setWardrobeDataAtom = atom(null, (get, set, setter: (prev: WardrobeData) => WardrobeData) => {
    const prev = get(wardrobeDataAtom)
    const result = setter(prev)
    set(wardrobeDataAtom, result)
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