import messages from '../messages.js'
import path from 'path'
import { fileURLToPath } from 'url';
import express from "express";
import { accessDenied, checkPermissions, incorrectData, noExistData } from '../functions.js';
import { MyRequest, PriceListItem, UserRoles } from '../../types/server.js';
import { priceServiceProvider } from '../options.js';
import { PriceService } from '../services/priceService.js';
import { isAdminAtLeast, isClientAtLeast } from '../../functions/user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
export default router

router.get("/pricelist", async (req: MyRequest, res) => {
  if (!isClientAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const result = await getPriceList();
  res.json(result);
});

router.put("/pricelist", async (req: MyRequest, res) => {
  if (!isAdminAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { name, caption, price, code, id, markup } = req.body
  const result = await updatePriceList({ name, caption, price, code, id, markup });
  res.status(result.status).json(result);
});

export async function getPriceList() {
  const priceService = new PriceService(priceServiceProvider)
  return await priceService.getPriceList()
}

export async function updatePriceList({ name, caption, price, code, id, markup }: PriceListItem) {
  const priceService = new PriceService(priceServiceProvider)
  const result = await priceService.getPriceList()
  if (!result.success) return result
  const priceList = result.data
  if (markup && isNaN(+markup)) return incorrectData(messages.PRICELIST_MARKUP_INCORRECT)
  if (price && isNaN(+price)) return incorrectData(messages.PRICELIST_PRICE_INCORRECT)
  if (!(priceList as PriceListItem[]).find(m => m.name === name)) return noExistData(messages.PRICELIST_NAME_NO_EXIST)
  return await priceService.updatePriceList({ name, caption, price, code, id, markup })
}
