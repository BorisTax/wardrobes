import { ExtMaterial, ExtNewMaterial, Profile } from "./materials"
import { Result, Token, User } from "./server"
interface IUserAbstractService {
    getUsers: () => Promise<Result<User[]>>
    getTokens: () => Promise<Result<Token[]>>
    addToken: ({ token, userName }: { token: string, userName: string }) => Promise<Result<null>>
    deleteToken: (token: string) => Promise<Result<null>>
    clearAllTokens: () => Promise<Result<null>>
    registerUser: (user: User) => Promise<Result<string>>
}
interface IMaterialAbstractService {
    getExtMaterials: () => Promise<Result<ExtMaterial[]>>
    addExtMaterial: ({ name, material, imageurl, code }: ExtMaterial) => Promise<Result<null>>
    updateExtMaterial: ({ name, material, newName, imageurl, code }: ExtNewMaterial) => Promise<Result<null>>
    deleteExtMaterial: (name: string, base: string) => Promise<Result<null>>
    getProfiles: () => Promise<Result<Profile[]>>
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