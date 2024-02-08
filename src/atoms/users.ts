import { atom, useAtom } from "jotai"
import { fetchData } from "../functions/functions"

export enum UserRoles {
    SUPERADMIN = 'SUPERADMIN',
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    GUEST = "GUEST"
}

export type UserState = {
    name: string
    role: UserRoles
    token: string
}

export const userAtom = atom(getInitialUser())
export const setUserAtom = atom(null, (get, set, user: UserState) => {
    localStorage.setItem('user', JSON.stringify(user))
    const role = user.role || UserRoles.GUEST
    set(userAtom, { ...user, role })
})
export const logoutUserAtom = atom(null, async (get, set) => {
    localStorage.removeItem("user")
    const user = get(userAtom)
    try {
        fetchData('api/logout', "POST", JSON.stringify({ token: user.token }))
    } catch (e) { console.error(e) }
    set(userAtom, getInitialUser())
})

export const testAtom = atom("")
export const setTestAtom = atom(null, (get, set, message: string) => {
    set(testAtom, message)
})

export function getInitialUser(): UserState {
    const storeUser = localStorage.getItem("user")
    const user = storeUser ? JSON.parse(storeUser) : {
        name: "Гость",
        role: UserRoles.GUEST,
        token: ""
    }
    return user
}
