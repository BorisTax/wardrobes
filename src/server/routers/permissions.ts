import messages from '../messages.js'
import path from 'path'
import { fileURLToPath } from 'url';
import express from "express";
import { accessDenied } from '../functions/other.js';
import { MyRequest } from '../../types/server.js';
import { PERMISSION, PERMISSIONS_SCHEMA, Permissions, RESOURCE } from "../../types/user.js";
import { permissionServiceProvider, templateServiceProvider } from '../options.js';
import { TemplateService } from '../services/templateService.js';
import { NewTemplate, Template } from '../../types/templates.js';
import { hasPermission } from './users.js';
import { PermissionService } from '../services/permissionService.js';
import { StatusCodes } from 'http-status-codes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
export default router

router.get("/", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getPermissions(req.query.role as string);
  if (!result.success) return res.json(result)
  res.status(result.status).json(result);
});
router.get("/resources", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getResourceList();
  if (!result.success) return res.json(result)
  res.status(result.status).json(result);
});

router.delete("/", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.REMOVE]))) return accessDenied(res)
  const { role, resource } = req.body
  let result
  result = await deletePermissions(role, resource);
  const status = result.success ? StatusCodes.OK : StatusCodes.NOT_FOUND
  res.status(status).json(result);  
});

router.post("/", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.CREATE]))) return accessDenied(res)
  const { role, resource, permissions } = req.body
  const result = await addPermissions(role, resource, permissions);
  const status = result.success ? StatusCodes.CREATED : StatusCodes.CONFLICT
  res.status(status).json(result);
});

router.put("/", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.UPDATE]))) return accessDenied(res)
  const { role, resource, permissions } = req.body
  const result = await updatePermissions(role, resource, permissions);
  res.status(result.status).json(result);
});

export async function getPermissions(role: string) {
  const service = new PermissionService(permissionServiceProvider)
  return await service.getPermissions(role)
}
export async function getResourceList() {
  const service = new PermissionService(permissionServiceProvider)
  return await service.getResourceList()
}
export async function addPermissions(role: string, resource: RESOURCE, permissions: Permissions) {
  const service = new PermissionService(permissionServiceProvider)
  const result = await service.getPermissions(role)
  if (!result.success) return result
  const list = result.data
  if ((list as PERMISSIONS_SCHEMA[]).find(m => m.role === role && m.resource === resource)) return { success: false, status: StatusCodes.CONFLICT, message: messages.PERMISSION_EXIST }
  return await service.addPermissions(role, resource, permissions)
}

export async function updatePermissions(role: string, resource: RESOURCE, permissions: Permissions) {
  const service = new PermissionService(permissionServiceProvider)
  const result = await service.getPermissions(role)
  if (!result.success) return result
  const list = result.data
  if (!(list as PERMISSIONS_SCHEMA[]).find(m => m.role === role && m.resource === resource)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.PERMISSION_NO_EXIST }
  return await service.updatePermissions(role, resource, permissions)
}

export async function deletePermissions(role: string, resource: RESOURCE) {
  const service = new PermissionService(permissionServiceProvider)
  const result = await service.getPermissions(role)
  if (!result.success) return result
  const list = result.data
  if (!(list as PERMISSIONS_SCHEMA[]).find(m => m.role === role && m.resource === resource)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.PERMISSION_NO_EXIST }
  return await service.deletePermissions(role, resource)
}