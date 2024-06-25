import express from "express";
import { MyRequest, SpecificationData } from '../../types/server.js';
import { PERMISSION, RESOURCE } from "../../types/user.js";
import { materialServiceProvider, priceServiceProvider, specServiceProvider } from '../options.js';
import { SpecificationService } from '../services/specificationService.js';
import { SpecificationResult, WardrobeData } from "../../types/wardrobe.js";
import { accessDenied, incorrectData, noExistData } from "../functions/other.js";
import messages from "../messages.js";
import { AppState } from "../../types/app.js";
import { hasPermission } from "./users.js";
import { PriceService } from "../services/priceService.js";

const router = express.Router();
export default router

router.get("/", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SPECIFICATION, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getSpecList();
  res.status(result.status).json(result);
});
router.put("/", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SPECIFICATION, [PERMISSION.UPDATE]))) return accessDenied(res)
  const { name, caption, coef, code, id } = req.body
  const result = await updateSpecList({ name, caption, coef, code, id });
  res.status(result.status).json(result);
});
router.post("/data", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SPECIFICATION, [PERMISSION.READ]))) return accessDenied(res)
  const { data } = req.body
  const result = await getSpecData(data);
  res.status(result.status).json(result);
});

router.post("/combidata", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SPECIFICATION, [PERMISSION.READ]))) return accessDenied(res)
  const pricePerm = await hasPermission(req as MyRequest, RESOURCE.PRICES, [PERMISSION.READ])
  const { data } = req.body
  const result = await getSpecCombiData(data, pricePerm);
  res.json({ success: true, data: result });
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

export async function getSpecCombiData(data: AppState, pricePerm: boolean) {
  const specService = new SpecificationService(specServiceProvider, materialServiceProvider)
  const specifications = (await specService.getSpecCombiData(data)).data as SpecificationResult[][]
  const totalPrice = pricePerm ? await getTotalPrice(specifications) : specifications.map(s => 0)
  return { specifications, totalPrice }
}

async function getTotalPrice(specifications: SpecificationResult[][]){
  const priceService = new PriceService(priceServiceProvider)
  const priceList = (await priceService.getPriceList()).data || []
  const totalPrice = specifications.map(s => {
        let sum: number = 0
            s.forEach(sp => {
                const priceItem = priceList.find(pl => pl.name === sp[0]) || { price: 0, markup: 0, name: "" }
                sum += sp[1].data.amount * (priceItem.price || 0) * (priceItem.markup || 0)
            })
        return sum || 0
    })
    return totalPrice
}