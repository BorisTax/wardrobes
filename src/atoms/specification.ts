import { atom } from "jotai";
import { SpecificationItem } from "../types/specification";
import { getFasadSpecification } from "../functions/specification";
import { appDataAtom } from "./app";
import Fasad from "../classes/Fasad";
import { coefListAtom, priceListAtom } from "./prices";
import { SpecificationResult, WardrobeData } from "../types/wardrobe";
import { userAtom } from "./users";
import { FetchResult, fetchData } from "../functions/fetch";
import { TableFields } from "../types/server";
import { getInitSpecification } from "../functions/specification";

export const specificationCombiAtom = atom<Map<SpecificationItem, number>[]>([])
export const specificationAtom = atom<SpecificationResult>(getInitSpecification())
export const specificationInProgress = atom(false)

export const calculateSpecificationsAtom = atom(null, async (get, set, data: WardrobeData) => {
    const fasadCount = Object.values(data.fasades).reduce((a, f) => f.count + a, 0)
    if (fasadCount === 1 || fasadCount > 6) return
    const { token } = get(userAtom)
    const formData: any = {}
    formData[TableFields.DATA] = data
    formData[TableFields.TOKEN] = token
    set(specificationInProgress, true)
    try {
        const result: FetchResult<SpecificationResult> = await fetchData('api/specification', "POST", JSON.stringify(formData))
        if (!result.success) set(specificationAtom, [...getInitSpecification()]); else
            set(specificationAtom, result.data as SpecificationResult)
            set(specificationInProgress, false)
    } catch (e) { console.error(e) }
})

export const calculateCombiSpecificationsAtom = atom(null, (get, set) => {
    const { rootFasades, profile } = get(appDataAtom)
    const coefList = get(coefListAtom)
    const spec = rootFasades.map((f: Fasad) => getFasadSpecification(f, profile.type, coefList))
    set(specificationCombiAtom, spec)
})

export const totalPriceAtom = atom((get) => {
    const priceList = get(priceListAtom)
    const specifications = get(specificationCombiAtom)
    const totalPrice = specifications.map(s => {
        let sum: number = 0
        priceList.forEach(p => {
            const item = s.get(p.name as SpecificationItem) || 0
            sum = sum + item * (p.price || 0) * (p.markup || 1)
        })
        return sum
    })
    return totalPrice
})