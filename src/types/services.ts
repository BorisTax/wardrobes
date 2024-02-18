import { ExtMaterial, ExtNewMaterial, NewProfile, Profile } from "./materials"
import { PriceListItem, Results, User } from "./server"
interface IUserAbstractService {
    getUsers: () => Promise<Results>
    getTokens: () => Promise<Results>
    addToken: ({ token, userName }: { token: string, userName: string }) => Promise<Results>
    deleteToken: (token: string) => Promise<Results>
    clearAllTokens: () => Promise<Results>
    registerUser: (user: User) => Promise<Results>
}
interface IMaterialAbstractService {
    getExtMaterials: () => Promise<Results>
    addExtMaterial: ({ }: ExtMaterial) => Promise<Results>
    updateExtMaterial: ({ }: ExtNewMaterial) => Promise<Results>
    deleteExtMaterial: (name: string, base: string) => Promise<Results>
    getProfiles: () => Promise<Results>
    addProfile: ({ }: Profile) => Promise<Results>
    deleteProfile: (name: string, type: string) => Promise<Results>
    updateProfile: ({ }: NewProfile) => Promise<Results>
}
interface IPriceAbstractService {
    getPriceList: () => Promise<Results>
    updatePriceList: (item: PriceListItem) => Promise<Results>
}


export interface IMaterialServiceProvider extends IMaterialAbstractService {
    dbFile: string
}
export interface IMaterialService extends IMaterialAbstractService {
    provider: IMaterialServiceProvider
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