import { FetchResult, fetchData, fetchGetData } from "../../functions/fetch";
import { API_ROUTE } from "../../types/routes";
import { makeDefaultMap } from "./../storage";
import messages from "../../server/messages";
import { ModuleGroupsTableSchema } from "../../types/schemas/moduleSchemas";
import { MODULE_GROUPS_ROUTE, MODULE_ROUTE } from "../../types/routes";
import { OmitId } from "../../types/materials";

export const loadModuleGroups =  async () => {
    try {
        const fetchData: FetchResult<ModuleGroupsTableSchema> = await fetchGetData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_GROUPS_ROUTE}`)
        const data = fetchData.data.filter(d => d.id !== 0)
        return makeDefaultMap(data)
    } catch (e) { 
        console.error(e) 
        return new Map()
    }
}

export const addModuleGroup = async (data: OmitId<ModuleGroupsTableSchema>) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_GROUPS_ROUTE}`, "POST", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export const updateModuleGroup = async (data: ModuleGroupsTableSchema) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_GROUPS_ROUTE}`, "PUT", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export const deleteModuleGroup = async (id: number) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_GROUPS_ROUTE}`, "DELETE", JSON.stringify({ id }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}
