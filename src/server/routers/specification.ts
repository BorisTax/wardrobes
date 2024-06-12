import express from "express";
import { MyRequest, SpecificationData, UserRoles } from '../../types/server.js';
import { materialServiceProvider, specServiceProvider } from '../options.js';
import { SpecificationService } from '../services/specificationService.js';
import { WardrobeData } from "../../types/wardrobe.js";
import { isEditorAtLeast } from "../functions/user.js";
import { accessDenied, incorrectData, noExistData } from "../functions/other.js";
import messages from "../messages.js";

const router = express.Router();
export default router

router.get("/", async (req: MyRequest, res) => {
  //if (!isClientAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { data } = req.body
  const result = await getSpecList();
  res.json(result);
});
router.put("/", async (req: MyRequest, res) => {
  if (!isEditorAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { name, caption, coef, code, id } = req.body
  const result = await updateSpecList({ name, caption, coef, code, id });
  res.status(result.status).json(result);
});
router.post("/data", async (req: MyRequest, res) => {
  //if (!isClientAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { data } = req.body
  const result = await getSpecData(data);
  res.json(result);
});

export async function getSpecList() {
  const specService = new SpecificationService(specServiceProvider, materialServiceProvider)
  return await specService.getSpecList()
}

export async function updateSpecList({ name, caption, coef, code, id }: SpecificationData) {
  const priceService = new SpecificationService(specServiceProvider)
  const result = await priceService.getSpecList()
  if (!result.success) return result
  const list = result.data
  if (coef && isNaN(+coef)) return incorrectData(messages.SPEC_COEF_INCORRECT)
  if (!(list as SpecificationData[]).find(m => m.name === name)) return noExistData(messages.SPEC_NAME_NO_EXIST)
  return await priceService.updateSpecList({ name, caption, coef, code, id })
}

export async function getSpecData(data: WardrobeData) {
  const specService = new SpecificationService(specServiceProvider, materialServiceProvider)
  return await specService.getSpecData(data)
}

