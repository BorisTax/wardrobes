import { fetchData, fetchGetData, FetchResult } from "../../functions/fetch"
import messages from "../../server/messages"
import { OmitId } from "../../types/materials"
import { API_ROUTE, USERS_ROUTE } from "../../types/routes"
import { UserSchema } from "../../types/schemas/userSchemas"
import { makeExtMap } from "../storage"

export const loadUsers =  async () => {
    try {
        const fetchData: FetchResult<UserSchema> = await fetchGetData(`${API_ROUTE}${USERS_ROUTE}`)
        const data = fetchData.data
        return makeExtMap(data)
    } catch (e) { 
        console.error(e)
        return new Map()
     }
}

export const addUser = async (data: OmitId<UserSchema>) => {
    try {
        const result = await fetchData(`${API_ROUTE}${USERS_ROUTE}`, "POST", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export const updateUser = async (data: UserSchema) => {
    try {
        const result = await fetchData(`${API_ROUTE}${USERS_ROUTE}`, "PUT", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export const deleteUser = async (id: number) => {
    try {
        const result = await fetchData(`${API_ROUTE}${USERS_ROUTE}`, "DELETE", JSON.stringify({ id }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}