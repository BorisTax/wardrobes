import { SpecificationItem } from "./specification"
import { ExtMaterial, ExtNewMaterial, NewProfile, Profile } from "./materials"
import { SpecificationData, Result, Token, PriceData, ExtMaterialQuery } from "./server"
import { PERMISSIONS_SCHEMA, Resource, User } from "./user"
import { NewTemplate, Template } from "./templates"
import { DETAIL_NAME, SpecificationMultiResult, WARDROBE_KIND, WardrobeData, WardrobeDetailTable } from "./wardrobe"
import { DVPTableSchema, WardrobeDetailSchema, WardrobeFurnitureTableSchema, WardrobeTableSchema } from "./schemas"
import { Permissions, RESOURCE, UserRole } from "./user"

interface IUserAbstractService {
    getUsers: () => Promise<Result<User[]>>
    getUser: (token: string) => Promise<Result<User[]>>
    getTokens: () => Promise<Result<Token[]>>
    getToken: (token: string) => Promise<Result<Token[]>>
    addToken: ({ token, username, time, lastActionTime }: Token) => Promise<Result<null>>
    updateToken: (token: string, lastActionTime: number) => Promise<Result<null>>
    deleteToken: (token: string) => Promise<Result<null>>
    clearAllTokens: () => Promise<Result<null>>
    registerUser: (userName: string, password: string, role: UserRole) => Promise<Result<null>>
    deleteUser: (user: User) => Promise<Result<null>>
    getPermissions: (role: string, resource: RESOURCE) => Promise<Permissions>
    getAllUserPermissions: (role: string) => Promise<PERMISSIONS_SCHEMA[]>
    getAllPermissions: () => Promise<PERMISSIONS_SCHEMA[]>
    getUserRole: (username: string) => Promise<string>
    getRoles: () => Promise<Result<UserRole[]>>
    addRole: (role: string) => Promise<Result<null>>
    deleteRole: (role: string) => Promise<Result<null>>
    getSuperUsers: () => Promise<Result<{ name: string }[]>>
    getSuperRoles: () => Promise<Result<{ name: string }[]>>
}
export interface IMaterialService {
    getExtMaterials: (matQuery: ExtMaterialQuery) => Promise<Result<ExtMaterial[]>>
    addExtMaterial: ({ }: ExtMaterial) => Promise<Result<null>>
    updateExtMaterial: ({ }: ExtNewMaterial) => Promise<Result<null>>
    deleteExtMaterial: (name: string, base: string) => Promise<Result<null>>
    getProfiles: () => Promise<Result<Profile[]>>
    addProfile: ({ }: Profile) => Promise<Result<null>>
    deleteProfile: (name: string, type: string) => Promise<Result<null>>
    updateProfile: ({ }: NewProfile) => Promise<Result<null>>
}
export interface IMaterialExtService<T> {
    getExtData: () => Promise<Result<T[]>>
    addExtData: ({ }: T) => Promise<Result<null>>
    deleteExtData: (name: string) => Promise<Result<null>>
    updateExtData: ({ }: T & {newName: string}) => Promise<Result<null>>
}
interface ITemplateAbstractService {
    getTemplates: (table: string) => Promise<Result<Template[]>>
    addTemplate: (table: string, { }: Template) => Promise<Result<null>>
    deleteTemplate: (table: string, name: string) => Promise<Result<null>>
    updateTemplate: (table: string, { }: NewTemplate) => Promise<Result<null>>
}
interface IPriceAbstractService {
    getPriceList: () => Promise<Result<PriceData[]>>
    updatePriceList: (item: PriceData) => Promise<Result<null>>
}
export interface ISpecificationAbstractService {
    getSpecList: () => Promise<Result<SpecificationData[]>>
    updateSpecList: (item: SpecificationData) => Promise<Result<null>>
    getDetailTable: ({ kind, detailName }: { kind: WARDROBE_KIND, detailName?: DETAIL_NAME }) => Promise<Result<WardrobeDetailTable[]>>
    getDetail: (kind: WARDROBE_KIND, name: DETAIL_NAME, width: number, height: number) => Promise<WardrobeDetailTable | null>
    getFurnitureTable: ({ kind, item }: { kind: WARDROBE_KIND, item?: SpecificationItem }) => Promise<Result<WardrobeFurnitureTableSchema[]>>
    getFurniture: (kind: WARDROBE_KIND, name: SpecificationItem, width: number, height: number, depth: number) => Promise<WardrobeFurnitureTableSchema | null>
    getDVPTemplates: () => Promise<Result<DVPTableSchema[]>>
    getDetailNames: () => Promise<Result<WardrobeDetailSchema[]>>
    getWardobeKinds: ()=> Promise<Result<WardrobeTableSchema[]>>
}
interface IPermissionAbstractService {
    getPermissions: (role: string) => Promise<Result<PERMISSIONS_SCHEMA[]>>
    addPermissions: (role: string, resource: RESOURCE, permissions: Permissions) => Promise<Result<null>>
    deletePermissions: (role: string, resource: RESOURCE) => Promise<Result<null>>
    updatePermissions: (role: string, resource: RESOURCE, permissions: Permissions) => Promise<Result<null>>
    getResourceList: () => Promise<Result<Resource>>
}
export interface IMaterialServiceProvider extends IMaterialService {
    dbFile: string
}
export interface IMaterialExtServiceProvider<T> {
    service: IMaterialExtService<T>
    dbFile: string
}
export interface ITemplateServiceProvider extends ITemplateAbstractService {
    dbFile: string
}
export interface ITemplateService extends ITemplateAbstractService {
    provider: ITemplateServiceProvider
}
export interface IUserServiceProvider extends IUserAbstractService {
    dbFile: string
}
export interface IUserService extends IUserAbstractService {
    provider: IUserServiceProvider
}

export interface IPriceServiceProvider extends IPriceAbstractService {
    dbFile: string
}
export interface IPriceService extends IPriceAbstractService {
    provider: IPriceServiceProvider
}

export interface ISpecificationServiceProvider extends ISpecificationAbstractService {
    dbFile: string
}
export interface ISpecificationService extends ISpecificationAbstractService {
    provider: ISpecificationServiceProvider
}

export interface IPermissionServiceProvider extends IPermissionAbstractService {
    dbFile: string
}
export interface IPermissionService extends IPermissionAbstractService {
    provider: IPermissionServiceProvider
}