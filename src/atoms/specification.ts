import { Getter, Setter, atom } from "jotai";
import { SpecificationItem } from "../types/enums";
import { getTotalSpecification } from "../functions/specification";
import { appDataAtom } from "./app";
import Fasad from "../classes/Fasad";
import { priceListAtom } from "./prices";

export const specificationAtom = atom<Map<SpecificationItem, number>[]>([])

export const calculateSpecificationsAtom = atom(null, (get, set) => {
    const { rootFasades, profile } = get(appDataAtom)
    const spec = rootFasades.map((f: Fasad) => getTotalSpecification(f.getState(), profile.type))
    set(specificationAtom, spec)
})

export const totalPriceAtom = atom((get) => {
    const priceList = get(priceListAtom)
    const specifications = get(specificationAtom)
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