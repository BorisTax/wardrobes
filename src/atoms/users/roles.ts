import { fetchData, fetchGetData, FetchResult } from "../../functions/fetch"
import messages from "../../server/messages"
import { OmitId } from "../../types/materials"
import { API_ROUTE, ROLES_ROUTE, USERS_ROUTE } from "../../types/routes"
import { RolesSchema } from "../../types/schemas/userSchemas"
import { makeDefaultMap } from "../storage"

export const loadRoles =  async () => {
    try {
        const fetchData: FetchResult<RolesSchema> = await fetchGetData(`${API_ROUTE}${USERS_ROUTE}${ROLES_ROUTE}`)
        const data = fetchData.data
        return makeDefaultMap(data)
    } catch (e) { 
        console.error(e)
        return new Map()
     }
}

export const addRole = async (data: OmitId<RolesSchema>) => {
    try {
        const result = await fetchData(`${API_ROUTE}${USERS_ROUTE}${ROLES_ROUTE}`, "POST", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export const updateRole = async (data: RolesSchema) => {
    try {
        const result = await fetchData(`${API_ROUTE}${USERS_ROUTE}${ROLES_ROUTE}`, "PUT", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export const deleteRole = async (id: number) => {
    try {
        const result = await fetchData(`${API_ROUTE}${USERS_ROUTE}${ROLES_ROUTE}`, "DELETE", JSON.stringify({ id }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}