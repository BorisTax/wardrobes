import messages from '../messages.js'
import express from "express";
import { accessDenied, incorrectData, noExistData } from '../functions/other.js';
import { MyRequest, SpecificationData, UserRoles } from '../../types/server.js';
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


export async function getTable(kind: WARDROBE_KIND) {
  const service = new WardrobeDetailTableService(wardrobePath)
  return await service.getDetailTable({ kind })
}


