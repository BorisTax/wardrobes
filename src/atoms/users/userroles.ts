import { fetchData, fetchGetData, FetchResult } from "../../functions/fetch"
import messages from "../../server/messages"
import { OmitId } from "../../types/materials"
import { API_ROUTE, USER_ROLES_ROUTE, USERS_ROUTE } from "../../types/routes"
import { UserRolesSchema } from "../../types/schemas/userSchemas"
import {  makeExtMap } from "../storage"

export const loadUserRoles =  async () => {
    try {
        const fetchData: FetchResult<UserRolesSchema> = await fetchGetData(`${API_ROUTE}${USERS_ROUTE}${USER_ROLES_ROUTE}`)
        const data = fetchData.data
        return makeExtMap(data)
    } catch (e) { 
        console.error(e)
        return new Map()
     }
}

export const addUserRole = async (data: OmitId<UserRolesSchema>) => {
    try {
        const result = await fetchData(`${API_ROUTE}${USERS_ROUTE}${USER_ROLES_ROUTE}`, "POST", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export const updateUserRole = async (data: UserRolesSchema) => {
    try {
        const result = await fetchData(`${API_ROUTE}${USERS_ROUTE}${USER_ROLES_ROUTE}`, "PUT", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export const deleteUserRole = async (id: number) => {
    try {
        const result = await fetchData(`${API_ROUTE}${USERS_ROUTE}${USER_ROLES_ROUTE}`, "DELETE", JSON.stringify({ id }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}