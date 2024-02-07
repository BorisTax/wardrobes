import { atom } from "jotai"

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
export const logoutUserAtom = atom(null, (get, set)=>{
    localStorage.removeItem("user")
    set(userAtom,  getInitialUser())
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
