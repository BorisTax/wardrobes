import { FetchResult, fetchData, fetchGetData } from "../../functions/fetch";
import { API_ROUTE, MODULE_SERIES_ROUTE } from "../../types/routes";
import { makeExtMap } from "../storage";
import messages from "../../server/messages";
import { ModuleSeriesTableSchema } from "../../types/schemas/moduleSchemas";
import { MODULE_ROUTE } from "../../types/routes";
import { OmitId } from "../../types/materials";

export const loadModuleSeries = async (groupId: number) => {
    try {
        const fetchData: FetchResult<ModuleSeriesTableSchema> = await fetchGetData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_SERIES_ROUTE}?groupId=${groupId}`)
        const data = fetchData.data.filter(d => d.id !== 0)
        return makeExtMap(data)
    } catch (e) { 
        console.error(e)
        return new Map()
     }
}

export const addModuleSerie = async (data: OmitId<ModuleSeriesTableSchema>) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_SERIES_ROUTE}`, "POST", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export const updateModuleSerie = async (data: ModuleSeriesTableSchema) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_SERIES_ROUTE}`, "PUT", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export const deleteModuleSerie = async (id: number) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_SERIES_ROUTE}`, "DELETE", JSON.stringify({ id }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}