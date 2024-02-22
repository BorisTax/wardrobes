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

export async function waitForMessageFromServer(onMessage: (message: string) => boolean) {
    const result: FetchResult = await fetchGetData(`api/users/events`)
    if (result.success) {
        if(onMessage(result.data as string)) return
    }
    await waitForMessageFromServer(onMessage)
}