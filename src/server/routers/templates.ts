import messages from '../messages.js'
import path from 'path'
import { fileURLToPath } from 'url';
import express from "express";
import { accessDenied } from '../functions/database.js';
import { MyRequest } from '../../types/server.js';
import { PERMISSION, RESOURCE } from "../../types/user.js";
import { templateServiceProvider } from '../options.js';
import { TemplateService } from '../services/templateService.js';
import { NewTemplate, Template } from '../../types/templates.js';
import { hasPermission } from './users.js';
import { StatusCodes } from 'http-status-codes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
export default router

router.get("/", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.TEMPLATE, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getTemplates(req.query.table as string);
  if (!result.success) return res.json(result)
  res.status(result.status).json(result);
});
router.delete("/", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.TEMPLATE, [PERMISSION.DELETE]))) return accessDenied(res)
  const { name, table } = req.body
  let result
  result = await deleteTemplate(table, name);
  const status = result.success ? StatusCodes.OK : StatusCodes.NOT_FOUND
  res.status(status).json(result);  
});

router.post("/", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.TEMPLATE, [PERMISSION.CREATE]))) return accessDenied(res)
  const { name, data, table } = req.body
  const result = await addTemplate(table, { name, data });
  const status = result.success ? StatusCodes.CREATED : StatusCodes.CONFLICT
  res.status(status).json(result);
});

router.put("/", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.TEMPLATE, [PERMISSION.UPDATE]))) return accessDenied(res)
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
  if ((templates as Template[]).find(m => m.name === name)) return { success: false, status: StatusCodes.CONFLICT, message: messages.TEMPLATE_EXIST }
  return await templateService.addTemplate(table, { name, data })
}

export async function updateTemplate(table: string, { name, newName, data }: NewTemplate) {
  const templateService = new TemplateService(templateServiceProvider)
  const result = await templateService.getTemplates(table)
  if (!result.success) return result
  const templates = result.data
  if (!(templates as Template[]).find(m => m.name === name)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.TEMPLATE_NO_EXIST }
  return await templateService.updateTemplate(table, { name, newName, data })
}

export async function deleteTemplate(table: string, name: string) {
  const templateService = new TemplateService(templateServiceProvider)
  const result = await templateService.getTemplates(table)
  if (!result.success) return result
  const templates = result.data
  if (!(templates as Template[]).find(m => m.name === name)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.TEMPLATE_NO_EXIST }
  return await templateService.deleteTemplate(table, name)
}