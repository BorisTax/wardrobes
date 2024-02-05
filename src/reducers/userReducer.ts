import { SET_USER } from "../actions/UserActions"

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

export function getInitialUser(): UserState {
    const storeUser = localStorage.getItem("user")
    const user = storeUser ? JSON.parse(storeUser) : {
        name: "Гость",
        role: UserRoles.GUEST,
        token: ""
    }
    return user
}

export function userReducer(state: UserState, action: { type: string, payload?: any }) {
    switch (action.type) {
        case SET_USER:
            localStorage.setItem('user', JSON.stringify(action.payload))
            const role = action.payload.role || UserRoles.GUEST
            return { ...action.payload, role }
    }
    return state
}
