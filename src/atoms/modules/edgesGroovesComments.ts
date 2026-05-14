import { atom } from "jotai";
import { FetchResult, fetchData, fetchGetData } from "../../functions/fetch";
import { RESOURCE } from "../../types/user";
import { API_ROUTE, MODULE_COMMENTS_ROUTE, MODULE_EDGES_ROUTE, MODULE_GROOVES_ROUTE, MODULE_MODULES_ROUTE } from "../../types/routes";
import { DefaultMap, ExtMap, makeDefaultMap, makeExtMap } from "../storage";
import { userAtom } from "../users";
import messages from "../../server/messages";
import { ModuleCommentsTableSchema, ModuleEdgesTableSchema, ModuleGroovesTableSchema, ModuleModulesTableSchema } from "../../types/schemas/moduleSchemas";
import { MODULE_ROUTE } from "../../types/routes";
import { OmitId } from "../../types/materials";
import { DefaultSchema } from "../../types/schemas/schemas";


export const modulesEdgeAtom = atom<ExtMap<ModuleEdgesTableSchema>>(new Map())
export const modulesGroovesAtom = atom<DefaultMap>(new Map())
export const modulesCommentsAtom = atom<DefaultMap>(new Map())

export const loadModulesEdgesAtom = atom(null, async (get, set) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MODULES)?.Read) return { success: false, message: "" }
    try {
        const fetchData: FetchResult<ModuleEdgesTableSchema> = await (await fetchGetData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_EDGES_ROUTE}`))
        const data = fetchData.data.filter(d => d.id !== 0)
        set(modulesEdgeAtom, makeExtMap(data))
    } catch (e) { console.error(e) }
})
export const loadModulesGroovesAtom = atom(null, async (get, set) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MODULES)?.Read) return { success: false, message: "" }
    try {
        const fetchData: FetchResult<DefaultSchema> = await (await fetchGetData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_GROOVES_ROUTE}`))
        const data = fetchData.data.filter(d => d.id !== 0)
        set(modulesGroovesAtom, makeDefaultMap(data))
    } catch (e) { console.error(e) }
})

export const loadModulesCommentsAtom = atom(null, async (get, set) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MODULES)?.Read) return { success: false, message: "" }
    try {
        const fetchData: FetchResult<DefaultSchema> = await (await fetchGetData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_COMMENTS_ROUTE}`))
        const data = fetchData.data.filter(d => d.id !== 0)
        set(modulesCommentsAtom, makeDefaultMap(data))
    } catch (e) { console.error(e) }
})


export const addModuleEdgeAtom = atom(null, async (get, set, data: OmitId<ModuleEdgesTableSchema>) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MODULES)?.Create) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_EDGES_ROUTE}`, "POST", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})

export const updateModuleEdgeAtom = atom(null, async (get, set, data: ModuleEdgesTableSchema) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MODULES)?.Update) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_EDGES_ROUTE}`, "PUT", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})

export const deleteModuleEdgeAtom = atom(null, async (get, set, id: number) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MODULES)?.Delete) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_EDGES_ROUTE}`, "DELETE", JSON.stringify({ id }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})



export const addModuleGrooveAtom = atom(null, async (get, set, data: OmitId<ModuleGroovesTableSchema>) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MODULES)?.Create) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_GROOVES_ROUTE}`, "POST", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})

export const updateModuleGrooveAtom = atom(null, async (get, set, data: ModuleGroovesTableSchema) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MODULES)?.Update) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_GROOVES_ROUTE}`, "PUT", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})

export const deleteModuleGrooveAtom = atom(null, async (get, set, id: number) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MODULES)?.Delete) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_GROOVES_ROUTE}`, "DELETE", JSON.stringify({ id }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})



export const addModuleCommentAtom = atom(null, async (get, set, data: OmitId<ModuleCommentsTableSchema>) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MODULES)?.Create) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_COMMENTS_ROUTE}`, "POST", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})

export const updateModuleCommentAtom = atom(null, async (get, set, data: ModuleCommentsTableSchema) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MODULES)?.Update) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_COMMENTS_ROUTE}`, "PUT", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})

export const deleteModuleCommentAtom = atom(null, async (get, set, id: number) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MODULES)?.Delete) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_COMMENTS_ROUTE}`, "DELETE", JSON.stringify({ id }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})