import { atom, Setter, Getter } from "jotai"
import { jwtDecode } from 'jwt-decode'
import { fetchData, fetchGetData } from "../functions/fetch"
import { PERMISSIONS_SCHEMA, UserPermissions, RESOURCE, UserData, UserLoginResult, UserRole } from "../types/user"
import { closeEventSourceAtom, newEventSourceAtom } from "./serverEvents"
import { API_ROUTE, USERS_ROUTE, VERIFY_ROUTE } from "../types/routes"
import { loadAllDataAtom } from "./storage"
import { loadInitialCombiStateAtom } from "./app"


export type UserState = {
    name: string
    roleId: number
    token: string
    permissions: Map<RESOURCE, UserPermissions>
}
export type ActiveUserState = UserState & {
    time: number
    lastActionTime: number
}
export const userRolesAtom = atom<UserRole[]>([])
export const loadUserRolesAtom = atom(null, async (get,set)=>{
    const { token, permissions } = get(userAtom)
    const perm = permissions.get(RESOURCE.USERS)
    if (!perm?.Read) return
    const result = await fetchGetData(`${API_ROUTE}/users/roles?token=${token}`)
    if(result.success){
        set(userRolesAtom, result.data as UserRole[])
    }
})

export const allUsersAtom = atom<UserData[]>([])
export const activeUsersAtom = atom<ActiveUserState[]>([])
export const loadUsersAtom = atom(null, async (get, set) => {
    const { token, permissions } = get(userAtom)
    const perm = permissions.get(RESOURCE.USERS)
    if (!perm?.Read) return
    const result = await fetchGetData(`${API_ROUTE}/users/users?token=${token}`)
    if (result.success) {
        set(allUsersAtom, result.data as UserData[])
    }
})
export const loadActiveUsersAtom = atom(null, async (get, set) => {
    const { token, permissions } = get(userAtom)
    if (!permissions.get(RESOURCE.USERS)?.Read) return
    const result = await fetchGetData(`${API_ROUTE}/users/active?token=${token}`)
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
    let storeUser: UserState = { name: "", roleId: 0, token: "", permissions: getInitialPermissions() }
    const prevToken = get(userAtomPrivate).token
    try {
        const { name, roleId } = jwtDecode(token) as UserState
        storeUser = { name, roleId, token, permissions: permissionsToMap(permissions) }
        set(newEventSourceAtom, token)
        set(userAtomPrivate, storeUser)
        localStorage.setItem('token', storeUser.token)
    } catch (e) {
        storeUser = { name: "", roleId: 0, token: "", permissions: getInitialPermissions() }
        localStorage.removeItem("token")
        set(userAtomPrivate, getInitialUser())
        set(closeEventSourceAtom)
    }
    set(loadAllDataAtom, token, storeUser.permissions)
    set(loadInitialCombiStateAtom)
    if (storeUser.permissions.get(RESOURCE.USERS)?.Read) { set(loadUserRolesAtom) }
    set(setTimerAtom)
}
)

export const verifyUserAtom = atom(null, async (get: Getter, set: Setter) => {
    const { token } = get(userAtom)
    const result = await fetchGetData<{token: string, permissions: PERMISSIONS_SCHEMA[]}>(`${API_ROUTE}${USERS_ROUTE}${VERIFY_ROUTE}?token=${token}`)
    if (!result.success) {
        localStorage.removeItem("token")
        set(userAtom, { token: "", permissions: [] })
        return
    }
    set(userAtom, { token, permissions: result.data[0].permissions || [] })
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
    fetchData(`${API_ROUTE}${USERS_ROUTE}/logout`, "POST", JSON.stringify({ token: user.token }))
    set(userAtom, { token: "", permissions: [] })
    set(closeEventSourceAtom)
})
export const logoutUserAtom = atom(null, async (get: Getter, set: Setter, usertoken: string) => {
    const user = get(userAtom)
    await fetchData(`${API_ROUTE}${USERS_ROUTE}/logoutUser`, "POST", JSON.stringify({ token: user.token, usertoken }))
    set(loadActiveUsersAtom)
})

export const createUserAtom = atom(null, async (get: Getter, set: Setter, name: string, password: string, roleId: number) => {
    const {token} = get(userAtom)
    const result = await fetchData(`${API_ROUTE}${USERS_ROUTE}/add`, "POST", JSON.stringify({ name, password, roleId, token }))
    if (result.success) set(loadUsersAtom)
    return { success: result.success as boolean, message: result.message  as string }
})
export const updateUserAtom = atom(null, async (get: Getter, set: Setter, name: string, password: string, roleId: number) => {
    const {token} = get(userAtom)
    const result = await fetchData(`${API_ROUTE}${USERS_ROUTE}/update`, "POST", JSON.stringify({ name, password, roleId, token }))
    if (result.success) set(loadUsersAtom)
    return { success: result.success as boolean, message: result.message  as string }
})
export const deleteUserAtom = atom(null, async (get: Getter, set: Setter, name: string) => {
    const {token} = get(userAtom)
    const result = await fetchData(`${API_ROUTE}${USERS_ROUTE}/delete`, "DELETE", JSON.stringify({ name, token }))
    if (result.success) {
        set(loadUsersAtom)
        set(loadActiveUsersAtom)
    }
    return{ success: result.success as boolean, message: result.message  as string }
})

export const createRoleAtom = atom(null, async (get: Getter, set: Setter, { name }: { name: string }) => {
    const {token} = get(userAtom)
    const result = await fetchData(`${API_ROUTE}${USERS_ROUTE}/addRole`, "POST", JSON.stringify({ name, token }))
    if (result.success) set(loadUserRolesAtom)
    return {success: result.success, message: result.message}
})

export const deleteRoleAtom = atom(null, async (get: Getter, set: Setter, { id }: { id: number}) => {
    const {token} = get(userAtom)
    const result = await fetchData(`${API_ROUTE}${USERS_ROUTE}/deleteRole`, "DELETE", JSON.stringify({ id, token }))
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
            roleId: 0,
            token,
            permissions: getInitialPermissions()
        }
    }
    const user = {
        name: storeUser.name,
        roleId: storeUser.roleId,
        token,
        permissions: new Map(storeUser.permissions)
    }
    return user
}

export function getInitialPermissions(): Map<RESOURCE, UserPermissions> {
    const m = new Map<RESOURCE, UserPermissions>()
    Object.keys(RESOURCE).forEach(k => m.set(k as RESOURCE, { Create: false, Update: false, Read: false, Delete: false }))
    return m
}

export function permissionsToMap(permissions: PERMISSIONS_SCHEMA[]): Map<RESOURCE, UserPermissions> {
    const m = new Map<RESOURCE, UserPermissions>()
    permissions.forEach(p => {
        m.set(p.resource, { Create: !!p.create, Read: !!p.read, Update: !!p.update, Delete: !!p.delete })
    })
    return m
}