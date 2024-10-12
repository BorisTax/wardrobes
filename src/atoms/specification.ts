import { atom } from "jotai";
import { SpecificationItem } from "../types/specification";
import { CombiSpecificationResult, SpecificationMultiResult, SpecificationResult, WardrobeData } from "../types/wardrobe";
import { userAtom } from "./users";
import { FetchResult, fetchData, fetchGetData } from "../functions/fetch";
import { SpecificationData, TableFields } from "../types/server";
import { getInitSpecification } from "../functions/specification";
import { wardrobeDataAtom } from "./wardrobe";
import messages from "../server/messages";
import { appAtom } from "./app";
import { AppState } from "../types/app";


export const specificationDataAtom = atom<SpecificationData[]>([])
export const specificationCombiAtom = atom<SpecificationResult[][]>([[]])
export const specificationAtom = atom<SpecificationMultiResult>(getInitSpecification())
export const specificationInProgress = atom(false)

export const loadSpecificationListAtom = atom(null, async (get, set) => {
    const { token } = get(userAtom)
    try {
        const result: FetchResult<[] | string> = await fetchGetData('/api/specification?token=' + token)
        if (!result.success) set(specificationDataAtom, []); else
            set(specificationDataAtom, result.data as SpecificationData[])
    } catch (e) { console.error(e) }
})

export const updateSpecificationListAtom = atom(null, async (get, set, { name, caption, code, coef, id, purpose }: SpecificationData) => {
    const user = get(userAtom)
    const formData: { name: string, token: string, caption?: string, coef?: number, code?: string, purpose?: string, id?: string } = {
        [TableFields.TOKEN]: user.token,
        [TableFields.NAME]: name
    }
    if (caption !== undefined) formData[TableFields.CAPTION] = caption
    if (coef !== undefined) formData[TableFields.COEF] = coef
    if (code !== undefined) formData[TableFields.CODE] = code
    if (purpose !== undefined) formData[TableFields.PURPOSE] = purpose
    if (id !== undefined) formData[TableFields.ID] = id
    try {
        const result = await fetchData("/api/specification", "PUT", JSON.stringify(formData))
        await set(loadSpecificationListAtom)
        set(calculateSpecificationsAtom)
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
        const result: FetchResult<SpecificationMultiResult> = await fetchData('/api/specification/data', "POST", JSON.stringify(formData))
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
        const result: FetchResult<CombiSpecificationResult> = await fetchData('/api/specification/combidata', "POST", JSON.stringify(formData))
        if (result.success && result.data) {
            set(specificationCombiAtom, result.data.specifications as SpecificationResult[][])
            set(totalPriceAtom, result.data.totalPrice)
            set(specificationInProgress, false)
        }
    } catch (e) { console.error(e) }
})


export const totalPriceAtom = atom<number[]>([])