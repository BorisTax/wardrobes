import messages from '../messages.js'
import express from "express";
import { accessDenied, incorrectData, noExistData } from '../functions/other.js';
import { MyRequest, PriceData } from '../../types/server.js';
import { PERMISSION, RESOURCE, UserRoles } from "../../types/user.js";
import { priceServiceProvider } from '../options.js';
import { PriceService } from '../services/priceService.js';
import { hasPermission } from './users.js';

const router = express.Router();
export default router

router.get("/pricelist", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.PRICES, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getPriceList();
  res.json(result);
});

router.put("/pricelist", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.PRICES, [PERMISSION.UPDATE]))) return accessDenied(res)
  const { name, caption, coef, price, code, id, markup } = req.body
  const result = await updatePriceList({ name, price, markup });
  res.status(result.status).json(result);
});

export async function getPriceList() {
  const priceService = new PriceService(priceServiceProvider)
  return await priceService.getPriceList()
}

export async function updatePriceList({ name, price, markup }: PriceData) {
  const priceService = new PriceService(priceServiceProvider)
  const result = await priceService.getPriceList()
  if (!result.success) return result
  const priceList = result.data
  if (markup && isNaN(+markup)) return incorrectData(messages.PRICELIST_MARKUP_INCORRECT)
  if (price && isNaN(+price)) return incorrectData(messages.PRICELIST_PRICE_INCORRECT)
  if (!(priceList as PriceData[]).find(m => m.name === name)) return noExistData(messages.PRICELIST_NAME_NO_EXIST)
  return await priceService.updatePriceList({ name, price, markup })
}
