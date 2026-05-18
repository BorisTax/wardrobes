import { FetchResult, fetchData, fetchGetData } from "../../functions/fetch";
import { API_ROUTE, MODULE_DETAILS_ROUTE } from "../../types/routes";
import messages from "../../server/messages";
import { ModuleDetailsTableSchema } from "../../types/schemas/moduleSchemas";
import { MODULE_ROUTE } from "../../types/routes";
import { OmitId } from "../../types/materials";
import { atom } from "jotai";

export const modulesDetailsLastStateDBAtom = atom<{ groupId: number, serieId: number, moduleId: number, detailId: number }>({ groupId: 0, serieId: 0, moduleId: 0, detailId: 0 })

export const loadModuleDetails = async (moduleId: number) => {
    try {
        const fetchData: FetchResult<ModuleDetailsTableSchema> = await fetchGetData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_DETAILS_ROUTE}?moduleId=${moduleId}`)
        const data = fetchData.data
        return data
    } catch (e) { 
        console.error(e) 
        return []
    }
}

export const addModuleDetail = async (data: OmitId<ModuleDetailsTableSchema>) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_DETAILS_ROUTE}`, "POST", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export const updateModuleDetail = async (data: ModuleDetailsTableSchema) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_DETAILS_ROUTE}`, "PUT", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export const deleteModuleDetail = async (id: number) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_DETAILS_ROUTE}`, "DELETE", JSON.stringify({ id }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}