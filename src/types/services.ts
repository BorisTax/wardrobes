import { ExtMaterial, ExtNewMaterial } from "./materials"
import { Results, User } from "./server"
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
    addExtMaterial: ({ name, material, imageurl, code }: ExtMaterial) => Promise<Results>
    updateExtMaterial: ({ name, material, newName, imageurl, code }: ExtNewMaterial) => Promise<Results>
    deleteExtMaterial: (name: string, base: string) => Promise<Results>
    getProfiles: () => Promise<Results>
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