import { StatusCodes } from "http-status-codes"
import { ProfileType } from "../../../types/enums"
import { DATA_TABLE_NAMES, ProfileSchema, SpecSchema, SpecToCharSchema, UnitsSchema } from "../../../types/schemas"
import { Result } from "../../../types/server"
import { CORPUS_SPECS, FasadSpecById } from "../../../types/specification"
import { SpecificationMultiResult, SpecificationResult, WardrobeData } from "../../../types/wardrobe"
import { getDataBaseProvider } from "../../options"
import { DataBaseService } from "../../services/dataBaseService"
import { getCorpusSpecification } from "../../wardrobes/specifications/corpus"
import { getExtComplectSpecification } from "../../wardrobes/specifications/extComplect/extComplect"
import { createFasades, getFasadSpecification } from "../../wardrobes/specifications/fasades"
import { getProfiles } from "./profiles"
import { AppState } from "../../../types/app"
import { newFasadFromState } from "../../../functions/fasades"

export async function getSpecList(): Promise<Result<SpecSchema>> {
  const service = new DataBaseService(getDataBaseProvider<SpecSchema>())
  return await service.getData(DATA_TABLE_NAMES.SPEC, [], {})
}
export async function getSpecToCharList(): Promise<Result<SpecToCharSchema>> {
  const service = new DataBaseService(getDataBaseProvider<SpecToCharSchema>())
  return await service.getData(DATA_TABLE_NAMES.SPEC_TO_CHAR, [], {})
}
export async function updateSpecData(data: SpecSchema): Promise<Result<null>> {
  const service = new DataBaseService(getDataBaseProvider<SpecSchema>())
  return await service.updateData(DATA_TABLE_NAMES.SPEC, data)
}

export async function getAllCharOfSpec(specId: number) {
  const service = new DataBaseService(getDataBaseProvider<SpecToCharSchema>())
  const result = await service.getData(DATA_TABLE_NAMES.SPEC_TO_CHAR, ["charId"], { id: specId })
  const charId = (result.data).map(c => c.charId)
  return charId
}

export async function getSpecData(data: WardrobeData, resetDetails: boolean, verbose = false): Promise<Result<SpecificationMultiResult>> {
  const result: SpecificationMultiResult[] = []
  const profiles = await getProfiles()
  const profile: ProfileSchema | undefined = profiles?.find(p => p.id === data.profileId)
  const fasades = createFasades(data, profile?.type as ProfileType)
  const corpus = await getCorpusSpecification(data, resetDetails, verbose)
  result.push({ type: CORPUS_SPECS.CORPUS, spec: corpus })
  for (let f of fasades) {
    const fasadSpec = await getFasadSpecification(f, profile as ProfileSchema, verbose)
    result.push({ type: FasadSpecById[f.FasadType - 1], spec: fasadSpec })
  }
  const extSpec = await getExtComplectSpecification(data, verbose)
  for (let ext of extSpec) {
    result.push(ext)
  }
  return { success: true, status: StatusCodes.OK, data: result }
}
export async function getSpecCombiData(data: AppState, verbose = false): Promise<Result<SpecificationResult[]>> {
  const result: (SpecificationResult[])[] = []
  const profiles = await getProfiles()
  const profile: ProfileSchema | undefined = profiles?.find(p => p.id === data.profile.id)
  if (!profile) return { success: false, status: StatusCodes.BAD_REQUEST, data: result }
  const fasades = data.rootFasadesState.map(r => newFasadFromState(r))
  for (let f of fasades) {
    const fasadSpec = await getFasadSpecification(f, profile as ProfileSchema, verbose)
    //const fasadSpecConverted = flattenSpecification(filterEmptySpecification(fasadSpec))
    result.push(fasadSpec)
  }
  return { success: true, status: StatusCodes.OK, data: result }
}


export async function getUnits(): Promise<Result<UnitsSchema>> {
  const service = new DataBaseService(getDataBaseProvider<UnitsSchema>())
  return await service.getData(DATA_TABLE_NAMES.UNITS, [], {})
}