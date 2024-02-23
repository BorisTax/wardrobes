import { UserRoles } from "../types/server.js";
import { FetchResult, fetchGetData } from "./fetch.js";

export function isClientAtLeast(role: UserRoles): boolean {
    return isManagerAtLeast(role) || role === UserRoles.CLIENT
}
export function isManagerAtLeast(role: UserRoles): boolean {
    return isAdminAtLeast(role) || role === UserRoles.MANAGER
}
export function isAdminAtLeast(role: UserRoles): boolean {
    return isSuperAdminAtLeast(role) || role === UserRoles.ADMIN
}
export function isSuperAdminAtLeast(role: UserRoles): boolean {
    return role === UserRoles.SUPERADMIN
}

export async function waitForMessageFromServer(token:string, onMessage: (message: string, data: string) => boolean) {
    const result: FetchResult = await fetchGetData(`api/users/events?token=${token}`)
    if (result.success) {
        if (onMessage(result.message as string, result.data as string)) return
    }
    await waitForMessageFromServer(token, onMessage)
}

export function timeToString(time: number): string{
    const seconds = Math.floor(time / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    return `${pad(hours)}:${pad(minutes % 60)}:${pad(seconds % 60)}`
} 

export function dateToString(date: Date): string{
    return `${pad(date.getDate())}-${pad(date.getMonth())}-${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
} 

function pad(num: number) {
    const s = num.toString();
    return (s.length < 2) ? "0" + s : s
}