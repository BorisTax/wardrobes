import { fetchData, fetchGetData } from "../../functions/fetch"
import {ResourceSchema } from "../../types/user"
import messages from "../../server/messages"
import { API_ROUTE, RESOURCES_ROUTE, USERS_ROUTE } from "../../types/routes"
import { makeDefaultMap } from "../storage"


export const loadResources = async () => {
    try {
        const result = await fetchGetData(`${API_ROUTE}${USERS_ROUTE}${RESOURCES_ROUTE}`)
        if (result.success) return makeDefaultMap(result.data as ResourceSchema[])
        return new Map()
    }
    catch (e) {
        console.error(e)
        return new Map()
    }
}

export const deleteResource = async (id: number) => {
    try {
        const result = await fetchData(`${API_ROUTE}${USERS_ROUTE}${RESOURCES_ROUTE}`, "DELETE", JSON.stringify({ id}))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
    }
}

export const addResource = async (data: ResourceSchema) => {
    try {
        const result = await fetchData(`${API_ROUTE}${USERS_ROUTE}${RESOURCES_ROUTE}`, "POST", JSON.stringify(data))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
    }
}

export const updateResource = async (data: ResourceSchema) => {
    try {
        const result = await fetchData(`${API_ROUTE}${USERS_ROUTE}${RESOURCES_ROUTE}`, "PUT", JSON.stringify(data))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
    }
}