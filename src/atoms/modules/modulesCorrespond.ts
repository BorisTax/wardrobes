import { FetchResult, fetchData, fetchGetData } from "../../functions/fetch";
import { API_ROUTE, MODULE_CORRESPOND_ROUTE } from "../../types/routes";
import { makeExtMap } from "../storage";
import messages from "../../server/messages";
import { ModuleCorrespondTableSchema } from "../../types/schemas/moduleSchemas";
import { MODULE_ROUTE } from "../../types/routes";
import { OmitId } from "../../types/materials";


export const loadModulesCorrespond =   async (serieId: number) => {
    try {
        const fetchData: FetchResult<ModuleCorrespondTableSchema> = await (await fetchGetData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_CORRESPOND_ROUTE}?serieId=${serieId}`))
        const data = fetchData.data.filter(d => d.id !== 0)
        return makeExtMap(data)
    } catch (e) { 
        console.error(e)
        return new Map()
     }
}


export const addModuleCorrespond = async (data: OmitId<ModuleCorrespondTableSchema>) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_CORRESPOND_ROUTE}`, "POST", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export const updateModuleCorrespond = async (data: ModuleCorrespondTableSchema) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_CORRESPOND_ROUTE}`, "PUT", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export const deleteModuleCorrespond = async (id: number) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_CORRESPOND_ROUTE}`, "DELETE", JSON.stringify({ id }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}