import { Result, Token } from "./server"
import { PermissionSchema, RESOURCE, ResourceSchema, User, UserAction, UserPermissions } from "./user"
import { DataBaseSelectOptions, KeySet, TABLE_NAMES } from "./schemas"
import { UserRole } from "./user"
import { SettingsThemeSchema } from "./themes"

export interface IUserService {
    getUsers: () => Promise<Result<User>>
    getUser: (token: string) => Promise<User>
    getTokens: () => Promise<Result<Token>>
    getToken: (token: string) => Promise<Result<Token>>
    getTokenByUserId: (userId: string) => Promise<Token>
    addToken: ({ token, userName, userId, time, lastActionTime }: Token) => Promise<Result<null>>
    updateToken: (token: string, lastActionTime: number) => Promise<Result<null>>
    deleteToken: (token: string) => Promise<Result<null>>
    clearAllTokens: () => Promise<Result<null>>
    registerUser: (userName: string, password: string, roleId: number) => Promise<Result<null>>
    updateUser: ({ userName, password, roleId }: { userName: string, password?: string, roleId?: number }) => Promise<Result<null>>
    deleteUser: (user: User) => Promise<Result<null>>
    getUserRoleId: (username: string) => Promise<number>
    getRoles: () => Promise<Result<UserRole>>
    addRole: (name: string) => Promise<Result<null>>
    deleteRole: (id: number) => Promise<Result<null>>
    getSuperUsers: () => Promise<Result<{ name: string }>>
    getSuperRoles: () => Promise<Result<{ roleId: number }>>
    dispatchUserAction: (userName: string, action: string) => Promise<Result<null>>
    getUserActions: () => Promise<Result<UserAction>>
    clearUserActions: () => Promise<Result<null>>
}

export interface IDataBaseService<T> {
    getData: (table: TABLE_NAMES, columns: KeySet<T>, conditions: Partial<T>, options?: DataBaseSelectOptions<T>) => Promise<Result<T>>
    addData: (table: TABLE_NAMES, data: Partial<T>) => Promise<Result<T>>
    deleteData: (table: TABLE_NAMES, lookIn: Partial<T> ) => Promise<Result<null>>
    updateData: (table: TABLE_NAMES, lookIn: Partial<T>, update: Partial<T>) => Promise<Result<null>>
    clearData: (table: TABLE_NAMES) => Promise<Result<null>>
}

export interface IPermissionService {
    getAllPermissions: () => Promise<Result<PermissionSchema>>
    getAllRolePermissions: (roleId: number) => Promise<Result<PermissionSchema>>
    getPermissions: (roleId: number, resourceId: RESOURCE) => Promise<Result<PermissionSchema>>
    addPermissions: (roleId: number, resource: RESOURCE, permissions: UserPermissions) => Promise<Result<null>>
    deletePermissions: (roleId: number, resource: RESOURCE) => Promise<Result<null>>
    updatePermissions: (roleId: number, resource: RESOURCE, permissions: UserPermissions) => Promise<Result<null>>
    getResourceList: () => Promise<Result<ResourceSchema>>
}

export interface ISettingsService {
    getThemes: () => Promise<Result<SettingsThemeSchema>>
    setTheme: (id: number) => Promise<Result<null>>
}

