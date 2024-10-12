import messages from '../messages.js'
import path from 'path'
import { fileURLToPath } from 'url';
import express from "express";
import { accessDenied } from '../functions/database.js';
import { MyRequest } from '../../types/server.js';
import { PERMISSION, RESOURCE } from "../../types/user.js";
import { templateServiceProvider } from '../options.js';
import { TemplateService } from '../services/templateService.js';
import { Template } from '../../types/templates.js';
import { hasPermission } from './users.js';
import { StatusCodes } from 'http-status-codes';
import { OmitId } from '../../types/materials.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
export default router

router.get("/", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.TEMPLATE, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getFasadTemplates();
  if (!result.success) return res.json(result)
  res.status(result.status).json(result);
});
router.delete("/", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.TEMPLATE, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id } = req.body
  let result
  result = await deleteFasadTemplate(id);
  const status = result.success ? StatusCodes.OK : StatusCodes.NOT_FOUND
  res.status(status).json(result);  
});

router.post("/", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.TEMPLATE, [PERMISSION.CREATE]))) return accessDenied(res)
  const { name, data } = req.body
  const result = await addFasadTemplate({ name, data });
  const status = result.success ? StatusCodes.CREATED : StatusCodes.CONFLICT
  res.status(status).json(result);
});

router.put("/", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.TEMPLATE, [PERMISSION.UPDATE]))) return accessDenied(res)
  const { name, id, data } = req.body
  const result = await updateFasadTemplate({ name, id, data });
  res.status(result.status).json(result);
});

export async function getFasadTemplates() {
  const templateService = new TemplateService(templateServiceProvider)
  return await templateService.getFasadTemplates()
}

export async function addFasadTemplate({ name, data }: OmitId<Template>) {
  const templateService = new TemplateService(templateServiceProvider)
  const result = await templateService.getFasadTemplates()
  if (!result.success) return result
  const templates = result.data
  if ((templates as Template[]).find(m => m.name === name)) return { success: false, status: StatusCodes.CONFLICT, message: messages.TEMPLATE_EXIST }
  return await templateService.addFasadTemplate({ name, data })
}

export async function updateFasadTemplate({ name, id, data }: Template) {
  const templateService = new TemplateService(templateServiceProvider)
  const result = await templateService.getFasadTemplates()
  if (!result.success) return result
  const templates = result.data
  if (!(templates as Template[]).find(m => m.name === name)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.TEMPLATE_NO_EXIST }
  return await templateService.updateFasadTemplate({ name, id, data })
}

export async function deleteFasadTemplate(id: number) {
  const templateService = new TemplateService(templateServiceProvider)
  const result = await templateService.getFasadTemplates()
  if (!result.success) return result
  const templates = result.data
  if (!(templates as Template[]).find(m => m.id === id)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.TEMPLATE_NO_EXIST }
  return await templateService.deleteFasadTemplate(id)
}