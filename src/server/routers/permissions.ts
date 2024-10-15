import messages from '../messages.js'
import express from "express";
import { accessDenied } from '../functions/database.js';
import { MyRequest } from '../../types/server.js';
import { PERMISSION, PERMISSIONS_SCHEMA, UserPermissions, RESOURCE } from "../../types/user.js";
import { permissionServiceProvider } from '../options.js';
import { hasPermission } from './users.js';
import { PermissionService } from '../services/permissionService.js';
import { StatusCodes } from 'http-status-codes';
import { RESOURCES_ROUTE } from '../../types/routes.js';

const router = express.Router();
export default router

router.get("/", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getPermissions(+(req.query.roleId as string));
  if (!result.success) return res.json(result)
  res.status(result.status).json(result);
});
router.get(RESOURCES_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getResourceList();
  if (!result.success) return res.json(result)
  res.status(result.status).json(result);
});

router.delete("/", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.DELETE]))) return accessDenied(res)
  const { roleId, resource } = req.body
  let result
  result = await deletePermissions(roleId, resource);
  const status = result.success ? StatusCodes.OK : StatusCodes.NOT_FOUND
  res.status(status).json(result);  
});

router.post("/", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.CREATE]))) return accessDenied(res)
  const { roleId, resource, permissions } = req.body
  const result = await addPermissions(roleId, resource, permissions);
  const status = result.success ? StatusCodes.CREATED : StatusCodes.CONFLICT
  res.status(status).json(result);
});

router.put("/", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.UPDATE]))) return accessDenied(res)
  const { roleId, resource, permissions } = req.body
  const result = await updatePermissions(roleId, resource, permissions);
  res.status(result.status).json(result);
});

export async function getPermissions(roleId: number) {
  const service = new PermissionService(permissionServiceProvider)
  return await service.getPermissions(roleId)
}
export async function getResourceList() {
  const service = new PermissionService(permissionServiceProvider)
  return await service.getResourceList()
}
export async function addPermissions(roleId: number, resource: RESOURCE, permissions: UserPermissions) {
  const service = new PermissionService(permissionServiceProvider)
  const result = await service.getPermissions(roleId)
  if (!result.success) return result
  const list = result.data
  if ((list as PERMISSIONS_SCHEMA[]).find(m => m.roleId === roleId && m.resource === resource)) return { success: false, status: StatusCodes.CONFLICT, message: messages.PERMISSION_EXIST }
  return await service.addPermissions(roleId, resource, permissions)
}

export async function updatePermissions(roleId: number, resource: RESOURCE, permissions: UserPermissions) {
  const service = new PermissionService(permissionServiceProvider)
  const result = await service.getPermissions(roleId)
  if (!result.success) return result
  const list = result.data
  if (!(list as PERMISSIONS_SCHEMA[]).find(m => m.roleId === roleId && m.resource === resource)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.PERMISSION_NO_EXIST }
  return await service.updatePermissions(roleId, resource, permissions)
}

export async function deletePermissions(roleId: number, resource: RESOURCE) {
  const service = new PermissionService(permissionServiceProvider)
  const result = await service.getPermissions(roleId)
  if (!result.success) return result
  const list = result.data
  if (!(list as PERMISSIONS_SCHEMA[]).find(m => m.roleId === roleId && m.resource === resource)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.PERMISSION_NO_EXIST }
  return await service.deletePermissions(roleId, resource)
}