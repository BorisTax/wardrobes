import { atom, Setter, Getter } from "jotai"
import { jwtDecode } from 'jwt-decode'
import { fetchData, fetchGetData } from "../functions/fetch"
import { PERMISSIONS_SCHEMA, Permissions, RESOURCE, UserData, UserRole } from "../types/user"
import { loadPriceListAtom } from "./prices"
import { AtomCallbackResult } from "../types/atoms"


export type UserState = {
    name: string
    role: UserRole
    token: string
    permissions: Map<RESOURCE, Permissions>
}
export type ActiveUserState = UserState & {
    time: number
    lastActionTime: number
}
export const userRolesAtom = atom<UserRole[]>([])
export const loadUserRolesAtom = atom(null, async (get,set)=>{
    const { token, permissions } = get(userAtom)
    const perm = permissions.get(RESOURCE.USERS)
    if (!perm?.read) return
    const result = await fetchGetData(`/api/users/roles?token=${token}`)
    if(result.success){
        set(userRolesAtom, result.data as UserRole[])
    }
})

export const allUsersAtom = atom<UserData[]>([])
export const activeUsersAtom = atom<ActiveUserState[]>([])
export const loadUsersAtom = atom(null, async (get, set) => {
    const { token, permissions } = get(userAtom)
    const perm = permissions.get(RESOURCE.USERS)
    if (!perm?.read) return
    const result = await fetchGetData(`/api/users/users?token=${token}`)
    if (result.success) {
        set(allUsersAtom, result.data as UserData[])
    }
})
export const loadActiveUsersAtom = atom(null, async (get, set) => {
    const { token, permissions } = get(userAtom)
    if (!permissions.get(RESOURCE.USERS)?.read) return
    const result = await fetchGetData(`/api/users/active?token=${token}`)
    if(result.success){
        set(activeUsersAtom, result.data as ActiveUserState[])
    }
})

const userAtomPrivate = atom(getInitialUser())
export const userAtom = atom(get => get(userAtomPrivate), async (get: Getter, set: Setter, token: string, verify = false) => {
    if (verify) {
        const result = await fetchGetData(`/api/users/verify?token=${token}`)
        if (!result.success) {
            localStorage.removeItem("token")
            set(userAtomPrivate, getInitialUser())
            return
        }
    }
    let storeUser: UserState = { name: "", role: { name: "" }, token: "", permissions: getInitialPermissions() }
    try {
        const { name, role, permissions } = jwtDecode(token) as UserState & { permissions: PERMISSIONS_SCHEMA[] }
        storeUser = { name, role, token, permissions }
        storeUser.permissions = permissionsToMap(permissions)
        set(userAtomPrivate, storeUser)
        localStorage.setItem('token', storeUser.token)
    } catch (e) {
        storeUser = { name: "", role: { name: "" }, token: "", permissions: getInitialPermissions() }
        localStorage.removeItem("token")
        set(userAtomPrivate, getInitialUser())
    }
    const p = storeUser.permissions.get(RESOURCE.PRICES)
    if (p?.read) set(loadPriceListAtom)
}
)

export const verifyUserAtom = atom(null, async (get: Getter, set: Setter) => {
    const { token } = get(userAtom)
        const result = await fetchGetData(`/api/users/verify?token=${token}`)
        if (!result.success) {
            localStorage.removeItem("token")
            set(userAtom, "")
            return
        }
    set(userAtom, token)
})
export const standbyUserAtom = atom(null, async (get: Getter, set: Setter) => {
    const { token } = get(userAtom)
    const result = await fetchGetData(`/api/users/standby?token=${token}`)
})


export const logoutAtom = atom(null, async (get: Getter, set: Setter) => {
    localStorage.removeItem("token")
    const user = get(userAtom)
    fetchData('/api/users/logout', "POST", JSON.stringify({ token: user.token }))
    set(userAtom, "")
})
export const logoutUserAtom = atom(null, async (get: Getter, set: Setter, usertoken: string) => {
    const user = get(userAtom)
    await fetchData('/api/users/logoutUser', "POST", JSON.stringify({ token: user.token, usertoken }))
    set(loadActiveUsersAtom)
})

export const createUserAtom = atom(null, async (get: Getter, set: Setter, { name, password, role }: { name: string, password: string, role: UserRole }, callback: AtomCallbackResult) => {
    const {token} = get(userAtom)
    const result = await fetchData('/api/users/add', "POST", JSON.stringify({ name, password, role, token }))
    if (result.success) set(loadUsersAtom)
    callback({ success: result.success as boolean, message: result.message  as string })
})
export const deleteUserAtom = atom(null, async (get: Getter, set: Setter, { name }: { name: string}, callback: AtomCallbackResult) => {
    const {token} = get(userAtom)
    const result = await fetchData('/api/users/delete', "DELETE", JSON.stringify({ name, token }))
    if (result.success) {
        set(loadUsersAtom)
        set(loadActiveUsersAtom)
    }
    callback({ success: result.success as boolean, message: result.message  as string })
})

export const createRoleAtom = atom(null, async (get: Getter, set: Setter, { name }: { name: string }) => {
    const {token} = get(userAtom)
    const result = await fetchData('/api/users/addRole', "POST", JSON.stringify({ name, token }))
    if (result.success) set(loadUserRolesAtom)
    return {success: result.success, message: result.message}
})

export const deleteRoleAtom = atom(null, async (get: Getter, set: Setter, { name }: { name: string}) => {
    const {token} = get(userAtom)
    const result = await fetchData('/api/users/deleteRole', "DELETE", JSON.stringify({ name, token }))
    if (result.success) {
        set(loadUserRolesAtom)
    }
    return {success: result.success, message: result.message}
})

export function getInitialUser(): UserState {
    const token = localStorage.getItem("token") || ""
    let storeUser: UserState
    try {
        storeUser = jwtDecode(token) as UserState
    } catch (e) {
        storeUser = {
            name: "",
            role: { name: "" },
            token,
            permissions: getInitialPermissions()
        }
    }
    const user = {
        name: storeUser.name,
        role: storeUser.role,
        token,
        permissions: new Map(storeUser.permissions)
    }
    return user
}

export function getInitialPermissions(): Map<RESOURCE, Permissions> {
    const m = new Map<RESOURCE, Permissions>()
    Object.keys(RESOURCE).forEach(k => m.set(k as RESOURCE, { create: false, update: false, read: false, remove: false }))
    return m
}

export function permissionsToMap(permissions: PERMISSIONS_SCHEMA[]): Map<RESOURCE, Permissions> {
    const m = new Map<RESOURCE, Permissions>()
    permissions.forEach(p => {
        m.set(p.resource, { create: !!p.create, read: !!p.read, update: !!p.update, remove: !!p.remove })
    })
    return m
}