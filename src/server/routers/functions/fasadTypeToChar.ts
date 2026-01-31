import { DATA_TABLE_NAMES, FasadTypeToCharSchema } from "../../../types/schemas"
import { Result } from "../../../types/server"
import { getDataBaseService } from "../../options";

export async function getFasadTypeToChar() {
  const service = getDataBaseService<FasadTypeToCharSchema>()
  return await service.getData(DATA_TABLE_NAMES.FASAD_TYPE_TO_CHAR, [], {});
}

export async function updateFasadTypeToChar(oldData: FasadTypeToCharSchema,  data: FasadTypeToCharSchema): Promise<Result<null>> {
  const service = getDataBaseService<FasadTypeToCharSchema>()
  return await service.updateData(DATA_TABLE_NAMES.FASAD_TYPE_TO_CHAR, oldData, data)
}

export async function addFasadTypeToChar(data: FasadTypeToCharSchema): Promise<Result<FasadTypeToCharSchema>> {
  const service = getDataBaseService<FasadTypeToCharSchema>()
  return await service.addData(DATA_TABLE_NAMES.FASAD_TYPE_TO_CHAR, data)
}
export async function deleteFasadTypeToChar(data: FasadTypeToCharSchema): Promise<Result<null>> {
  const service = getDataBaseService<FasadTypeToCharSchema>()
  return await service.deleteData(DATA_TABLE_NAMES.FASAD_TYPE_TO_CHAR, data)
}


