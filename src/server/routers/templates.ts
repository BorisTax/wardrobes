import messages from '../messages.js'
import path from 'path'
import { fileURLToPath } from 'url';
import express from "express";
import { accessDenied } from '../functions/other.js';
import { MyRequest, UserRoles } from '../types/server.js';
import { templateServiceProvider } from '../options.js';
import { isEditorAtLeast } from '../functions/user.js';
import { TemplateService } from '../services/templateService.js';
import { NewTemplate, Template } from '../types/templates.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
export default router

router.get("/templates", async (req, res) => {
  const result = await getTemplates();
  if (!result.success) return res.json(result)
  res.status(result.status).json(result);
});
router.delete("/template", async (req: MyRequest, res) => {
  if (!isEditorAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { name } = req.body
  let result
  result = await deleteTemplate(name);
  const status = result.success ? 200 : 404
  res.status(status).json(result);  
});

router.post("/template", async (req: MyRequest, res) => {
  if (!isEditorAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { name, data } = req.body
  const result = await addTemplate({ name, data });
  const status = result.success ? 201 : 409
  res.status(status).json(result);
});

router.put("/template", async (req: MyRequest, res) => {
  if (!isEditorAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { name, newName, data } = req.body
  const result = await updateTemplate({ name, newName, data });
  res.status(result.status).json(result);
});

export async function getTemplates() {
  const templateService = new TemplateService(templateServiceProvider)
  return await templateService.getTemplates()
}

export async function addTemplate({ name, data }: Template) {
  const templateService = new TemplateService(templateServiceProvider)
  const result = await templateService.getTemplates()
  if (!result.success) return result
  const templates = result.data
  if ((templates as Template[]).find(m => m.name === name)) return { success: false, status: 409, message: messages.TEMPLATE_EXIST }
  return await templateService.addTemplate({ name, data })
}

export async function updateTemplate({ name, newName, data }: NewTemplate) {
  const templateService = new TemplateService(templateServiceProvider)
  const result = await templateService.getTemplates()
  if (!result.success) return result
  const templates = result.data
  if (!(templates as Template[]).find(m => m.name === name)) return { success: false, status: 404, message: messages.TEMPLATE_NO_EXIST }
  return await templateService.updateTemplate({ name, newName, data })
}

export async function deleteTemplate(name: string) {
  const templateService = new TemplateService(templateServiceProvider)
  const result = await templateService.getTemplates()
  if (!result.success) return result
  const templates = result.data
  if (!(templates as Template[]).find(m => m.name === name)) return { success: false, status: 404, message: messages.TEMPLATE_NO_EXIST }
  return await templateService.deleteTemplate(name)
}