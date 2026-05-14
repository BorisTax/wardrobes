import { atom } from "jotai";
import { FetchResult, fetchData, fetchGetData } from "../../functions/fetch";
import { RESOURCE } from "../../types/user";
import { API_ROUTE } from "../../types/routes";
import { DefaultMap, makeDefaultMap } from "./../storage";
import { userAtom } from "./../users";
import messages from "../../server/messages";
import { ModuleGroupsTableSchema } from "../../types/schemas/moduleSchemas";
import { MODULE_GROUPS_ROUTE, MODULE_ROUTE } from "../../types/routes";
import { OmitId } from "../../types/materials";


export const moduleGroupsAtom = atom<DefaultMap>(new Map())

export const loadModuleGroupsAtom = atom(null, async (get, set) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MODULES)?.Read) return { success: false, message: "" }
    try {
        const fetchData: FetchResult<ModuleGroupsTableSchema> = await fetchGetData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_GROUPS_ROUTE}`)
        const data = fetchData.data.filter(d => d.id !== 0)
        set(moduleGroupsAtom, makeDefaultMap(data))
    } catch (e) { console.error(e) }
})

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

export const addModuleGroupAtom = atom(null, async (get, set, data: OmitId<ModuleGroupsTableSchema>) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MODULES)?.Create) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_GROUPS_ROUTE}`, "POST", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})

export const updateModuleGroupAtom = atom(null, async (get, set, data: ModuleGroupsTableSchema) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MODULES)?.Update) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_GROUPS_ROUTE}`, "PUT", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})

export const deleteModuleGroupAtom = atom(null, async (get, set, id: number) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MODULES)?.Delete) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_GROUPS_ROUTE}`, "DELETE", JSON.stringify({ id }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})