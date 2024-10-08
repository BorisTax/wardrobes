import express from "express";
import { MyRequest, Result } from '../../types/server.js';
import { materialServiceProvider, specServiceProvider } from '../options.js';
import { CONSOLE_TYPE, DETAIL_NAME, WARDROBE_KIND, WARDROBE_TYPE, WardrobeData } from '../../types/wardrobe.js';
import { ProfileType } from "../../types/materials.js";
import { MaterialService } from "../services/materialService.js";
import { InitialAppState } from "../../types/app.js";
import { FasadMaterial, MAT_PURPOSE } from "../../types/enums.js";
import { StatusCodes } from "http-status-codes";
import { hasPermission } from "./users.js";
import { PERMISSION, RESOURCE } from "../../types/user.js";
import { accessDenied } from "../functions/database.js";
import { getDetails } from "../wardrobes/specifications/corpus.js";

const router = express.Router();
export default router

router.get("/initial", async (req, res) => {
  const result = await getInitialState();
  res.json(result);
});

router.get("/initialWardrobeData", async (req, res) => {
  const result = await getInitialWardrobeData();
  res.json(result);
});
router.get("/getDetail", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SPECIFICATION, [PERMISSION.READ]))) return accessDenied(res)
  const { wardType,kind, detailName, width, height } = req.query
  const result = await getDetail(wardType as WARDROBE_TYPE, kind as WARDROBE_KIND, detailName as DETAIL_NAME, width ? (+width) : 0, height ? (+height) : 0)
  res.status(200).json({ success: true, data: result });
});
router.get("/getDetails", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SPECIFICATION, [PERMISSION.READ]))) return accessDenied(res)
  const { wardType, kind, width, height, depth } = req.query
  const result = await getDetails(wardType as WARDROBE_TYPE, kind as WARDROBE_KIND, width ? (+width) : 0, height ? (+height) : 0, depth ? (+depth) : 0)
  res.status(200).json({ success: true, data: result });
});
export async function getTable(kind: WARDROBE_KIND) {
  return await specServiceProvider.getDetailTable({ kind })
}

export async function getDetail(wardType:WARDROBE_TYPE, kind: WARDROBE_KIND, detailName: DETAIL_NAME, width: number, height: number) {
  const details = await getDetails(wardType, kind, width, height,  0)
  const detail = details.find(d => d.name === detailName)
  if (detail) return detail
  return {
    name: "",
    count: 0,
    length: 0,
  }
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
  return { success: true, status: StatusCodes.OK, data: { wardType, wardWidth, wardHeight, fasadCount, profile, material: material as FasadMaterial, extMaterial: name } }
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
  const details = await getDetails(WARDROBE_TYPE.WARDROBE, WARDROBE_KIND.STANDART, 2400, 2100, 600)
  return {
    success: true, status: StatusCodes.OK, data: {
      wardKind: WARDROBE_KIND.STANDART,
      wardType: WARDROBE_TYPE.WARDROBE,
      schema: false,
      details,
      width: 2400,
      depth: 600,
      height: 2400,
      dspName: name,
      profileName,
      fasades: initFasades,
      extComplect: {
        telescope: 0,
        blinder: 0,
        console: { count: 0, height: 2400, depth: 600, width: 300, type: CONSOLE_TYPE.STANDART },
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