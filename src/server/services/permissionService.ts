import { Result } from "../../types/server"
import { IPermissionService, IPermissionServiceProvider } from "../../types/services"
import { PERMISSIONS_SCHEMA, UserPermissions, RESOURCE, Resource } from "../../types/user"

export class PermissionService implements IPermissionService {
    provider: IPermissionServiceProvider
    constructor(provider: IPermissionServiceProvider) {
        this.provider = provider
    }

    async getPermissions(roleId: number): Promise<Result<PERMISSIONS_SCHEMA>> {
        return this.provider.getPermissions(roleId)
    }
    async addPermissions(roleId: number, resource: RESOURCE, permissions: UserPermissions): Promise<Result<null>> {
        return this.provider.addPermissions(roleId, resource, permissions)
    }
    async deletePermissions(roleId: number, resource: RESOURCE): Promise<Result<null>> {
        return this.provider.deletePermissions(roleId, resource)
    }
    async updatePermissions(roleId: number, resource: RESOURCE, permissions: UserPermissions): Promise<Result<null>> {
        return this.provider.updatePermissions(roleId, resource, permissions)
    }
    async getResourceList(): Promise<Result<Resource>>{
        return this.provider.getResourceList()
    }
}

