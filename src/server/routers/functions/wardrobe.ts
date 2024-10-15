import { StatusCodes } from "http-status-codes";
import { InitialAppState } from "../../../types/app";
import { FASAD_TYPE, ProfileType } from "../../../types/enums";
import { DefaultSchema, DATA_TABLE_NAMES } from "../../../types/schemas";
import { Result } from "../../../types/server";
import { SpecItem } from "../../../types/specification";
import { WARDROBE_KIND, WARDROBE_TYPE, FasadesData, WardrobeData, CONSOLE_TYPE } from "../../../types/wardrobe";
import { getDataBaseProvider } from "../../options";
import { DataBaseService } from "../../services/dataBaseService";
import { getDetails } from "../../wardrobes/specifications/corpus";
import { getProfiles } from "./profiles";
import { getAllCharOfSpec } from "./spec";


export async function getWardobes() {
  const service = new DataBaseService(getDataBaseProvider<DefaultSchema>());
  return await service.getData(DATA_TABLE_NAMES.WARDROBES, [], {});
}
export async function getWardobeTypes() {
  const service = new DataBaseService(getDataBaseProvider<DefaultSchema>());
  return await service.getData(DATA_TABLE_NAMES.WARDROBE_TYPES, [], {});
}
export async function getConsoleTypes() {
  const service = new DataBaseService(getDataBaseProvider<DefaultSchema>());
  return await service.getData(DATA_TABLE_NAMES.CONSOLE_TYPES, [], {});
}
export async function getFasadTypes() {
    const service = new DataBaseService(getDataBaseProvider<DefaultSchema>());
    return await service.getData(DATA_TABLE_NAMES.FASAD_TYPES_TABLE, [], {});
  }


export async function getDetail(wardTypeId: number, wardrobeId: number, detailId: number, width: number, height: number) {
  const details = await getDetails(wardTypeId, wardrobeId, width, height, 0);
  const detail = details.find(d => d.id === detailId);
  if (detail) return detail;
  return {
    name: "",
    count: 0,
    length: 0,
  };
}

export async function getInitialState(): Promise<Result<InitialAppState>> {
  const profiles = await getProfiles();
  const materialsId = await getAllCharOfSpec(SpecItem.DSP10);
  const { type: fasadType, id: materialId } = { type: FASAD_TYPE.DSP, id: materialsId[0] };
  const profile = { id: profiles[0]?.id || 0, type: profiles[0]?.type || ProfileType.STANDART }
  const wardWidth = 1500;
  const wardHeight = 2400;
  const fasadCount = 2;
  const wardType: WARDROBE_TYPE = WARDROBE_TYPE.WARDROBE;
  return { success: true, status: StatusCodes.OK, data: { wardType, wardWidth, wardHeight, fasadCount, profile, fasadType, materialId } };
}
const initFasades: FasadesData = {
  dsp: { count: 0, matId: [] },
  mirror: { count: 0, matId: [] },
  fmp: { count: 0, matId: [] },
  sand: { count: 0, matId: [] },
  lacobel: { count: 0, matId: [] },
};

export async function getInitialWardrobeData(): Promise<Result<WardrobeData>> {
  const profiles = await getProfiles();
  const materialsId = await getAllCharOfSpec(SpecItem.DSP16);
  const profileId = profiles[0].id;
  const details = await getDetails(WARDROBE_TYPE.WARDROBE, WARDROBE_KIND.STANDART, 2400, 2100, 600);
  return {
    success: true, status: StatusCodes.OK, data: {
      wardKindId: WARDROBE_KIND.STANDART,
      wardTypeId: WARDROBE_TYPE.WARDROBE,
      schema: false,
      details,
      width: 2400,
      depth: 600,
      height: 2400,
      dspId: materialsId[0],
      profileId,
      fasades: initFasades,
      extComplect: {
        telescope: 0,
        blinder: 0,
        console: { count: 0, height: 2400, depth: 600, width: 300, typeId: CONSOLE_TYPE.STANDART },
        shelf: 0,
        shelfPlat: 0,
        stand: { count: 0, height: 0, },
        pillar: 0,
        truba: 0,
        trempel: 0,
        light: 0
      }
    }
  };
}
