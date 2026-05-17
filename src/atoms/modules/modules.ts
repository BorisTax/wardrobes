import { FetchResult, fetchData, fetchGetData } from "../../functions/fetch";
import { API_ROUTE, MODULE_MODULES_ROUTE } from "../../types/routes";
import { makeExtMap } from "../storage";
import messages from "../../server/messages";
import { ModuleModulesTableSchema } from "../../types/schemas/moduleSchemas";
import { MODULE_ROUTE } from "../../types/routes";
import { OmitId } from "../../types/materials";
import { atom } from "jotai";

export const modulesLastStateDBAtom = atom<{ groupId: number, serieId: number, moduleId: number }>({ groupId: 0, serieId: 0, moduleId: 0 })

export const loadModules =  async (serieId: number) => {
    try {
        const fetchData: FetchResult<ModuleModulesTableSchema> = await (await fetchGetData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_MODULES_ROUTE}?serieId=${serieId}`))
        const data = fetchData.data.filter(d => d.id !== 0)
        return makeExtMap(data)
    } catch (e) { 
        console.error(e)
        return new Map()
     }
}


export const addModule = async (data: OmitId<ModuleModulesTableSchema>) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_MODULES_ROUTE}`, "POST", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export const updateModule = async (data: ModuleModulesTableSchema) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_MODULES_ROUTE}`, "PUT", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export const deleteModule = async (id: number) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_MODULES_ROUTE}`, "DELETE", JSON.stringify({ id }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}