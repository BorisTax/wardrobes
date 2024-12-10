import { atom } from "jotai";
import { SpecificationMultiResult, SpecificationResult, WardrobeData } from "../types/wardrobe";
import { userAtom } from "./users";
import { FetchResult, fetchData } from "../functions/fetch";
import { TableFields } from "../types/server";
import { getInitSpecification } from "../functions/specification";
import { wardrobeDataAtom } from "./wardrobe";
import { combiStateJSONAtom } from "./app";
import { AppState } from "../types/app";
import { API_ROUTE, COMBIDATA_ROUTE, DATA_ROUTE, SPECIFICATION_ROUTE } from "../types/routes";
import { SpecSchema, SpecToCharSchema } from "../types/schemas";
import { ExtMap } from "./storage";
import messages from "../server/messages";


export const specificationCombiAtom = atom<SpecificationResult[][]>([[]])
export const specificationAtom = atom<SpecificationMultiResult[]>(getInitSpecification())
export const specificationInProgress = atom(false)

export const specListAtom = atom<ExtMap<SpecSchema>>(new Map());
export const specToCharAtom = atom<SpecToCharSchema[]>([]);

export const updateSpecListAtom = atom(null, async (get, set, data: SpecSchema) => {
    const { token } = get(userAtom)
    try {
        const result = await fetchData(`${API_ROUTE}${SPECIFICATION_ROUTE}`, "PUT", JSON.stringify({ data, token }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR}
     }
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
        const result: FetchResult<SpecificationMultiResult> = await fetchData(`${API_ROUTE}${SPECIFICATION_ROUTE}${DATA_ROUTE}`, "POST", JSON.stringify(formData))
        if (!result.success) set(specificationAtom, [...getInitSpecification()]); else
            set(specificationAtom, result.data as SpecificationMultiResult[])
            set(specificationInProgress, false)
    } catch (e) { console.error(e) }
})

export const calculateCombiSpecificationsAtom = atom(null, async (get, set) => {
    const { token } = get(userAtom)
    const data = get(combiStateJSONAtom)
    const formData: { data: AppState, token: string } = {
        [TableFields.DATA]: data,
        [TableFields.TOKEN]: token
    }
    set(specificationInProgress, true)
    try {
        const result: FetchResult<SpecificationResult[]> = await fetchData(`${API_ROUTE}${SPECIFICATION_ROUTE}${COMBIDATA_ROUTE}`, "POST", JSON.stringify(formData))
        if (result.success && result.data) {
            set(specificationCombiAtom, result.data as SpecificationResult[][])
            set(specificationInProgress, false)
        }
    } catch (e) { console.error(e) }
})


export const totalPriceAtom = atom<number[]>([])
export type OutputSpecSchema = { specCode: string; specName: string; charCode: string; charName: string; amount: number; units: string };


