import { AllData, DATA_TABLE_NAMES, DefaultSchema, FasadDefaultCharSchema, LacobelSchema } from "../../../types/schemas"
import { getDataBaseProvider } from "../../options"
import { DataBaseService } from "../../services/dataBaseService"
import { getConsoleTypes, getFasadTypes, getWardrobes, getWardrobesDimensions, getWardrobesFasadCount, getWardrobeTypes } from "./wardrobe"
import { getCharPurpose, getChars, getCharTypes } from "./chars"
import { getFasadTypeToChar } from './fasadTypeToChar'
import { getProfiles, getProfileTypes } from "./profiles"
import { getSpecList, getSpecToCharList, getUnits } from "./spec"
import { getDetailsFromDB } from "./details"
import { getThemes } from "./settings"

export async function getLacobels() {
    const service = new DataBaseService(getDataBaseProvider<LacobelSchema>())
    return await service.getData(DATA_TABLE_NAMES.LACOBEL, [], {})
  }
export async function getFasadDefaultChar() {
  const service = new DataBaseService(getDataBaseProvider<FasadDefaultCharSchema>())
  return await service.getData(DATA_TABLE_NAMES.FASAD_DEFAULT_CHAR, [], {})
}
export async function getMatPurposes() {
    const service = new DataBaseService(getDataBaseProvider<DefaultSchema>())
    return await service.getData(DATA_TABLE_NAMES.MAT_PURPOSE, [], {})
  }
export async function getAllData(): Promise<AllData> {
    const chars = (await getChars()).data
    const fasadDefaultChars = (await getFasadDefaultChar()).data
    const charTypes = (await getCharTypes()).data
    const lacobels = (await getLacobels()).data
    const consoleTypes = (await getConsoleTypes()).data
    const fasadTypes = (await getFasadTypes()).data
    const fasadTypeToChar = (await getFasadTypeToChar()).data
    const wardrobeTypes = (await getWardrobeTypes()).data
    const wardrobes = (await getWardrobes()).data
    const units = (await getUnits()).data
    const profiles = await getProfiles()
    const profileTypes = await getProfileTypes()
    const spec = (await getSpecList()).data
    const specToChar = (await getSpecToCharList()).data
    const detailNames = (await getDetailsFromDB()).data
    const charPurpose = (await getCharPurpose()).data
    const matPurposes = (await getMatPurposes()).data
    const wardrobesDimensions = (await getWardrobesDimensions()).data
    const wardrobesFasadCount = (await getWardrobesFasadCount()).data
    const settings = {
      themes: ((await getThemes()).data)
    }
    return {
        chars,
        fasadDefaultChars,
        charTypes,
        charPurpose,
        matPurposes,
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
        specToChar,
        detailNames,
        wardrobesDimensions,
        wardrobesFasadCount,
        settings
    }
  }
