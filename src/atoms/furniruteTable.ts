import { atom } from "jotai";
import { FurnitureTableSchema } from "../types/schemas";
import { userAtom } from "./users";
import { FetchResult, fetchData, fetchGetData } from "../functions/fetch";
import { API_ROUTE, FURNITURE_TABLE_ROUTE, WARDROBE_ROUTE } from "../types/routes";
import { OmitId } from "../types/materials";
import messages from "../server/messages";

export const furnitureTableAtom = atom<FurnitureTableSchema[]>([])

export const loadFurnitureTableAtom = atom(null, async (get, set) => {
    try {
        const result: FetchResult<FurnitureTableSchema> = await fetchGetData(`${API_ROUTE}${WARDROBE_ROUTE}${FURNITURE_TABLE_ROUTE}`)
        set(furnitureTableAtom, result.data as FurnitureTableSchema[])
    } catch (e) { console.error(e) }
})

export const addvFurnitureTableAtom = atom(null, async (get, set, data: OmitId<FurnitureTableSchema>) => {
    try {
        const result: FetchResult<FurnitureTableSchema> = await fetchData(`${API_ROUTE}${WARDROBE_ROUTE}${FURNITURE_TABLE_ROUTE}`, "POST", JSON.stringify({...data}))
        set(loadFurnitureTableAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const updateFurnitureTableAtom = atom(null, async (get, set, data: Partial<FurnitureTableSchema>) => {
    try {
        const result: FetchResult<FurnitureTableSchema> = await fetchData(`${API_ROUTE}${WARDROBE_ROUTE}${FURNITURE_TABLE_ROUTE}`, "PUT", JSON.stringify({...data}))
        set(loadFurnitureTableAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const deleteFurnitureTableAtom = atom(null, async (get, set, id: number) => {
    try {
        const result: FetchResult<FurnitureTableSchema> = await fetchData(`${API_ROUTE}${WARDROBE_ROUTE}${FURNITURE_TABLE_ROUTE}`, "DELETE", JSON.stringify({ id }))
        set(loadFurnitureTableAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})