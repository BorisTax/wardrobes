import { atom, Setter, Getter } from "jotai"
import { fetchData, fetchGetData } from "../functions/fetch"
import { PermissionSchema, UserPermissions, RESOURCE, UserLoginResult, UserAction, ActiveUser } from "../types/user"
import { closeEventSourceAtom, newEventSourceAtom } from "./serverEvents"
import { API_ROUTE, USER_ACTIONS_ROUTE, USERS_ROUTE, VERIFY_ROUTE } from "../types/routes"
import { UserLogSchema } from "../types/schemas/userSchemas"


export type UserState = {
    name: string
    roles: number[]
    userSessionId: string
    permissions: Map<RESOURCE, UserPermissions>
}

export const loadActiveUsers = async () => {
    const result = await fetchGetData(`${API_ROUTE}${USERS_ROUTE}/active`)
    if(result.success){
        return result.data as ActiveUser[]
    } else return []
}

export const loadUserActions = async () => {
    const result = await fetchGetData(`${API_ROUTE}${USERS_ROUTE}${USER_ACTIONS_ROUTE}`)
    if(result.success){
        return result.data as UserLogSchema[]
    } else return []
}

export const clearUserActions = async () => {
    try{
        const result = await fetchData(`${API_ROUTE}${USERS_ROUTE}${USER_ACTIONS_ROUTE}`, "DELETE", "")
        if(result.success){
            return result.data as UserAction[]}
        }catch(e){
            console.error(e)
        }
}

const userAtomPrivate = atom(getInitialUser())

export const userAtom = atom(get => get(userAtomPrivate), async (get: Getter, set: Setter, {name, roles, userSessionId, permissions }: UserLoginResult, verify = false) => {
    if (verify) {
        set(verifyUserAtom)
        return
    }
    let storeUser: UserState = { name: "", roles: [], userSessionId:"", permissions: new Map() }
    try {
        localStorage.setItem("user", JSON.stringify({ name, roles, userSessionId, permissions }))
        storeUser = { name, roles, userSessionId, permissions: permissionsToMap(permissions) }
        set(newEventSourceAtom)
        set(userAtomPrivate, storeUser)
    } catch (e) {
        storeUser = { name: "", roles: [], userSessionId:"", permissions: new Map() }
        set(userAtomPrivate, storeUser)
        set(closeEventSourceAtom)
    }
}
)

export const verifyUserAtom = atom(null, async (get: Getter, set: Setter) => {
    const result = await fetchGetData<UserLoginResult>(`${API_ROUTE}${USERS_ROUTE}${VERIFY_ROUTE}`)
    if (!result.success) {
        set(userAtom, { name: "", roles: [], userSessionId: "", permissions: [] })
        return
    }
    set(userAtom, {name: result.data[0].name, roles: result.data[0].roles, userSessionId: result.data[0].userSessionId, permissions: result.data[0].permissions || [] })
})


export const logoutAtom = atom(null, async (get: Getter, set: Setter) => {
    set(closeEventSourceAtom)
    set(userAtom, { name: "", roles: [], userSessionId: "", permissions: [] })
    localStorage.setItem('combiState', "")
    fetchData(`${API_ROUTE}${USERS_ROUTE}/logout`, "POST", "")
})

export const logoutUser = async (userSessionId: string) => {
    await fetchData(`${API_ROUTE}${USERS_ROUTE}/logoutUser`, "POST", JSON.stringify({ userSessionId }))
}


export function getInitialUser(): UserState {
    let storeUser
    try {
        storeUser = JSON.parse(localStorage.getItem("user") || "")
    }
    finally {
        const user = {
            name: storeUser?.name || "",
            roles: storeUser?.roles || [],
            userSessionId: storeUser?.userSessionId || "",
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