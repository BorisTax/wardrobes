import { atom, Setter, Getter } from "jotai"
import { fetchData, fetchGetData } from "../functions/fetch"
import { PermissionSchema, UserPermissions, RESOURCE, UserData, UserLoginResult, UserRole, UserAction } from "../types/user"
import { closeEventSourceAtom, newEventSourceAtom } from "./serverEvents"
import { API_ROUTE, USER_ACTIONS_ROUTE, USERS_ROUTE, VERIFY_ROUTE } from "../types/routes"
import { DefaultMap, loadAllDataAtom, loadedInitialWardrobeDataAtom, makeDefaultMap } from "./storage"
import { loadInitialCombiStateAtom } from "./app"
import { loadResourceListAtom } from "./permissions"


export type UserState = {
    name: string
    roleId: number
    userId: string
    permissions: Map<RESOURCE, UserPermissions>
}
export type ActiveUserState = UserState & {
    time: number
    lastActionTime: number
}
export const userRolesAtom = atom<DefaultMap>(new Map())
export const loadUserRolesAtom = atom(null, async (get,set)=>{
    const { permissions } = get(userAtom)
    const perm = permissions.get(RESOURCE.USERS)
    if (!perm?.Read) return
    const result = await fetchGetData<UserRole>(`${API_ROUTE}/users/roles`)
    if(result.success){
        set(userRolesAtom, makeDefaultMap(result.data))
    }
})

export const allUsersAtom = atom<UserData[]>([])
export const activeUsersAtom = atom<ActiveUserState[]>([])
export const userActionsAtom = atom<UserAction[]>([])
export const loadUsersAtom = atom(null, async (get, set) => {
    const { permissions } = get(userAtom)
    const perm = permissions.get(RESOURCE.USERS)
    if (!perm?.Read) return
    const result = await fetchGetData(`${API_ROUTE}/users/users`)
    if (result.success) {
        set(allUsersAtom, result.data as UserData[])
    }
})
export const loadActiveUsersAtom = atom(null, async (get, set) => {
    const { permissions } = get(userAtom)
    if (!permissions.get(RESOURCE.USERS)?.Read) return
    const result = await fetchGetData(`${API_ROUTE}/users/active`)
    if(result.success){
        set(activeUsersAtom, result.data as ActiveUserState[])
    }
})
export const loadUserActionsAtom = atom(null, async (get, set) => {
    const { permissions } = get(userAtom)
    if (!permissions.get(RESOURCE.USERS)?.Read) return
    const result = await fetchGetData(`${API_ROUTE}${USERS_ROUTE}${USER_ACTIONS_ROUTE}`)
    if(result.success){
        set(userActionsAtom, result.data as UserAction[])
    }
})

export const clearUserActionsAtom = atom(null, async (get, set) => {
    const { permissions } = get(userAtom)
    if (!permissions.get(RESOURCE.USERS)?.Read) return
    const result = await fetchData(`${API_ROUTE}${USERS_ROUTE}${USER_ACTIONS_ROUTE}`, "DELETE", "")
    if(result.success){
        set(userActionsAtom, result.data as UserAction[])
    }
})

const userAtomPrivate = atom(getInitialUser())
export const userAtom = atom(get => get(userAtomPrivate), async (get: Getter, set: Setter, {name, roleId, userId, permissions }: UserLoginResult, verify = false) => {
    if (verify) {
        set(verifyUserAtom)
        return
    }
    let storeUser: UserState = { name: "", roleId: 0, userId:"", permissions: new Map() }
    try {
        localStorage.setItem("user", JSON.stringify({ name, roleId, userId, permissions }))
        storeUser = { name, roleId, userId, permissions: permissionsToMap(permissions) }
        set(newEventSourceAtom)
        set(userAtomPrivate, storeUser)
    } catch (e) {
        storeUser = { name: "", roleId: 0, userId:"", permissions: new Map() }
        set(userAtomPrivate, storeUser)
        set(closeEventSourceAtom)
    }
    set(loadInitialCombiStateAtom)
    if (!get(loadedInitialWardrobeDataAtom)) set(loadAllDataAtom, storeUser.permissions)
    if (storeUser.permissions.get(RESOURCE.USERS)?.Read) {
        set(loadUserRolesAtom)
        set(loadResourceListAtom)
    }
}
)

export const verifyUserAtom = atom(null, async (get: Getter, set: Setter) => {
    const result = await fetchGetData<UserLoginResult>(`${API_ROUTE}${USERS_ROUTE}${VERIFY_ROUTE}`)
    if (!result.success) {
        set(userAtom, { name: "", roleId: 0, userId: "", permissions: [] })
        return
    }
    set(userAtom, {name: result.data[0].name, roleId: result.data[0].roleId, userId: result.data[0].userId, permissions: result.data[0].permissions || [] })
})


export const logoutAtom = atom(null, async (get: Getter, set: Setter) => {
    set(closeEventSourceAtom)
    set(userAtom, { name: "", roleId: 0, userId: "", permissions: [] })
    localStorage.setItem('combiState', "")
    fetchData(`${API_ROUTE}${USERS_ROUTE}/logout`, "POST", "")
})

export const logoutUserAtom = atom(null, async (get: Getter, set: Setter, userId: string) => {
    await fetchData(`${API_ROUTE}${USERS_ROUTE}/logoutUser`, "POST", JSON.stringify({ userId }))
    set(loadActiveUsersAtom)
})

export const createUserAtom = atom(null, async (get: Getter, set: Setter, name: string, password: string, roleId: number) => {
    const result = await fetchData(`${API_ROUTE}${USERS_ROUTE}/add`, "POST", JSON.stringify({ name, password, roleId }))
    if (result.success) set(loadUsersAtom)
    return { success: result.success as boolean, message: result.message  as string }
})
export const updateUserAtom = atom(null, async (get: Getter, set: Setter, name: string, password: string, roleId: number) => {
    const result = await fetchData(`${API_ROUTE}${USERS_ROUTE}/update`, "POST", JSON.stringify({ name, password, roleId }))
    if (result.success) set(loadUsersAtom)
    return { success: result.success as boolean, message: result.message  as string }
})
export const deleteUserAtom = atom(null, async (get: Getter, set: Setter, name: string) => {
    const result = await fetchData(`${API_ROUTE}${USERS_ROUTE}/delete`, "DELETE", JSON.stringify({ name }))
    if (result.success) {
        set(loadUsersAtom)
        set(loadActiveUsersAtom)
    }
    return{ success: result.success as boolean, message: result.message  as string }
})

export const createRoleAtom = atom(null, async (get: Getter, set: Setter, { name }: { name: string }) => {
    const result = await fetchData(`${API_ROUTE}${USERS_ROUTE}/addRole`, "POST", JSON.stringify({ name }))
    if (result.success) set(loadUserRolesAtom)
    return {success: result.success, message: result.message}
})

export const deleteRoleAtom = atom(null, async (get: Getter, set: Setter, { id }: { id: number}) => {
    const result = await fetchData(`${API_ROUTE}${USERS_ROUTE}/deleteRole`, "DELETE", JSON.stringify({ id }))
    if (result.success) {
        set(loadUserRolesAtom)
    }
    return {success: result.success, message: result.message}
})


export function getInitialUser(): UserState {
    let storeUser
    try {
        storeUser = JSON.parse(localStorage.getItem("user") || "")
    }
    finally {
        const user = {
            name: storeUser?.name || "",
            roleId: storeUser?.roleId || 0,
            userId: storeUser?.userId || "",
            permissions: storeUser?.permissions ? permissionsToMap(storeUser.permissions) : new Map()
        }
        return user
    }
}

// export function getInitialPermissions(): Map<RESOURCE, UserPermissions> {
//     const m = new Map<RESOURCE, UserPermissions>()
//     Object.keys(RESOURCE).forEach(k => m.set(k as RESOURCE, { Create: false, Update: false, Read: false, Delete: false }))
//     return m
// }

export function permissionsToMap(permissions: PermissionSchema[]): Map<RESOURCE, UserPermissions> {
    const m = new Map<RESOURCE, UserPermissions>()
    permissions.forEach(p => {
        m.set(p.resourceId, { Create: !!p.create, Read: !!p.read, Update: !!p.update, Delete: !!p.delete })
    })
    return m
}