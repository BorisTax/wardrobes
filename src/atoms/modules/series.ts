import { atom } from "jotai";
import { FetchResult, fetchData, fetchGetData } from "../../functions/fetch";
import { RESOURCE } from "../../types/user";
import { API_ROUTE, MODULE_SERIES_ROUTE } from "../../types/routes";
import { ExtMap, makeExtMap } from "../storage";
import { userAtom } from "../users";
import messages from "../../server/messages";
import { ModuleSeriesTableSchema } from "../../types/schemas/moduleSchemas";
import { MODULE_ROUTE } from "../../types/routes";
import { OmitId } from "../../types/materials";


export const moduleSeriesAtom = atom<ExtMap<ModuleSeriesTableSchema>>(new Map())

export const loadModuleSeriesAtom = atom(null, async (get, set) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MODULES)?.Read) return { success: false, message: "" }
    try {
        const fetchData: FetchResult<ModuleSeriesTableSchema> = await (await fetchGetData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_SERIES_ROUTE}`))
        const data = fetchData.data.filter(d => d.id !== 0)
        set(moduleSeriesAtom, makeExtMap(data))
    } catch (e) { console.error(e) }
})


export const addModuleSerieAtom = atom(null, async (get, set, data: OmitId<ModuleSeriesTableSchema>) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MODULES)?.Create) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_SERIES_ROUTE}`, "POST", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})

export const updateModuleSerieAtom = atom(null, async (get, set, data: ModuleSeriesTableSchema) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MODULES)?.Update) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_SERIES_ROUTE}`, "PUT", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})

export const deleteModuleSerieAtom = atom(null, async (get, set, id: number) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MODULES)?.Delete) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_SERIES_ROUTE}`, "DELETE", JSON.stringify({ id }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})