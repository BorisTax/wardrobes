import { atom } from "jotai";
import { SpecificationItem } from "../types/specification";
import { priceListAtom } from "./prices";
import { SpecificationMultiResult, SpecificationResult, WardrobeData } from "../types/wardrobe";
import { userAtom } from "./users";
import { FetchResult, fetchData, fetchGetData } from "../functions/fetch";
import { SpecificationData, TableFields } from "../types/server";
import { getInitSpecification } from "../functions/specification";
import { wardrobeDataAtom } from "./wardrobe";
import messages from "../server/messages";
import { AppState } from "../types/app";


export const specificationDataAtom = atom<SpecificationData[]>([])
export const specificationCombiAtom = atom<SpecificationResult[][]>([[]])
export const specificationAtom = atom<SpecificationMultiResult>(getInitSpecification())
export const specificationInProgress = atom(false)

export const loadSpecificationListAtom = atom(null, async (get, set) => {
    const { token } = get(userAtom)
    try {
        const result: FetchResult<[] | string> = await fetchGetData('api/specification?token=' + token)
        if (!result.success) set(specificationDataAtom, []); else
            set(specificationDataAtom, result.data as SpecificationData[])
    } catch (e) { console.error(e) }
})

export const updateSpecificationListAtom = atom(null, async (get, set, { name, caption, code, coef, id, purpose }: SpecificationData) => {
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
        return {success: result.success as boolean, message: result.message as string}
    } catch (e) { 
        console.error(e) 
        return { success: false, message: messages.QUERY_ERROR }
    }
})

export const coefListAtom = atom<Map<SpecificationItem, number>>((get) => {
    const coef = new Map()
    get(specificationAtom).forEach(p => { coef.set(p.spec[0], p.spec[1]) })
    return coef
})

export const calculateSpecificationsAtom = atom(null, async (get, set, data: WardrobeData) => {
    const { token } = get(userAtom)
    const formData: any = {}
    formData[TableFields.DATA] = data
    formData[TableFields.TOKEN] = token
    set(specificationInProgress, true)
    try {
        const result: FetchResult<SpecificationMultiResult> = await fetchData('api/specification/data', "POST", JSON.stringify(formData))
        if (!result.success) set(specificationAtom, [...getInitSpecification()]); else
            set(specificationAtom, result.data as SpecificationMultiResult)
            set(specificationInProgress, false)
    } catch (e) { console.error(e) }
})

export const calculateCombiSpecificationsAtom = atom(null, async (get, set, data: AppState) => {
    const { token } = get(userAtom)
    const formData: any = {}
    formData[TableFields.DATA] = data
    formData[TableFields.TOKEN] = token
    set(specificationInProgress, true)
    try {
        const result: FetchResult<SpecificationResult[][]> = await fetchData('api/specification/combidata', "POST", JSON.stringify(formData))
        if (result.success) {
            set(specificationCombiAtom, result.data as SpecificationResult[][])
            set(specificationInProgress, false)
        }
    } catch (e) { console.error(e) }
})

export const totalPriceAtom = atom((get) => {
    const priceList = get(priceListAtom)
    const specifications = get(specificationCombiAtom)
    const totalPrice = specifications.map(s => {
        let sum: number = 0
        priceList.forEach(p => {
            s.forEach(sp => {
                sum += sp[1].data.amount
            })
        })
        return sum
    })
    return totalPrice
})