import messages from '../messages.js'
import express from "express";
import { accessDenied } from '../functions/database.js';
import { MyRequest } from '../../types/server.js';
import { PERMISSION, PermissionSchema, UserPermissions, RESOURCE } from "../../types/user.js";
import { getDataBaseProvider, getDataBaseUserProvider, permissionServiceProvider } from '../options.js';
import { hasPermission } from './users.js';
import { PermissionService } from '../services/permissionService.js';
import { StatusCodes } from 'http-status-codes';
import { RESOURCES_ROUTE } from '../../types/routes.js';
import { DataBaseService } from '../services/dataBaseService.js';
import { USER_TABLE_NAMES } from '../../types/schemas.js';

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

export async function getPermissions(roleId: number, resourceId: RESOURCE) {
  const service = new DataBaseService<PermissionSchema>(getDataBaseUserProvider())
  return await service.getData(USER_TABLE_NAMES.PERMISSIONS, [], {id: roleId, resourceId})
}

export async function getAllUserPermissions(roleId: number): Promise<PermissionSchema[]> {
  const service = new DataBaseService<PermissionSchema>(getDataBaseUserProvider())
  return (await service.getData(USER_TABLE_NAMES.PERMISSIONS, [], {id: roleId})).data
}

export async function getAllPermissions(): Promise<PermissionSchema[]> {
  const service = new DataBaseService<PermissionSchema>(getDataBaseUserProvider())
  return (await service.getData(USER_TABLE_NAMES.PERMISSIONS, [], {})).data
}

export async function getResourceList() {
  const service = new DataBaseService(getDataBaseUserProvider())
  return await service.getData(USER_TABLE_NAMES.RESOURCES, [], {})
}
export async function addPermissions(roleId: number, resourceId: RESOURCE, permissions: UserPermissions) {
  const result = await getPermissions(roleId, resourceId)
  if (!result.success) return result
  const list = result.data
  if ((list as PermissionSchema[]).find(m => m.id === roleId && m.resourceId === resourceId)) return { success: false, status: StatusCodes.CONFLICT, message: messages.PERMISSION_EXIST }
  const service = new DataBaseService<PermissionSchema>(getDataBaseUserProvider())
  return await service.addData(USER_TABLE_NAMES.PERMISSIONS, { id: roleId, resourceId, create: permissions.Create, read: permissions.Read, update: permissions.Delete, delete: permissions.Delete })
}

export async function updatePermissions(roleId: number, resourceId: RESOURCE, permissions: UserPermissions) {
  const service = new DataBaseService<PermissionSchema>(getDataBaseUserProvider())
  return await service.updateData(USER_TABLE_NAMES.PERMISSIONS, { id: roleId, resourceId}, { create: permissions.Create, read: permissions.Read, update: permissions.Delete, delete: permissions.Delete })
}

export async function deletePermissions(roleId: number, resourceId: RESOURCE) {
  const service = new DataBaseService<PermissionSchema>(getDataBaseUserProvider())
  return await service.deleteData(USER_TABLE_NAMES.PERMISSIONS, { id: roleId, resourceId })

}