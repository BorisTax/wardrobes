import messages from '../messages.js'
import express from "express";
import { accessDenied } from '../functions/database.js';
import { MyRequest } from '../../types/server.js';
import { PERMISSION, PermissionSchema, RESOURCE } from "../../types/user.js";
import { getPermissionService } from '../options.js';
import { hasPermission } from './users.js';
import { StatusCodes } from 'http-status-codes';
import { RESOURCES_ROUTE } from '../../types/routes.js';

const router = express.Router();
export default router

router.get("/", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getAllUserPermissions(+(req.query.roleId as string));
  res.status(200).json({success: true, data: result});
});
router.get(RESOURCES_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getResourceList();
  if (!result.success) return res.json(result)
  res.status(result.status).json(result);
});

router.delete("/", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.DELETE]))) return accessDenied(res)
  const { permissions } = req.body
  let result
  result = await deletePermissions(permissions.roleId, permissions.resourceId);
  const status = result.success ? StatusCodes.OK : StatusCodes.NOT_FOUND
  res.status(status).json(result);  
});

router.post("/", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.CREATE]))) return accessDenied(res)
  const { permissions } = req.body
  const result = await addPermissions(permissions);
  const status = result.success ? StatusCodes.CREATED : StatusCodes.CONFLICT
  res.status(status).json(result);
});

router.put("/", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.UPDATE]))) return accessDenied(res)
  const { permissions } = req.body
  const result = await updatePermissions(permissions);
  res.status(result.status).json(result);
});

export async function getPermissions(roleId: number, resourceId: RESOURCE) {
  const service = getPermissionService()
  return await service.getPermissions(roleId, resourceId)
}

export async function getAllUserPermissions(roleId: number): Promise<PermissionSchema[]> {
  const service = getPermissionService()
  return (await service.getAllRolePermissions(roleId)).data
}

export async function getAllPermissions(): Promise<PermissionSchema[]> {
  const service = getPermissionService()
  return (await service.getAllPermissions()).data
}

export async function getResourceList() {
  const service = getPermissionService()
  return await service.getResourceList()
}

export async function addPermissions(permissions: PermissionSchema) {
  const result = await getPermissions(permissions.roleId, permissions.resourceId)
  if (!result.success) return result
  const list = result.data
  if ((list as PermissionSchema[]).find(m => m.roleId === permissions.roleId && m.resourceId === permissions.resourceId)) return { success: false, status: StatusCodes.CONFLICT, message: messages.PERMISSION_EXIST }
  const service = getPermissionService()
  return await service.addPermissions(permissions.roleId, permissions.resourceId, { Read: !!permissions.read, Create: !!permissions.create, Delete: !!permissions.delete, Update: !!permissions.update })
}

export async function updatePermissions(permissions: PermissionSchema) {
  const service = getPermissionService()
  return await service.updatePermissions(permissions.roleId, permissions.resourceId, { Read: !!permissions.read, Create: !!permissions.create, Delete: !!permissions.delete, Update: !!permissions.update })
}

export async function deletePermissions(roleId: number, resourceId: RESOURCE) {
  const service = getPermissionService()
  return await service.deletePermissions(roleId, resourceId)

}