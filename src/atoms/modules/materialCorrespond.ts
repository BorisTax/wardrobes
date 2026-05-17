import { FetchResult, fetchData, fetchGetData } from "../../functions/fetch";
import { API_ROUTE, MODULE_MATERIAL_CORRESPOND_ROUTE } from "../../types/routes";
import messages from "../../server/messages";
import { ModuleMaterialCorrespondTableSchema } from "../../types/schemas/moduleSchemas";
import { MODULE_ROUTE } from "../../types/routes";
import { OmitId } from "../../types/materials";
import { makeExtMap } from "../storage";



export const loadModuleMaterialCorrespond = async () => {
    try {
        const fetchData: FetchResult<ModuleMaterialCorrespondTableSchema> = await fetchGetData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_MATERIAL_CORRESPOND_ROUTE}`)
        const data = fetchData.data
        return makeExtMap(data)
    } catch (e) { 
        console.error(e) 
        return new Map()
    }
}

export const addModuleMaterialCorrespond = async (data: OmitId<ModuleMaterialCorrespondTableSchema>) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_MATERIAL_CORRESPOND_ROUTE}`, "POST", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export const updateModuleMaterialCorrespond = async (data: ModuleMaterialCorrespondTableSchema) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_MATERIAL_CORRESPOND_ROUTE}`, "PUT", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export const deleteModuleMaterialCorrespond = async (id: number) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_MATERIAL_CORRESPOND_ROUTE}`, "DELETE", JSON.stringify({ id }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}
