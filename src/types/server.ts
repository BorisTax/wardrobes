import { Request } from "express"
import { SpecificationItem } from "./specification"
import { FASAD_TYPE } from "./enums"
export type Token = {
    token: string
    username: string
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
    EDGEID = 'edgeId',
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

export type SpecificationData = {
    name: SpecificationItem
    caption?: string
    units?: string
    coef?: number
    id?: string
    code?: string
    purpose?: string
}
export type PriceData = {
    name: SpecificationItem
    price?: number
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


export type ExtMaterialQuery = {
    type?: FASAD_TYPE
    name?: string
    code?: string
}

