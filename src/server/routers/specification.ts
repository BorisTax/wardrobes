import express from "express";
import { MyRequest } from '../../types/server.js';
import { PERMISSION, RESOURCE } from "../../types/user.js";
import { SpecificationResult } from "../../types/wardrobe.js";
import { accessDenied, incorrectData, noExistData } from "../functions/database.js";
import messages from "../messages.js";
import { AppState } from "../../types/app.js";
import { hasPermission } from "./users.js";
import { SpecSchema } from "../../types/schemas.js";
import { COMBIDATA_ROUTE, DATA_ROUTE } from "../../types/routes.js";
import { getSpecCombiData, getSpecData, getSpecList, updateSpecData } from "./functions/spec.js";

const router = express.Router();
export default router

router.get("/", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SPECIFICATION, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getSpecList();
  res.status(result.status).json(result);
});

router.put("/", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SPECIFICATION, [PERMISSION.UPDATE]))) return accessDenied(res)
  const data = req.body
  const result = await updateSpecList(data);
  res.status(result.status).json(result);
});

router.post(DATA_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SPECIFICATION, [PERMISSION.READ]))) return accessDenied(res)
  const verbose = await hasPermission(req as MyRequest, RESOURCE.VERBOSE, [PERMISSION.READ])
  const { data, resetDetails } = req.body
  const result = await getSpecData(data, resetDetails, verbose);
  res.status(result.status).json(result);
});

router.post(COMBIDATA_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SPECIFICATION, [PERMISSION.READ]))) return accessDenied(res)
  const verbose = await hasPermission(req as MyRequest, RESOURCE.VERBOSE, [PERMISSION.READ])
  const pricePerm = await hasPermission(req as MyRequest, RESOURCE.PRICES, [PERMISSION.READ])
  const { data } = req.body
  const result = await getSpecCombiData(data, verbose);
  res.status(result.status).json(result);
});


export async function updateSpecList(data: SpecSchema) {
  const result = await getSpecList()
  if (!result.success) return result
  const list = result.data as SpecSchema[]
  if (data.coef && isNaN(+data.coef)) return incorrectData(messages.SPEC_COEF_INCORRECT)
  if (!list.find(m => m.id === data.id)) return noExistData(messages.SPEC_NAME_NO_EXIST)
  return await updateSpecData(data)
}


