import { FetchResult, fetchData, fetchGetData } from "../../functions/fetch";
import { API_ROUTE, MODULE_COLORS_ROUTE, MODULE_FILM_ROUTE, MODULE_MAT_BASE_ROUTE, MODULE_MATERIALS_ROUTE } from "../../types/routes";
import messages from "../../server/messages";
import { ModuleColorsTableSchema, ModuleFilmTableSchema, ModuleMatBaseTableSchema, ModuleMaterialsTableSchema } from "../../types/schemas/moduleSchemas";
import { MODULE_ROUTE } from "../../types/routes";
import { OmitId } from "../../types/materials";
import { makeExtMap } from "../storage";



export const loadModuleMatBases = async () => {
    try {
        const fetchData: FetchResult<ModuleMatBaseTableSchema> = await fetchGetData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_MAT_BASE_ROUTE}`)
        const data = fetchData.data
        return makeExtMap(data)
    } catch (e) { 
        console.error(e) 
        return new Map()
    }
}

export const addModuleMatBase = async (data: OmitId<ModuleMatBaseTableSchema>) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_MAT_BASE_ROUTE}`, "POST", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export const updateModuleMatBase = async (data: ModuleMatBaseTableSchema) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_MAT_BASE_ROUTE}`, "PUT", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export const deleteModuleMatBase = async (id: number) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_MAT_BASE_ROUTE}`, "DELETE", JSON.stringify({ id }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}



export const loadModuleMatColors = async () => {
    try {
        const fetchData: FetchResult<ModuleColorsTableSchema> = await fetchGetData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_COLORS_ROUTE}`)
        const data = fetchData.data
        return makeExtMap(data)
    } catch (e) { 
        console.error(e) 
        return new Map()
    }
}

export const addModuleMatColor = async (data: OmitId<ModuleColorsTableSchema>) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_COLORS_ROUTE}`, "POST", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export const updateModuleMatColor = async (data: ModuleColorsTableSchema) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_COLORS_ROUTE}`, "PUT", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export const deleteModuleMatColor = async (id: number) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_COLORS_ROUTE}`, "DELETE", JSON.stringify({ id }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}




export const loadModuleMaterials = async () => {
    try {
        const fetchData: FetchResult<ModuleMaterialsTableSchema> = await fetchGetData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_MATERIALS_ROUTE}`)
        const data = fetchData.data
        return makeExtMap(data)
    } catch (e) { 
        console.error(e) 
        return new Map()
    }
}

export const addModuleMaterial = async (data: OmitId<ModuleMaterialsTableSchema>) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_MATERIALS_ROUTE}`, "POST", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export const updateModuleMaterial = async (data: ModuleMaterialsTableSchema) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_MATERIALS_ROUTE}`, "PUT", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export const deleteModuleMaterial = async (id: number) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_MATERIALS_ROUTE}`, "DELETE", JSON.stringify({ id }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}



export const loadModuleFilm = async () => {
    try {
        const fetchData: FetchResult<ModuleFilmTableSchema> = await fetchGetData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_FILM_ROUTE}`)
        const data = fetchData.data
        return makeExtMap(data)
    } catch (e) { 
        console.error(e) 
        return new Map()
    }
}

export const addModuleFilm = async (data: OmitId<ModuleFilmTableSchema>) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_FILM_ROUTE}`, "POST", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export const updateModuleFilm = async (data: ModuleFilmTableSchema) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_FILM_ROUTE}`, "PUT", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export const deleteModuleFilm = async (id: number) => {
    try {
        const result = await fetchData(`${API_ROUTE}${MODULE_ROUTE}${MODULE_FILM_ROUTE}`, "DELETE", JSON.stringify({ id }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}