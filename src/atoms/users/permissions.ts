import { fetchData, fetchGetData } from "../../functions/fetch"
import { PermissionSchema, RESOURCE } from "../../types/user"
import messages from "../../server/messages"
import { TableFields } from "../../types/server"
import { API_ROUTE, PERMISSIONS_ROUTE, USERS_ROUTE } from "../../types/routes"


export const loadPermissions = async (roleId: number) => {
    try {
        const result = await fetchGetData(`${API_ROUTE}${USERS_ROUTE}${PERMISSIONS_ROUTE}?roleId=${roleId}`)
        if (result.success) {
            return result.data as PermissionSchema[]
        }
        return []
    } catch (e) {
        console.error(e)
        return []
    }
}

export const deletePermissions = async (roleId: number, resourceId: RESOURCE) => {
    try{
        const result = await fetchData(`${API_ROUTE}${USERS_ROUTE}${PERMISSIONS_ROUTE}`, "DELETE", JSON.stringify({ roleId, resourceId }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
}

export const addPermissions = async (permissions: PermissionSchema) => {
    const data = {
        [TableFields.PERMISSIONS]: permissions
    }
    try {
        const result = await fetchData(`${API_ROUTE}${USERS_ROUTE}${PERMISSIONS_ROUTE}`, "POST", JSON.stringify(data))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
}

export const updatePermissions = async (permissions: PermissionSchema) => {
    const data = {
        [TableFields.PERMISSIONS]: permissions
    }
    try {
        const result = await fetchData(`${API_ROUTE}${USERS_ROUTE}${PERMISSIONS_ROUTE}`, "PUT", JSON.stringify(data))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e) 
        return { success: false, message: messages.QUERY_ERROR }
    }
}