import { FetchResult, fetchData, fetchGetData } from "../../functions/fetch";
import { API_ROUTE } from "../../types/routes";
import { makeDefaultMap } from "../storage";
import messages from "../../server/messages";
import { ModuleGroupsTableSchema } from "../../types/schemas/moduleSchemas";
import { MODULE_ROUTE } from "../../types/routes";
import { DefaultSchema } from "../../types/schemas/schemas";
import { IdNameRoutes } from "../../components/Modules/EditModuleIdName";


export async function loadModuleIdNameData(route: IdNameRoutes){
    try {
        const fetchData: FetchResult<DefaultSchema> = await fetchGetData(`${API_ROUTE}${MODULE_ROUTE}${route}`)
        const data = fetchData.data.filter(d => d.id !== 0)
        return makeDefaultMap(data)
    } catch (e) {
        console.error(e)
        return new Map()
    }
}

export async function addModuleIdNameData(route: IdNameRoutes, name: string){
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${route}`, "POST", JSON.stringify({ name }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export async function updateModuleIdNameData(route: IdNameRoutes, data: ModuleGroupsTableSchema){
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${route}`, "PUT", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export async function deleteModuleModuleIdNameData(route: IdNameRoutes, id: number) {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${route}`, "DELETE", JSON.stringify({ id }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}
