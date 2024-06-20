import messages from '../messages.js'
import path from 'path'
import { fileURLToPath } from 'url';
import express from "express";
import { accessDenied } from '../functions/other.js';
import { MyRequest } from '../../types/server.js';
import { RESOURCE } from "../../types/user.js";
import { templateServiceProvider, userServiceProvider } from '../options.js';
import { TemplateService } from '../services/templateService.js';
import { NewTemplate, Template } from '../../types/templates.js';
import { UserService } from '../services/userService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
export default router

router.get("/", async (req, res) => {
  const userService = new UserService(userServiceProvider)
  const userRole = (req as MyRequest).userRole as string;
  const { read } = (await userService.getPermissions(userRole, RESOURCE.TEMPLATE))
  if (!read) return accessDenied(res)
  const result = await getTemplates(req.query.table as string);
  if (!result.success) return res.json(result)
  res.status(result.status).json(result);
});
router.delete("/", async (req, res) => {
  const userService = new UserService(userServiceProvider)
  const userRole = (req as MyRequest).userRole as string;
  const { remove } = (await userService.getPermissions(userRole, RESOURCE.TEMPLATE))
  if (!remove) return accessDenied(res)
  const { name, table } = req.body
  let result
  result = await deleteTemplate(table, name);
  const status = result.success ? 200 : 404
  res.status(status).json(result);  
});

router.post("/", async (req, res) => {
  const userService = new UserService(userServiceProvider)
  const userRole = (req as MyRequest).userRole as string;
  const { create } = (await userService.getPermissions(userRole, RESOURCE.TEMPLATE))
  if (!create) return accessDenied(res)
  const { name, data, table } = req.body
  const result = await addTemplate(table, { name, data });
  const status = result.success ? 201 : 409
  res.status(status).json(result);
});

router.put("/", async (req, res) => {
  const userService = new UserService(userServiceProvider)
  const userRole = (req as MyRequest).userRole as string;
  const { update } = (await userService.getPermissions(userRole, RESOURCE.TEMPLATE))
  if (!update) return accessDenied(res)
  const { name, newName, data, table } = req.body
  const result = await updateTemplate(table, { name, newName, data });
  res.status(result.status).json(result);
});

export async function getTemplates(table: string) {
  const templateService = new TemplateService(templateServiceProvider)
  return await templateService.getTemplates(table)
}

export async function addTemplate(table: string, { name, data }: Template) {
  const templateService = new TemplateService(templateServiceProvider)
  const result = await templateService.getTemplates(table)
  if (!result.success) return result
  const templates = result.data
  if ((templates as Template[]).find(m => m.name === name)) return { success: false, status: 409, message: messages.TEMPLATE_EXIST }
  return await templateService.addTemplate(table, { name, data })
}

export async function updateTemplate(table: string, { name, newName, data }: NewTemplate) {
  const templateService = new TemplateService(templateServiceProvider)
  const result = await templateService.getTemplates(table)
  if (!result.success) return result
  const templates = result.data
  if (!(templates as Template[]).find(m => m.name === name)) return { success: false, status: 404, message: messages.TEMPLATE_NO_EXIST }
  return await templateService.updateTemplate(table, { name, newName, data })
}

export async function deleteTemplate(table: string, name: string) {
  const templateService = new TemplateService(templateServiceProvider)
  const result = await templateService.getTemplates(table)
  if (!result.success) return result
  const templates = result.data
  if (!(templates as Template[]).find(m => m.name === name)) return { success: false, status: 404, message: messages.TEMPLATE_NO_EXIST }
  return await templateService.deleteTemplate(table, name)
}