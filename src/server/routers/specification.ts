import express from "express";
import { MyRequest, SpecificationData } from '../../types/server.js';
import { RESOURCE } from "../../types/user.js";
import { materialServiceProvider, specServiceProvider, userServiceProvider } from '../options.js';
import { SpecificationService } from '../services/specificationService.js';
import { WardrobeData } from "../../types/wardrobe.js";
import { accessDenied, incorrectData, noExistData } from "../functions/other.js";
import messages from "../messages.js";
import { AppState } from "../../types/app.js";
import { UserService } from "../services/userService.js";

const router = express.Router();
export default router

router.get("/", async (req, res) => {
  const userService = new UserService(userServiceProvider)
  const userRole = (req as MyRequest).userRole as string;
  const { read } = (await userService.getPermissions(userRole, RESOURCE.SPECIFICATION))
  if (!read) return accessDenied(res)
  const { data } = req.body
  const result = await getSpecList();
  res.json(result);
});
router.put("/", async (req, res) => {
  const userService = new UserService(userServiceProvider)
  const userRole = (req as MyRequest).userRole as string;
  const { update } = (await userService.getPermissions(userRole, RESOURCE.SPECIFICATION))
  if (!update) return accessDenied(res)
  const { name, caption, coef, code, id } = req.body
  const result = await updateSpecList({ name, caption, coef, code, id });
  res.status(result.status).json(result);
});
router.post("/data", async (req, res) => {
  const userService = new UserService(userServiceProvider)
  const userRole = (req as MyRequest).userRole as string;
  const { read } = (await userService.getPermissions(userRole, RESOURCE.SPECIFICATION))
  if (!read) return accessDenied(res)
  const { data } = req.body
  const result = await getSpecData(data);
  res.json(result);
});

router.post("/combidata", async (req, res) => {
  const userService = new UserService(userServiceProvider)
  const userRole = (req as MyRequest).userRole as string;
  const { read } = (await userService.getPermissions(userRole, RESOURCE.SPECIFICATION))
  if (!read) return accessDenied(res)
  const { data } = req.body
  const result = await getSpecCombiData(data);
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

export async function getSpecCombiData(data: AppState) {
  const specService = new SpecificationService(specServiceProvider, materialServiceProvider)
  return await specService.getSpecCombiData(data)
}
