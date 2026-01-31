import { StatusCodes } from "http-status-codes";
import { InitialAppState as InitialCombiState } from "../../../types/app";
import { FASAD_TYPE, ProfileType } from "../../../types/enums";
import { DATA_TABLE_NAMES, WardrobesSchema, WardrobeTypesSchema, ConsoleTypesSchema, FasadTypesSchema, WardrobesDimensionsSchema, WardrobesFasadCountSchema } from "../../../types/schemas";
import { Result } from "../../../types/server";
import { WARDROBE_KIND, WARDROBE_TYPE, FasadesData, WardrobeData, CONSOLE_TYPE } from "../../../types/wardrobe";
import { getDetails } from "../../wardrobes/specifications/corpus";
import { getProfiles } from "./profiles";
import { getFasadDefaultChar } from "./materials";
import { getDataBaseService } from "../../options";


export async function getWardrobes() {
  const service = getDataBaseService<WardrobesSchema>()
  return await service.getData(DATA_TABLE_NAMES.WARDROBES, [], {});
}
export async function getWardrobeTypes() {
  const service = getDataBaseService<WardrobeTypesSchema>()
  return await service.getData(DATA_TABLE_NAMES.WARDROBE_TYPES, [], {});
}

export async function getWardrobesDimensions() {
  const service = getDataBaseService<WardrobesDimensionsSchema>()
  return await service.getData(DATA_TABLE_NAMES.WARDROBES_DIMENSIONS, [], {});
}
export async function getWardrobesFasadCount() {
  const service = getDataBaseService<WardrobesFasadCountSchema>()
  return await service.getData(DATA_TABLE_NAMES.WARDROBES_FASAD_COUNT, [], {});
}
export async function getConsoleTypes() {
  const service = getDataBaseService<ConsoleTypesSchema>()
  return await service.getData(DATA_TABLE_NAMES.CONSOLE_TYPES, [], {});
}
export async function getFasadTypes() {
    const service = getDataBaseService<FasadTypesSchema>()
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

export async function getInitialCombiState(): Promise<Result<InitialCombiState>> {
  const profiles = await getProfiles();
  const defMat = (await getFasadDefaultChar()).data
  const fasadType = FASAD_TYPE.DSP
  const materialId = defMat.find(d => d.id === FASAD_TYPE.DSP)?.charId || 0
  const profile = { id: profiles[0]?.id || 0, type: profiles[0]?.type || ProfileType.STANDART }
  const wardWidth = 1500;
  const wardHeight = 2400;
  const fasadCount = 2;
  const wardType: WARDROBE_TYPE = WARDROBE_TYPE.WARDROBE;
  return { success: true, status: StatusCodes.OK, data: [{ wardType, wardWidth, wardHeight, fasadCount, profile, fasadType, materialId }] };
}

const initFasades: FasadesData = {
  dsp: { count: 2, matId: [83, 83] },
  mirror: { count: 0, matId: [] },
  fmp: { count: 0, matId: [] },
  sand: { count: 0, matId: [] },
  lacobel: { count: 0, matId: [] },
};

export async function getInitialWardrobeData(): Promise<Result<WardrobeData>> {
  const profiles = await getProfiles();
  const defaultChars = (await getFasadDefaultChar()).data
  const dspDefault = defaultChars.find(d => d.id === FASAD_TYPE.DSP)?.charId || 0
  const profileId = profiles[0].id;
  const details = await getDetails(WARDROBE_TYPE.WARDROBE, WARDROBE_KIND.STANDART, 2400, 2100, 600);
  const defaultDims = (await getWardrobesDimensions()).data.find(d => d?.wardrobeId === WARDROBE_KIND.STANDART)
  return {
    success: true, status: StatusCodes.OK,
    data: [{
      wardrobeId: WARDROBE_KIND.STANDART,
      wardrobeTypeId: WARDROBE_TYPE.WARDROBE,
      schema: false,
      details,
      width: defaultDims?.defaultWidth || 0,
      depth: defaultDims?.defaultDepth || 0,
      height: defaultDims?.defaultHeight || 0,
      dspId: dspDefault,
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
    }]
  };
}
