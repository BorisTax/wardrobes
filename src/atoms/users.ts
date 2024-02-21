import { atom, Setter, Getter } from "jotai"
import { jwtDecode } from 'jwt-decode'
import { fetchData, fetchGetData } from "../functions/fetch"
import { UserRoles } from "../types/server"
import { isClientAtLeast } from "../functions/user"
import { loadPriceListAtom } from "./prices"

export const UserRolesCaptions = {
    [UserRoles.ANONYM]: "",
    [UserRoles.CLIENT]: "КЛИЕНТ",
    [UserRoles.MANAGER]: "МЕНЕДЖЕР",
    [UserRoles.ADMIN]: "АДМИН",
    [UserRoles.SUPERADMIN]: "СУПЕРАДМИН",
}

export type UserState = {
    name: string
    role: UserRoles
    token: string
}

export const userAtom = atom<UserState>({ name: UserRoles.ANONYM, role: UserRoles.ANONYM, token: "" })
export const setUserAtom = atom(null, async (get: Getter, set: Setter, token: string, verify = false) => {
    if (verify) {
        const result = await fetchGetData(`api/users/verify?token=${token}`)
        if(!result.success){
            set(userAtom, { name: UserRoles.ANONYM, role: UserRoles.ANONYM, token: "" })
            return
        }
    }
    let storeUser: UserState
    try {
        const { name, role } = jwtDecode(token) as UserState
        storeUser = { name, role, token }
        localStorage.setItem('token', token)
    } catch (e) {
        storeUser = { name: UserRoles.ANONYM, role: UserRoles.ANONYM, token: "" }
    }
    if (isClientAtLeast(storeUser.role)) set(loadPriceListAtom)
    set(userAtom, storeUser)
})
export const logoutUserAtom = atom(null, async (get: Getter, set: Setter) => {
    localStorage.removeItem("token")
    const user = get(userAtom)
    try {
        fetchData('api/users/logout', "POST", JSON.stringify({ token: user.token }))
    } catch (e) { console.error(e) }
    set(userAtom, getInitialUser())
})

export const testAtom = atom("")
export const setTestAtom = atom(null, (get: Getter, set: Setter, message: string) => {
    set(testAtom, message)
})

export function getInitialUser(): UserState {
    const token = localStorage.getItem("token") || ""
    let storeUser: UserState
    try {
        storeUser = jwtDecode(token) as UserState
    } catch (e) {
        storeUser = {
            name: UserRoles.ANONYM,
            role: UserRoles.ANONYM,
            token
        }
    }
    const user = {
        name: UserRolesCaptions[storeUser.role as UserRoles],
        role: storeUser.role as UserRoles,
        token
    }
    return user
}
