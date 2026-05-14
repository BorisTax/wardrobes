import { atom } from "jotai";
import { FetchResult, fetchData, fetchGetData } from "../../functions/fetch";
import { RESOURCE } from "../../types/user";
import { API_ROUTE, MODULE_DETAILS_ROUTE } from "../../types/routes";
import { ExtMap, makeExtMap } from "../storage";
import { userAtom } from "../users";
import messages from "../../server/messages";
import { ModuleDetailsTableSchema } from "../../types/schemas/moduleSchemas";
import { MODULE_GROUPS_ROUTE, MODULE_ROUTE } from "../../types/routes";
import { OmitId } from "../../types/materials";


export const moduleDetailsAtom = atom<ExtMap<ModuleDetailsTableSchema>>(new Map())

export const loadModuleDetails = async (moduleId: number) => {
    try {
        const fetchData: FetchResult<ModuleDetailsTableSchema> = await (await fetchGetData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_DETAILS_ROUTE}?moduleId=${moduleId}`))
        const data = fetchData.data.filter(d => d.id !== 0)
        return data
    } catch (e) { 
        console.error(e) 
        return []
    }
}

export const loadModuleDetailsAtom = atom(null, async (get, set, moduleId: number) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MODULES)?.Read) return { success: false, message: "" }
    try {
        const fetchData: FetchResult<ModuleDetailsTableSchema> = await (await fetchGetData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_DETAILS_ROUTE}?moduleId=${moduleId}`))
        const data = fetchData.data.filter(d => d.id !== 0)
        set(moduleDetailsAtom, makeExtMap(data))
    } catch (e) { console.error(e) }
})


export const addModuleDetailAtom = atom(null, async (get, set, data: OmitId<ModuleDetailsTableSchema>) => {
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

export const updateModuleDetailAtom = atom(null, async (get, set, data: ModuleDetailsTableSchema) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MODULES)?.Update) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_DETAILS_ROUTE}`, "PUT", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})

export const deleteModuleDetailAtom = atom(null, async (get, set, id: number) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MODULES)?.Delete) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_DETAILS_ROUTE}`, "DELETE", JSON.stringify({ id }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})