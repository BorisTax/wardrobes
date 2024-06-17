import { atom } from "jotai";
import { VerboseData } from "../types/wardrobe";
import { SpecificationItem } from "../types/specification";
import { specificationDataAtom } from "./specification";

// export function getRoute(item: SpecificationItem): string{
//     const routes = new Map()
//     routes.set(SpecificationItem.DSP, 'api/verbose/dsp')
//     routes.set(SpecificationItem.DVP, 'api/verbose/dvp')
//     routes.set(SpecificationItem.Planka, 'api/verbose/dvpplanka')
//     routes.set(SpecificationItem.Kromka2, 'api/verbose/edge2')
//     routes.set(SpecificationItem.Kromka05, 'api/verbose/edge05')
//     routes.set(SpecificationItem.Glue, 'api/verbose/glue')
//     routes.set(SpecificationItem.Leg, 'api/verbose/legs')
//     routes.set(SpecificationItem.Confirmat, 'api/verbose/confirmat')
//     routes.set(SpecificationItem.Minifix, 'api/verbose/minifix')
//     routes.set(SpecificationItem.Karton, 'api/verbose/karton')
//     routes.set(SpecificationItem.Nails, 'api/verbose/nails')
//     return routes.get(item)
// }

export const verboseDataAtom = atom<{ data: VerboseData, title: string }>({ data: [[]], title: "" })

// export const loadVerboseDataAtom = atom(null, async (get, set, data: WardrobeData, item: SpecificationItem) => {
//     const { token } = get(userAtom)
//     const formData = JSON.stringify({ [TableFields.DATA]: data, [TableFields.TOKEN]: token })
//     try {
//         const result = await fetchData(getRoute(item), "POST", formData)
//         const title = get(specificationDataAtom).find(s => s.name === item)?.caption || ""
//         await set(verboseDataAtom, { data: result.data as VerboseData, title })
//     } catch (e) { console.error(e) }
// })

export const setVerboseDataAtom = atom(null, (get, set, verbose: VerboseData, item: SpecificationItem) => {
    const spec = get(specificationDataAtom)
    const title = spec.find(s => s.name === item)?.caption || ""
    set(verboseDataAtom, { data: verbose, title })
})