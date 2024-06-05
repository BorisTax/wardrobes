import messages from '../messages.js'
import express from "express";
import { accessDenied, incorrectData, noExistData } from '../functions/other.js';
import { MyRequest, PriceListItem, UserRoles } from '../../types/server.js';
import { materialsPath, priceServiceProvider } from '../options.js';
import { PriceService } from '../services/priceService.js';
import { isClientAtLeast, isEditorAtLeast } from '../functions/user.js';
import { SpecificationService } from '../services/specificationService.js';
import MaterialServiceSQLite from '../services/materialServiceSQLite.js';
import { MaterialExtService } from '../services/materialExtService.js';
import BrushServiceSQLite from '../services/extServices/brushServiceSQLite.js';
import { WardrobeData } from '../../types/wardrobe.js';

const router = express.Router();
export default router

router.post("/", async (req: MyRequest, res) => {
  if (!isClientAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { data } = req.body
  const result = await getSpecList(data);
  res.json(result);
});


export async function getSpecList(data: WardrobeData) {
  const specService = new SpecificationService(priceServiceProvider, new MaterialServiceSQLite(materialsPath))

  return await specService.getSpecList(data)
}


