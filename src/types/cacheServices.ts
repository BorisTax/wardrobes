import { Result, Token } from "./server"
import { IUserServiceProvider } from "./services"
import { PERMISSIONS_SCHEMA, RESOURCE, User, UserRole } from "./user"

export class UserCacheService {
    private provider: IUserServiceProvider
    private users: User[] = []
    private tokens: Token[] = []
    private permissions: PERMISSIONS_SCHEMA[] = []
    private roles: UserRole[] = []
    private superusers: {name: string}[] = []
    private superroles: {name: string}[] = []
    constructor(provider: IUserServiceProvider) {
        this.provider = provider
    }
    async getUsers() {
        if (this.users.length === 0) {
            this.users = (await this.provider.getUsers()).data || []
        }
        return this.users;
    }
    async getTokens() {
        if (this.tokens.length === 0) {
            this.tokens = (await this.provider.getTokens()).data || []
        }
        return this.tokens;
    }
    async getPermissions(role: string, resource: RESOURCE) {
        if (this.permissions.length === 0) {
            this.permissions = await this.provider.getAllPermissions() || []
        }
        return this.permissions.find(p => p.role === role && p.resource === resource);
    }
    async getAllUserPermissions(role: string) {
        if (this.permissions.length === 0) {
            this.permissions = await this.provider.getAllPermissions() || []
        }
        return this.permissions.filter(p => p.role === role);
    }
    async getUserRole (username: string) {
        
    }
    getRoles(){}
    getSuperUsers(){}
    getSuperRoles(){}
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
    getFurnitureTable: ({ kind, item }: { kind: WARDROBE_KIND, item?: SpecificationItem }) => Promise<Result<WardrobeFurnitureTableSchema[]>>
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
