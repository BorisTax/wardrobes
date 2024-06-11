import messages from '../messages.js'
import express from "express";
import { accessDenied, incorrectData, noExistData } from '../functions/other.js';
import { MyRequest, PriceListItem, UserRoles } from '../../types/server.js';
import { priceServiceProvider, wardrobePath } from '../options.js';
import { PriceService } from '../services/priceService.js';
import { isEditorAtLeast, isManagerAtLeast } from '../functions/user.js';
import { WardrobeDetailTableService } from '../services/wardrobeDetailTableService.js';
import { WARDROBE_KIND } from '../../types/wardrobe.js';

const router = express.Router();
export default router

router.post("/wardrobeTable", async (req: MyRequest, res) => {
  if (!isManagerAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { kind } = req.body
  const result = await getTable(kind);
  res.json(result);
});

router.put("/wardrobeTable", async (req: MyRequest, res) => {
  if (!isEditorAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { name, caption, coef, price, code, id, markup } = req.body
  const result = await updatePriceList({ name, caption, coef, price, code, id, markup });
  res.status(result.status).json(result);
});

export async function getTable(kind: WARDROBE_KIND) {
  const service = new WardrobeDetailTableService(wardrobePath)
  return await service.getDetailTable({ kind })
}

export async function updatePriceList({ name, caption, coef, price, code, id, markup }: PriceListItem) {
  const priceService = new PriceService(priceServiceProvider)
  const result = await priceService.getPriceList()
  if (!result.success) return result
  const priceList = result.data
  if (markup && isNaN(+markup)) return incorrectData(messages.PRICELIST_MARKUP_INCORRECT)
  if (price && isNaN(+price)) return incorrectData(messages.PRICELIST_PRICE_INCORRECT)
  if (!(priceList as PriceListItem[]).find(m => m.name === name)) return noExistData(messages.PRICELIST_NAME_NO_EXIST)
  return await priceService.updatePriceList({ name, caption, coef, price, code, id, markup })
}
