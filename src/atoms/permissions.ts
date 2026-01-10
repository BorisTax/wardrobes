import { atom } from "jotai"
import { fetchData, fetchGetData } from "../functions/fetch"
import { PermissionSchema, UserPermissions, RESOURCE, ResourceSchema } from "../types/user"
import { userAtom } from "./users"
import messages from "../server/messages"
import { TableFields } from "../types/server"
import { API_ROUTE, PERMISSIONS_ROUTE, RESOURCES_ROUTE, USERS_ROUTE } from "../types/routes"
import { DefaultMap, makeDefaultMap } from "./storage"


export const permissionsAtom = atom<PermissionSchema[]>([])

export const loadPermissionsAtom = atom(null, async (get, set, roleId: number)=>{
    const { permissions } = get(userAtom)
    const perm = permissions.get(RESOURCE.USERS)
    if (!perm?.Read) return
    const result = await fetchGetData(`${API_ROUTE}${USERS_ROUTE}${PERMISSIONS_ROUTE}?roleId=${roleId}`)
    if(result.success){
        set(permissionsAtom, result.data as PermissionSchema[])
    }
})
export const resourceListAtom = atom<DefaultMap>(new Map())
export const loadResourceListAtom = atom(null, async (get, set) => {
    const { permissions } = get(userAtom)
    const perm = permissions.get(RESOURCE.USERS)
    if (!perm?.Read) return
    const result = await fetchGetData<ResourceSchema>(`${API_ROUTE}${USERS_ROUTE}${PERMISSIONS_ROUTE}${RESOURCES_ROUTE}`)
    if (result.success) {
        set(resourceListAtom, makeDefaultMap(result.data))
    }
})

export const deletePermissionsAtom = atom(null, async (get, set, roleId: number, resource: RESOURCE) => {
    const user = get(userAtom)
    try{
        const result = await fetchData(`${API_ROUTE}${USERS_ROUTE}${PERMISSIONS_ROUTE}`, "DELETE", JSON.stringify({ roleId, resource }))
        await set(loadPermissionsAtom, roleId)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const addPermissionsAtom = atom(null, async (get, set, permissions: PermissionSchema) => {
    const data = {
        [TableFields.PERMISSIONS]: permissions
    }
    try {
        const result = await fetchData(`${API_ROUTE}${USERS_ROUTE}${PERMISSIONS_ROUTE}`, "POST", JSON.stringify(data))
        await set(loadPermissionsAtom, permissions.roleId)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const updatePermissionsAtom = atom(null, async (get, set, permissions: PermissionSchema) => {
    const data = {
        [TableFields.PERMISSIONS]: permissions
    }
    try {
        const result = await fetchData(`${API_ROUTE}${USERS_ROUTE}${PERMISSIONS_ROUTE}`, "PUT", JSON.stringify(data))
        await set(loadPermissionsAtom, permissions.roleId)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e) 
        return { success: false, message: messages.QUERY_ERROR }
    }
})