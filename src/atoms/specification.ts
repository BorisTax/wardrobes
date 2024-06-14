import { atom } from "jotai";
import { SpecificationItem } from "../types/specification";
import { getFasadSpecification } from "../functions/specification";
import { appDataAtom } from "./app";
import Fasad from "../classes/Fasad";
import { priceListAtom } from "./prices";
import { SpecificationResult, WardrobeData } from "../types/wardrobe";
import { userAtom } from "./users";
import { FetchResult, fetchData, fetchGetData } from "../functions/fetch";
import { SpecificationData, TableFields } from "../types/server";
import { getInitSpecification } from "../functions/specification";
import { AtomCallbackResult } from "../types/atoms";
import { wardrobeDataAtom } from "./wardrobe";


export const specificationDataAtom = atom<SpecificationData[]>([])
export const specificationCombiAtom = atom<Map<SpecificationItem, number>[]>([])
export const specificationAtom = atom<SpecificationResult>(getInitSpecification())
export const specificationInProgress = atom(false)

export const loadSpecificationListAtom = atom(null, async (get, set) => {
    const { token } = get(userAtom)
    try {
        const result: FetchResult<[] | string> = await fetchGetData('api/specification?token=' + token)
        if (!result.success) set(specificationDataAtom, []); else
            set(specificationDataAtom, result.data as SpecificationData[])
    } catch (e) { console.error(e) }
})

export const updateSpecificationListAtom = atom(null, async (get, set, { name, caption, code, coef, id, purpose }: SpecificationData, callback: AtomCallbackResult) => {
    const user = get(userAtom)
    const formData: any = {}
    formData[TableFields.NAME] = name
    if (caption !== undefined) formData[TableFields.CAPTION] = caption
    if (coef !== undefined) formData[TableFields.COEF] = coef
    if (code !== undefined) formData[TableFields.CODE] = code
    if (purpose !== undefined) formData[TableFields.PURPOSE] = purpose
    if (id !== undefined) formData[TableFields.ID] = id
    formData[TableFields.TOKEN] = user.token
    try {
        const result = await fetchData("api/specification", "PUT", JSON.stringify(formData))
        await set(loadSpecificationListAtom)
        const data = get(wardrobeDataAtom)
        set(calculateSpecificationsAtom, data)
        callback({success: result.success as boolean, message: result.message as string})
    } catch (e) { console.error(e) }
})

export const coefListAtom = atom<Map<SpecificationItem, number>>((get) => {
    const coef = new Map()
    get(specificationAtom).forEach(p => { coef.set(p.spec[0], p.spec[1]) })
    return coef
})

export const calculateSpecificationsAtom = atom(null, async (get, set, data: WardrobeData) => {
    const fasadCount = Object.values(data.fasades).reduce((a, f) => f.count + a, 0)
    if (fasadCount === 1 || fasadCount > 6) return
    const { token } = get(userAtom)
    const formData: any = {}
    formData[TableFields.DATA] = data
    formData[TableFields.TOKEN] = token
    set(specificationInProgress, true)
    try {
        const result: FetchResult<SpecificationResult> = await fetchData('api/specification/data', "POST", JSON.stringify(formData))
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