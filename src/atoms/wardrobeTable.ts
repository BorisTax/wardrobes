import { atom } from "jotai";
import { WardrobeDetailTableSchema } from "../types/schemas";
import { userAtom } from "./users";
import { FetchResult, fetchData, fetchGetData } from "../functions/fetch";
import { API_ROUTE, WARDROBE_DETAIL_TABLE_ROUTE, WARDROBE_ROUTE } from "../types/routes";
import { OmitId } from "../types/materials";
import messages from "../server/messages";

export const wardrobeTableAtom = atom<WardrobeDetailTableSchema[]>([])

export const loadWardrobeTableAtom = atom(null, async (get, set) => {
    try {
        const result: FetchResult<WardrobeDetailTableSchema> = await fetchGetData(`${API_ROUTE}${WARDROBE_ROUTE}${WARDROBE_DETAIL_TABLE_ROUTE}`)
        set(wardrobeTableAtom, result.data as WardrobeDetailTableSchema[])
    } catch (e) { console.error(e) }
})

export const addWardrobeTableAtom = atom(null, async (get, set, data: OmitId<WardrobeDetailTableSchema>) => {
    try {
        const result: FetchResult<WardrobeDetailTableSchema> = await fetchData(`${API_ROUTE}${WARDROBE_ROUTE}${WARDROBE_DETAIL_TABLE_ROUTE}`, "POST", JSON.stringify({...data}))
        set(loadWardrobeTableAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const updateWardrobeTableAtom = atom(null, async (get, set, data: Partial<WardrobeDetailTableSchema>) => {
    try {
        const result: FetchResult<WardrobeDetailTableSchema> = await fetchData(`${API_ROUTE}${WARDROBE_ROUTE}${WARDROBE_DETAIL_TABLE_ROUTE}`, "PUT", JSON.stringify({...data}))
        set(loadWardrobeTableAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const deleteWardrobeTableAtom = atom(null, async (get, set, id: number) => {
    try {
        const result: FetchResult<WardrobeDetailTableSchema> = await fetchData(`${API_ROUTE}${WARDROBE_ROUTE}${WARDROBE_DETAIL_TABLE_ROUTE}`, "DELETE", JSON.stringify({ id }))
        set(loadWardrobeTableAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})