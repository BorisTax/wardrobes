import { Request } from "express"
import { SpecItem } from "./specification"
import { FASAD_TYPE } from "./enums"
export type Token = {
    token: string
    userName: string
    userId: string
    time: number
    lastActionTime: number
}
export type RequestBody = {
    token?: string
    name?: string
    password?: string
}
export interface MyRequest extends Request {
    userRoleId: number
    token?: string
}
export enum TableFields {
    NAME = 'name',
    DATA = 'data',
    MATERIAL = 'material',
    IMAGE = 'image',
    CODE = 'code',
    PURPOSE = 'purpose',
    BRUSHID = 'brushId',
    TOKEN = 'token',
    TYPE = 'type',
    TYPEID = 'typeId',
    DSP = 'dsp',
    KROMKAID = 'kromkaId',
    ZAGLUSHKAID = 'zaglushkaId',
    CAPTION = 'caption',
    ID = 'id',
    DSPID = "dspId",
    COEF = 'coef',
    PRICE = 'price',
    MARKUP = 'markup',
    TABLE = 'table',
    KIND = 'kind',
    ROLEID = 'roleId',
    RESOURCE = 'resource',
    PERMISSIONS = 'permissions'
}



export type PriceData = {
    name: SpecItem
    price?: number
    markup?: number
}

export type Result<T> = {
    success: boolean
    status: number
    data: T[]
    token?: string
    message?: string
    error?: Error
}


export type ExtMaterialQuery = {
    type?: FASAD_TYPE
    name?: string
    code?: string
}

