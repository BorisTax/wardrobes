import { getInitialUser } from "../reducers/userReducer"

export const SET_USER = "SET_USER"

export function logoutUser() {
    localStorage.removeItem("user")
    return {
        type: SET_USER,
        payload: getInitialUser()
    }
}
export function setUser(user: { name: string, role: string, token: string }) {
    return {
        type: SET_USER,
        payload: user
    }
}