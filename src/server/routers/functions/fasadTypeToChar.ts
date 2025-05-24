import { StatusCodes } from "http-status-codes"
import { DATA_TABLE_NAMES, FasadTypeToCharSchema } from "../../../types/schemas"
import { Result } from "../../../types/server"
import { getDataBaseProvider } from "../../options"
import { DataBaseService } from "../../services/dataBaseService"

export async function getFasadTypeToChar() {
  const service = new DataBaseService(getDataBaseProvider<FasadTypeToCharSchema>());
  return await service.getData(DATA_TABLE_NAMES.FASAD_TYPE_TO_CHAR, [], {});
}

export async function updateFasadTypeToChar(oldData: FasadTypeToCharSchema,  data: FasadTypeToCharSchema): Promise<Result<null>> {
  const service = new DataBaseService(getDataBaseProvider<FasadTypeToCharSchema>())
  return await service.updateData(DATA_TABLE_NAMES.FASAD_TYPE_TO_CHAR, oldData, data)
}

export async function addFasadTypeToChar(data: FasadTypeToCharSchema): Promise<Result<FasadTypeToCharSchema>> {
  const service = new DataBaseService(getDataBaseProvider<FasadTypeToCharSchema>())
  return await service.addData(DATA_TABLE_NAMES.FASAD_TYPE_TO_CHAR, data)
}
export async function deleteFasadTypeToChar(data: FasadTypeToCharSchema): Promise<Result<null>> {
  const service = new DataBaseService(getDataBaseProvider<FasadTypeToCharSchema>())
  return await service.deleteData(DATA_TABLE_NAMES.FASAD_TYPE_TO_CHAR, data)
}


