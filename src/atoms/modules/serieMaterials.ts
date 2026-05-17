import { FetchResult, fetchData, fetchGetData } from "../../functions/fetch";
import { API_ROUTE, MODULE_SERIES_MATERIALS_ROUTE } from "../../types/routes";
import messages from "../../server/messages";
import { ModuleSerieMaterialsTableSchema } from "../../types/schemas/moduleSchemas";
import { MODULE_ROUTE } from "../../types/routes";
import { OmitId } from "../../types/materials";
import { makeExtMap } from "../storage";

export const MatIndexes = [0, 1, 2, 3]

export const loadModuleSerieMaterials = async (serieId: number) => {
    try {
        const fetchData: FetchResult<ModuleSerieMaterialsTableSchema> = await (await fetchGetData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_SERIES_MATERIALS_ROUTE}?serieId=${serieId}`))
        const data = fetchData.data
        return makeExtMap(data)
    } catch (e) { 
        console.error(e) 
        return new Map()
    }
}

export const addModuleSerieMaterial = async (data: OmitId<ModuleSerieMaterialsTableSchema>) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_SERIES_MATERIALS_ROUTE}`, "POST", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export const updateModuleSerieMaterial = async (data: ModuleSerieMaterialsTableSchema) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_SERIES_MATERIALS_ROUTE}`, "PUT", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export const deleteModuleSerieMaterial = async (id: number) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_SERIES_MATERIALS_ROUTE}`, "DELETE", JSON.stringify({ id }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

