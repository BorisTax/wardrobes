import express from "express";
import { accessDenied } from '../functions/other.js';
import { MyRequest, Result, UserRoles } from '../../types/server.js';
import { materialServiceProvider, specificationPath } from '../options.js';
import { isManagerAtLeast } from '../functions/user.js';
import { WARDROBE_KIND, WARDROBE_TYPE } from '../../types/wardrobe.js';
import SpecificationServiceSQLite from "../services/specificationServiceSQLite.js";
import { Profile, ProfileType } from "../../types/materials.js";
import { MaterialService } from "../services/materialService.js";
import { InitialAppState } from "../../types/app.js";
import { FasadMaterial } from "../../types/enums.js";

const router = express.Router();
export default router

router.get("/initial", async (req: MyRequest, res) => {
  const result = await getInitialState();
  res.json(result);
});


export async function getTable(kind: WARDROBE_KIND) {
  const service = new SpecificationServiceSQLite(specificationPath)
  return await service.getDetailTable({ kind })
}



export async function getInitialState(): Promise<Result<InitialAppState>> {
  const service = new MaterialService(materialServiceProvider)
  const { data: profiles } = await service.getProfiles()
  const { data: materials } = await service.getExtMaterials({})
  const { material, name } = (materials && materials[0])|| { material: FasadMaterial.EMPTY, name: "" }
  const profile = (profiles && profiles[0]) || { name: "", code: "", type: ProfileType.STANDART, brush: "" }
  const wardWidth = 2400
  const wardHeight = 2400
  const fasadCount = 3
  const wardType: WARDROBE_TYPE = WARDROBE_TYPE.WARDROBE
  return { success: true, status: 200, data: { wardType, wardWidth, wardHeight, fasadCount, profile, material: material as FasadMaterial, extMaterial: name } }
}