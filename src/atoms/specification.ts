import { atom } from "jotai";
import { SpecItem } from "../types/specification";
import { CombiSpecificationResult, SpecificationMultiResult, SpecificationResult, WardrobeData } from "../types/wardrobe";
import { userAtom } from "./users";
import { FetchResult, fetchData } from "../functions/fetch";
import { TableFields } from "../types/server";
import { getInitSpecification } from "../functions/specification";
import { wardrobeDataAtom } from "./wardrobe";
import { appAtom } from "./app";
import { AppState } from "../types/app";
import { API_ROUTE } from "../types/routes";


export const specificationCombiAtom = atom<SpecificationResult[][]>([[]])
export const specificationAtom = atom<SpecificationMultiResult>(getInitSpecification())
export const specificationInProgress = atom(false)


export const coefListAtom = atom<Map<SpecItem, number>>((get) => {
    const coef = new Map()
    get(specificationAtom).forEach(p => { coef.set(p.spec[0], p.spec[1]) })
    return coef
})

export const calculateSpecificationsAtom = atom(null, async (get, set, resetDetails: boolean = false) => {
    const { token } = get(userAtom)
    const data = get(wardrobeDataAtom)
    const formData: { data: WardrobeData, resetDetails: boolean, token: string } = {
        [TableFields.DATA]: data,
        resetDetails,
        [TableFields.TOKEN]: token
    }
    set(specificationInProgress, true)
    try {
        const result: FetchResult<SpecificationMultiResult> = await fetchData(`${API_ROUTE}/specification/data`, "POST", JSON.stringify(formData))
        if (!result.success) set(specificationAtom, [...getInitSpecification()]); else
            set(specificationAtom, result.data as SpecificationMultiResult)
            set(specificationInProgress, false)
    } catch (e) { console.error(e) }
})

export const calculateCombiSpecificationsAtom = atom(null, async (get, set) => {
    const { token } = get(userAtom)
    const data = get(appAtom).state
    const formData: { data: AppState, token: string } = {
        [TableFields.DATA]: data,
        [TableFields.TOKEN]: token
    }
    set(specificationInProgress, true)
    try {
        const result: FetchResult<CombiSpecificationResult> = await fetchData(`${API_ROUTE}/specification/combidata`, "POST", JSON.stringify(formData))
        if (result.success && result.data) {
            set(specificationCombiAtom, result.data.specifications as SpecificationResult[][])
            set(totalPriceAtom, result.data.totalPrice)
            set(specificationInProgress, false)
        }
    } catch (e) { console.error(e) }
})


export const totalPriceAtom = atom<number[]>([])
export type OutputSpecSchema = { specCode: string; specName: string; charCode: string; charName: string; amount: number; units: string };
