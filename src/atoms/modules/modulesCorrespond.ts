import { atom } from "jotai";
import { FetchResult, fetchData, fetchGetData } from "../../functions/fetch";
import { RESOURCE } from "../../types/user";
import { API_ROUTE, MODULE_CORRESPOND_ROUTE } from "../../types/routes";
import { ExtMap, makeExtMap } from "../storage";
import { userAtom } from "../users";
import messages from "../../server/messages";
import { ModuleCorrespondTableSchema } from "../../types/schemas/moduleSchemas";
import { MODULE_ROUTE } from "../../types/routes";
import { OmitId } from "../../types/materials";


export const modulesCorrespondAtom = atom<ExtMap<ModuleCorrespondTableSchema>>(new Map())

export const loadModulesCorrespondAtom = atom(null, async (get, set, serieId: number) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MODULES)?.Read) return { success: false, message: "" }
    try {
        const fetchData: FetchResult<ModuleCorrespondTableSchema> = await (await fetchGetData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_CORRESPOND_ROUTE}?serieId=${serieId}`))
        const data = fetchData.data.filter(d => d.id !== 0)
        set(modulesCorrespondAtom, makeExtMap(data))
    } catch (e) { console.error(e) }
})


export const addModuleCorrespondAtom = atom(null, async (get, set, data: OmitId<ModuleCorrespondTableSchema>) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MODULES)?.Create) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_CORRESPOND_ROUTE}`, "POST", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})

export const updateModuleCorrespondAtom = atom(null, async (get, set, data: ModuleCorrespondTableSchema) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MODULES)?.Update) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_CORRESPOND_ROUTE}`, "PUT", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})

export const deleteModuleCorrespondAtom = atom(null, async (get, set, id: number) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MODULES)?.Delete) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_CORRESPOND_ROUTE}`, "DELETE", JSON.stringify({ id }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})