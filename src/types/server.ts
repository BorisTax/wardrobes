import { Request } from "express"
export type Token = {
    token: string
    username: string
    time: number
}
export type RequestBody = {
    token?: string
    name?: string
    password?: string
}
export interface MyRequest extends Request {
    userRole?: string
    files?: { image: { path: string } }
}
export type User = {
    name: string
    role: string
    password: string
}
export enum UserRoles {
    SUPERADMIN = 'SUPERADMIN',
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
}
export type ActiveUser = {
    name: string
    role: string
    token: string
    time: number
}
export type Result<T> = {
    success: boolean
    token?: string
    message?: string
    data?: T
    error?: Error
}
