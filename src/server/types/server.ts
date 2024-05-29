import { Request } from "express"
import { ExtMaterial, Profile } from "./materials"
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
    token?: string
}
export type User = {
    name: string
    role: string
    password: string
}
export enum UserRoles {
    ADMIN = 'ADMIN',
    EDITOR = 'EDITOR',
    MANAGER = 'MANAGER',
    CLIENT = 'CLIENT',
    ANONYM = 'ANONYM'
}
export type ActiveUser = {
    name: string
    role: string
    token: string
    time: number
}

export enum TableFields {
    NAME = 'name',
    DATA = 'data',
    MATERIAL = 'material',
    IMAGE = 'image',
    CODE = 'code',
    BRUSH = 'brush',
    TOKEN = 'token',
    NEWNAME = 'newName',
    TYPE = 'type',
    DSP = 'dsp',
    CAPTION = 'caption',
    ID = 'id',
    PRICE = 'price',
    MARKUP = 'markup',
    TABLE = 'table',
}

export type PriceListItem = {
    name: string
    caption?: string
    units?: string
    price?: number
    id?: string
    code?: string
    markup?: number
}

export type Result<T> = {
    success: boolean
    status: number
    token?: string
    message?: string
    data?: T
    error?: Error
}

export type Results = Result<null> |
    Result<ExtMaterial[]> |
    Result<Profile[]> |
    Result<User[]> |
    Result<Token[]> |
    Result<PriceListItem[]> |
    Result<string>