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

export const allUsersAtom = atom<UserState[]>([])
export const activeUsersAtom = atom<UserState[]>([])
export const loadUsersAtom = atom(null, async (get,set)=>{
    const {token} = get(userAtom)
    const result = await fetchGetData(`api/users/users?token=${token}`)
    if(result.success){
        set(allUsersAtom, result.data)
    }
})
export const loadActiveUsersAtom = atom(null, async (get,set)=>{
    const {token} = get(userAtom)
    const result = await fetchGetData(`api/users/active?token=${token}`)
    if(result.success){
        set(allUsersAtom, result.data)
    }
})

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
export const logoutAtom = atom(null, async (get: Getter, set: Setter) => {
    localStorage.removeItem("token")
    const user = get(userAtom)
    try {
        fetchData('api/users/logout', "POST", JSON.stringify({ token: user.token }))
    } catch (e) { console.error(e) }
    set(userAtom, getInitialUser())
})
export const logoutUserAtom = atom(null, async (get: Getter, set: Setter, usertoken:string) => {
    const user = get(userAtom)
    try {
        await fetchData('api/users/logoutUser', "POST", JSON.stringify({ token: user.token, usertoken }))
        set(loadActiveUsersAtom)
    } catch (e) { console.error(e) }

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
