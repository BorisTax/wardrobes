import messages from '../messages.js'
import express from "express";
import { accessDenied } from '../functions/database.js';
import { MyRequest } from '../../types/server.js';
import { PERMISSION, RESOURCE } from "../../types/user.js";
import { getDataBaseTemplateService } from '../options.js';
import { Template } from '../../types/templates.js';
import { hasPermission } from './users.js';
import { StatusCodes } from 'http-status-codes';
import { OmitId } from '../../types/materials.js';
import { TEMPLATE_TABLE_NAMES } from '../../types/schemas.js';

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
  const { name, id, data, rename } = req.body
  const updateData = rename ? { name } : { name, data } 
  const result = await updateFasadTemplate(id, updateData);
  res.status(result.status).json(result);
});

export async function getFasadTemplates() {
  const service = getDataBaseTemplateService()
  return await service.getData(TEMPLATE_TABLE_NAMES.FASAD, [], {})
}

export async function addFasadTemplate(data: OmitId<Template>) {
  const result = await getFasadTemplates()
  if (!result.success) return result
  const templates = result.data
  if ((templates as Template[]).find(m => m.name === data.name)) return { success: false, status: StatusCodes.CONFLICT, message: messages.TEMPLATE_EXIST }
  const service = getDataBaseTemplateService()
  return await service.addData(TEMPLATE_TABLE_NAMES.FASAD, data)
}

export async function updateFasadTemplate(id: number, data: Partial<Template>) {
  const result = await getFasadTemplates()
  if (!result.success) return result
  const templates = result.data
  if (!(templates as Template[]).find(m => m.id === id)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.TEMPLATE_NO_EXIST }
  const service = getDataBaseTemplateService()
  return await service.updateData(TEMPLATE_TABLE_NAMES.FASAD, { id }, data)
}

export async function deleteFasadTemplate(id: number) {
  const result = await getFasadTemplates()
  if (!result.success) return result
  const templates = result.data
  if (!(templates as Template[]).find(m => m.id === id)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.TEMPLATE_NO_EXIST }
  const service = getDataBaseTemplateService()
  return await service.deleteData(TEMPLATE_TABLE_NAMES.FASAD, { id })
}