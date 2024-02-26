import { UserRoles } from "../types/server.js";
export function isClientAtLeast(role: UserRoles): boolean {
    return isManagerAtLeast(role) || role === UserRoles.CLIENT
}
export function isManagerAtLeast(role: UserRoles): boolean {
    return isEditorAtLeast(role) || role === UserRoles.MANAGER
}
export function isEditorAtLeast(role: UserRoles): boolean {
    return isAdminAtLeast(role) || role === UserRoles.EDITOR
}
export function isAdminAtLeast(role: UserRoles): boolean {
    return role === UserRoles.ADMIN
}