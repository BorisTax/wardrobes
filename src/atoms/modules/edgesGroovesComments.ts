import { FetchResult, fetchData, fetchGetData } from "../../functions/fetch";
import { API_ROUTE, MODULE_COMMENTS_ROUTE, MODULE_EDGES_ROUTE, MODULE_GROOVES_ROUTE } from "../../types/routes";
import { makeDefaultMap, makeExtMap } from "../storage";
import messages from "../../server/messages";
import { ModuleEdgesTableSchema } from "../../types/schemas/moduleSchemas";
import { MODULE_ROUTE } from "../../types/routes";
import { OmitId } from "../../types/materials";
import { DefaultSchema } from "../../types/schemas/schemas";


export const loadModulesEdges = async () => {
    try {
        const fetchData: FetchResult<ModuleEdgesTableSchema> = await fetchGetData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_EDGES_ROUTE}`)
        const data = fetchData.data
        return makeExtMap(data)
    } catch (e) {
        console.error(e)
        return new Map()
    }
}
export const loadModulesGrooves = async () => {
    try {
        const fetchData: FetchResult<DefaultSchema> = await fetchGetData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_GROOVES_ROUTE}`)
        const data = fetchData.data
        return makeDefaultMap(data)
    } catch (e) {
        console.error(e)
        return new Map()
    }
}

export const loadModulesComments = async () => {
    try {
        const fetchData: FetchResult<DefaultSchema> = await fetchGetData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_COMMENTS_ROUTE}`)
        const data = fetchData.data
        return makeDefaultMap(data)
    } catch (e) {
        console.error(e)
        return new Map()
     }
}


export const addModuleEdge = async (data: OmitId<ModuleEdgesTableSchema>) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_EDGES_ROUTE}`, "POST", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export const updateModuleEdge = async (data: ModuleEdgesTableSchema) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_EDGES_ROUTE}`, "PUT", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export const deleteModuleEdge = async (id: number) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_EDGES_ROUTE}`, "DELETE", JSON.stringify({ id }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

