import { AllData, DATA_TABLE_NAMES, FasadDefaultCharSchema, LacobelSchema } from "../../../types/schemas"
import { getDataBaseProvider } from "../../options"
import { DataBaseService } from "../../services/dataBaseService"
import { getConsoleTypes, getFasadTypes, getWardobes, getWardobeTypes } from "./wardrobe"
import { getChars, getCharTypes } from "./chars"
import { getProfiles, getProfileTypes } from "./profiles"
import { getSpecList, getUnits } from "./spec"

export async function getLacobels() {
    const service = new DataBaseService(getDataBaseProvider<LacobelSchema>())
    return await service.getData(DATA_TABLE_NAMES.LACOBEL, [], {})
  }
export async function getFasadDefaultChar() {
  const service = new DataBaseService(getDataBaseProvider<FasadDefaultCharSchema>())
  return await service.getData(DATA_TABLE_NAMES.FASAD_DEFAULT_CHAR, [], {})
}
export async function getAllData(): Promise<AllData> {
    const chars = (await getChars()).data || []
    const fasadDefaultChars = (await getFasadDefaultChar()).data || []
    const charTypes = (await getCharTypes()).data || []
    const lacobels = (await getLacobels()).data || []
    const console_types = (await getConsoleTypes()).data || []
    const fasad_types = (await getFasadTypes()).data || []
    const wardrobe_types = (await getWardobeTypes()).data || []
    const wardrobes = (await getWardobes()).data || []
    const units = (await getUnits()).data || []
    const profiles = await getProfiles()
    const profileTypes = await getProfileTypes()
    const spec = (await getSpecList()).data || []
    return {
        chars,
        fasadDefaultChars,
        charTypes,
        lacobels,
        console_types,
        fasad_types,
        wardrobe_types,
        wardrobes,
        units,
        profiles,
        profileTypes,
        spec,
    }
  }
