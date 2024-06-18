import express from "express";
import { accessDenied } from '../functions/other.js';
import { MyRequest, Result, UserRoles } from '../../types/server.js';
import { materialServiceProvider, specificationPath } from '../options.js';
import { isManagerAtLeast } from '../functions/user.js';
import { CONSOLE_TYPE, WARDROBE_KIND, WARDROBE_TYPE, WardrobeData } from '../../types/wardrobe.js';
import SpecificationServiceSQLite from "../services/specificationServiceSQLite.js";
import { Profile, ProfileType } from "../../types/materials.js";
import { MaterialService } from "../services/materialService.js";
import { InitialAppState } from "../../types/app.js";
import { FasadMaterial, MAT_PURPOSE } from "../../types/enums.js";

const router = express.Router();
export default router

router.get("/initial", async (req: MyRequest, res) => {
  const result = await getInitialState();
  res.json(result);
});
router.get("/initialWardrobeData", async (req: MyRequest, res) => {
  const result = await getInitialWardrobeData();
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
const initFasades = {
  dsp: { count: 0, names: [] },
  mirror: { count: 0, names: [] },
  fmp: { count: 0, names: [] },
  sand: { count: 0, names: [] },
  lacobel: { count: 0, names: [] },
  lacobelGlass: { count: 0, names: [] }
}
export async function getInitialWardrobeData(): Promise<Result<WardrobeData>> {
  const service = new MaterialService(materialServiceProvider)
  const { data: profiles } = await service.getProfiles()
  const { data: materials } = await service.getExtMaterials({})
  const { name } = (materials && materials.find(m => m.purpose === MAT_PURPOSE.BOTH)) || { name: "" }
  const { name: profileName } = (profiles && profiles[0]) || { name: "", code: "", type: ProfileType.STANDART, brush: "" }
  return {
    success: true, status: 200, data: {
      wardKind: WARDROBE_KIND.STANDART,
      wardType: WARDROBE_TYPE.WARDROBE,
      width: 2400,
      depth: 600,
      height: 2100,
      dspName: name,
      profileName,
      fasades: initFasades,
      extComplect: {
        telescope: 0,
        blinder: 0,
        console: { count: 0, height: 0, depth: 0, width: 0, type: CONSOLE_TYPE.STANDART },
        shelf: 0,
        shelfPlat: 0,
        stand: { count: 0, height: 0, },
        pillar: 0,
        truba: 0,
        trempel: 0,
        light: 0
      }
    }
  }
}