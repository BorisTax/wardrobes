import messages from '../messages.js'
import path from 'path'
import { fileURLToPath } from 'url';
import express from "express";
import { checkPermissions } from '../functions.js';
import { MyRequest, PriceListItem, UserRoles } from '../../types/server.js';
import { priceServiceProvider } from '../options.js';
import { PriceService } from '../services/priceService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
export default router

router.get("/pricelist", async (req, res) => {
  if (!checkPermissions(req, res, [UserRoles.SUPERADMIN, UserRoles.ADMIN])) return
  const result = await getPriceList();
  res.json(result);
});

router.put("/pricelist", async (req: MyRequest, res) => {
  if (!checkPermissions(req, res, [UserRoles.SUPERADMIN, UserRoles.ADMIN])) return
  const { name, caption, price, code, id } = req.body
  const result = await updatePriceList({ name, caption, price, code, id });
  res.status(result.status).json(result);
});

export async function getPriceList() {
  const priceService = new PriceService(priceServiceProvider)
  return await priceService.getPriceList()
}

export async function updatePriceList({ name, caption, price, code, id }: PriceListItem) {
  const priceService = new PriceService(priceServiceProvider)
  const result = await priceService.getPriceList()
  if (!result.success) return result
  const priceList = result.data
  
  if (price && isNaN(+price)) return { success: false, status: 400, message: messages.PRICELIST_PRICE_INCORRECT }
  if (!(priceList as PriceListItem[]).find(m => m.name === name)) return { success: false, status: 404, message: messages.PRICELIST_NAME_NO_EXIST }
  return await priceService.updatePriceList({ name, caption, price, code, id })
}
