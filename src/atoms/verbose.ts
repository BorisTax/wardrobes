import { atom } from "jotai";
import { fetchData } from "../functions/fetch";
import { userAtom } from "./users";
import { TableFields, VerboseData } from "../types/server";
import { WardrobeData } from "../types/wardrobe";
import { SpecificationItem } from "../types/specification";

export function getRoute(item: SpecificationItem): string{
    const routes = new Map()
    routes.set(SpecificationItem.DSP, 'api/verbose/dsp')
    routes.set(SpecificationItem.DVP, 'api/verbose/dvp')
    routes.set(SpecificationItem.Kromka2, 'api/verbose/edge2')
    routes.set(SpecificationItem.Kromka05, 'api/verbose/edge05')
    return routes.get(item)
}

export const verboseDataAtom = atom<VerboseData>([[]])

export const loadVerboseDataAtom = atom(null, async (get, set, data: WardrobeData, item: SpecificationItem) => {
    const { token } = get(userAtom)
    const formData = JSON.stringify({[TableFields.DATA]: data, [TableFields.TOKEN]: token})
    try {
        const result = await fetchData(getRoute(item), "POST", formData)
        await set(verboseDataAtom, result.data as VerboseData)
    } catch (e) { console.error(e) }
})
