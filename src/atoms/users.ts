import { atom, Setter, Getter } from "jotai"
import { jwtDecode } from 'jwt-decode'
import { fetchData, fetchGetData } from "../functions/fetch"
import { PERMISSIONS_SCHEMA, Permissions, RESOURCE, UserData, UserLoginResult, UserRole } from "../types/user"
import { loadMaterialListAtom } from "./materials/materials"
import { loadProfileListAtom } from "./materials/profiles"
import { loadEdgeListAtom } from "./materials/edges"
import { loadBrushListAtom } from "./materials/brush"
import { loadTrempelListAtom } from "./materials/trempel"
import { loadZaglushkaListAtom } from "./materials/zaglushka"
import { loadUplotnitelListAtom } from "./materials/uplotnitel"
import { loadSpecificationListAtom } from "./specification"
import { closeEventSourceAtom, newEventSourceAtom } from "./serverEvents"


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
export const userAtom = atom(get => get(userAtomPrivate), async (get: Getter, set: Setter, { token, permissions }: UserLoginResult, verify = false) => {
    if (verify) {
        set(verifyUserAtom)
        return
    }
    let storeUser: UserState = { name: "", role: { name: "" }, token: "", permissions: getInitialPermissions() }
    const prevToken = get(userAtomPrivate).token
    try {
        const { name, role } = jwtDecode(token) as UserState
        storeUser = { name, role, token, permissions: permissionsToMap(permissions) }
        set(userAtomPrivate, storeUser)
        if (token !== prevToken) {
            set(newEventSourceAtom, token)
        }
        localStorage.setItem('token', storeUser.token)
    } catch (e) {
        storeUser = { name: "", role: { name: "" }, token: "", permissions: getInitialPermissions() }
        localStorage.removeItem("token")
        set(userAtomPrivate, getInitialUser())
        set(closeEventSourceAtom)
    }
    set(loadAllDataAtom, storeUser.permissions)
}
)

export const verifyUserAtom = atom(null, async (get: Getter, set: Setter) => {
    const { token } = get(userAtom)
    const result = await fetchGetData<{token: string, permissions: PERMISSIONS_SCHEMA[]}>(`/api/users/verify?token=${token}`)
    if (!result.success) {
        localStorage.removeItem("token")
        set(userAtom, { token: "", permissions: [] })
        return
    }
    set(userAtom, { token, permissions: result.data?.permissions || [] })
    set(setTimerAtom)
})


const timerAtom = atom<NodeJS.Timeout | undefined>(undefined)
const setTimerAtom = atom(null, async (get, set) => {
    const timer = get(timerAtom)
    clearInterval(timer)
    set(timerAtom, setInterval(() => {
        set(verifyUserAtom)
    }, 300000))
})
export const logoutAtom = atom(null, async (get: Getter, set: Setter) => {
    localStorage.removeItem("token")
    const user = get(userAtom)
    fetchData('/api/users/logout', "POST", JSON.stringify({ token: user.token }))
    set(userAtom, { token: "", permissions: [] })
    set(closeEventSourceAtom)
})
export const logoutUserAtom = atom(null, async (get: Getter, set: Setter, usertoken: string) => {
    const user = get(userAtom)
    await fetchData('/api/users/logoutUser', "POST", JSON.stringify({ token: user.token, usertoken }))
    set(loadActiveUsersAtom)
})

export const createUserAtom = atom(null, async (get: Getter, set: Setter, name: string, password: string, role: UserRole) => {
    const {token} = get(userAtom)
    const result = await fetchData('/api/users/add', "POST", JSON.stringify({ name, password, role, token }))
    if (result.success) set(loadUsersAtom)
    return { success: result.success as boolean, message: result.message  as string }
})
export const updateUserAtom = atom(null, async (get: Getter, set: Setter, name: string, password: string, role: UserRole) => {
    const {token} = get(userAtom)
    const result = await fetchData('/api/users/update', "POST", JSON.stringify({ name, password, role, token }))
    if (result.success) set(loadUsersAtom)
    return { success: result.success as boolean, message: result.message  as string }
})
export const deleteUserAtom = atom(null, async (get: Getter, set: Setter, name: string) => {
    const {token} = get(userAtom)
    const result = await fetchData('/api/users/delete', "DELETE", JSON.stringify({ name, token }))
    if (result.success) {
        set(loadUsersAtom)
        set(loadActiveUsersAtom)
    }
    return{ success: result.success as boolean, message: result.message  as string }
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


export const loadAllDataAtom = atom(null, async (get, set, permissions: Map<RESOURCE, Permissions>) => {
    if (permissions.get(RESOURCE.MATERIALS)?.read) {
        set(loadMaterialListAtom)
        set(loadProfileListAtom)
        set(loadEdgeListAtom)
        set(loadBrushListAtom)
        set(loadTrempelListAtom)
        set(loadZaglushkaListAtom)
        set(loadUplotnitelListAtom)
    }
    if (permissions.get(RESOURCE.SPECIFICATION)?.read) {
        set(loadSpecificationListAtom)
    }
    if (permissions.get(RESOURCE.USERS)?.read) { set(loadUserRolesAtom) }
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