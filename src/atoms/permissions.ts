import { atom } from "jotai"
import { fetchData, fetchGetData } from "../functions/fetch"
import { PERMISSIONS_SCHEMA, Permissions, RESOURCE, Resource } from "../types/user"
import { userAtom } from "./users"
import messages from "../server/messages"
import { TableFields } from "../types/server"


export const permissionsAtom = atom<PERMISSIONS_SCHEMA[]>([])
export const loadPermissionsAtom = atom(null, async (get, set, roleId: number)=>{
    const { token, permissions } = get(userAtom)
    const perm = permissions.get(RESOURCE.USERS)
    if (!perm?.read) return
    const result = await fetchGetData(`/api/users/permissions?token=${token}&roleId=${roleId}`)
    if(result.success){
        set(permissionsAtom, result.data as PERMISSIONS_SCHEMA[])
    }
})
export const resourceListAtom = atom<Resource[]>([])
export const loadResourceListAtom = atom(null, async (get, set) => {
    const { token, permissions } = get(userAtom)
    const perm = permissions.get(RESOURCE.USERS)
    if (!perm?.read) return
    const result = await fetchGetData(`/api/users/permissions/resources?token=${token}`)
    if (result.success) {
        set(resourceListAtom, result.data as Resource[])
    }
})
export const resourceAsMap = atom((get) => {
    const resources = get(resourceListAtom)
    const m = new Map()
    resources.forEach(r => m.set(r.name, r.caption))
    return m
})
export const deletePermissionsAtom = atom(null, async (get, set, roleId: number, resource: RESOURCE) => {
    const user = get(userAtom)
    try{
        const result = await fetchData("/api/users/permissions", "DELETE", JSON.stringify({ roleId, resource, token: user.token }))
        await set(loadPermissionsAtom, roleId)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const addPermissionsAtom = atom(null, async (get, set, roleId: number, resource: RESOURCE, permissions: Permissions) => {
    const user = get(userAtom)
    const data = {
        [TableFields.ROLEID]: roleId,
        [TableFields.RESOURCE]: resource,
        [TableFields.PERMISSIONS]: permissions,
        [TableFields.TOKEN]: user.token
    }
    try {
        const result = await fetchData("/api/users/permissions", "POST", JSON.stringify(data))
        await set(loadPermissionsAtom, roleId)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const updatePermissionsAtom = atom(null, async (get, set, roleId: number, resource: RESOURCE, permissions: Permissions) => {
    const user = get(userAtom)
    const data = {
        [TableFields.ROLEID]: roleId,
        [TableFields.RESOURCE]: resource,
        [TableFields.PERMISSIONS]: permissions,
        [TableFields.TOKEN]: user.token
    }
    try {
        const result = await fetchData("/api/users/permissions", "PUT", JSON.stringify(data))
        await set(loadPermissionsAtom, roleId)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e) 
        return { success: false, message: messages.QUERY_ERROR }
    }
})