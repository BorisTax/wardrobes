import { Result } from "../../types/server"
import { IPermissionService, IPermissionServiceProvider } from "../../types/services"
import { PERMISSIONS_SCHEMA, Permissions, RESOURCE, Resource } from "../../types/user"

export class PermissionService implements IPermissionService {
    provider: IPermissionServiceProvider
    constructor(provider: IPermissionServiceProvider) {
        this.provider = provider
    }

    async getPermissions(role: string): Promise<Result<PERMISSIONS_SCHEMA[]>> {
        return this.provider.getPermissions(role)
    }
    async addPermissions(role: string, resource: RESOURCE, permissions: Permissions): Promise<Result<null>> {
        return this.provider.addPermissions(role, resource, permissions)
    }
    async deletePermissions(role: string, resource: RESOURCE): Promise<Result<null>> {
        return this.provider.deletePermissions(role, resource)
    }
    async updatePermissions(role: string, resource: RESOURCE, permissions: Permissions): Promise<Result<null>> {
        return this.provider.updatePermissions(role, resource, permissions)
    }
    async getResourceList(): Promise<Result<Resource>>{
        return this.provider.getResourceList()
    }
}

