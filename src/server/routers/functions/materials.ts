import { AllData, DATA_TABLE_NAMES, FasadDefaultCharSchema, LacobelSchema } from "../../../types/schemas"
import { getDataBaseProvider } from "../../options"
import { DataBaseService } from "../../services/dataBaseService"
import { getConsoleTypes, getFasadTypes, getWardobes, getWardrobeTypes } from "./wardrobe"
import { getChars, getCharTypes, getFasadTypeToChar } from "./chars"
import { getProfiles, getProfileTypes } from "./profiles"
import { getSpecList, getSpecToCharList, getUnits } from "./spec"

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
    const consoleTypes = (await getConsoleTypes()).data || []
    const fasadTypes = (await getFasadTypes()).data || []
    const fasadTypeToChar = (await getFasadTypeToChar()).data || []
    const wardrobeTypes = (await getWardrobeTypes()).data || []
    const wardrobes = (await getWardobes()).data || []
    const units = (await getUnits()).data || []
    const profiles = await getProfiles()
    const profileTypes = await getProfileTypes()
    const spec = (await getSpecList()).data || []
    const specToChar = (await getSpecToCharList()).data || []
    return {
        chars,
        fasadDefaultChars,
        charTypes,
        lacobels,
        consoleTypes,
        fasadTypes,
        fasadTypeToChar,
        wardrobeTypes,
        wardrobes,
        units,
        profiles,
        profileTypes,
        spec,
        specToChar
    }
  }
