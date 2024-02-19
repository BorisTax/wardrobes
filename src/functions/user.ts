import { UserRoles } from "../types/server";

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