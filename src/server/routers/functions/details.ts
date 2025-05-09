import { DATA_TABLE_NAMES, DefaultSchema, DetailSchema, DVPTableSchema } from "../../../types/schemas"
import { Result } from "../../../types/server"
import { WardrobeDetailTableSchema } from "../../../types/schemas"
import { getDataBaseProvider } from "../../options"
import { DataBaseService } from "../../services/dataBaseService"

export async function getDetailTable(data: Partial<WardrobeDetailTableSchema>): Promise<Result<WardrobeDetailTableSchema>> {
  const service = new DataBaseService(getDataBaseProvider<WardrobeDetailTableSchema>())
  return await service.getData(DATA_TABLE_NAMES.WARDROBE_DETAIL_TABLE, [], data)
}

export async function getDetailsByWardrobe(wardrobeId: number, width: number, height: number): Promise<WardrobeDetailTableSchema[]> {
  const allDetails = (await getDetailTable({ wardrobeId })).data
  const details = allDetails.filter(d => width >= d.minWidth && width <= d.maxWidth && height >= d.minHeight && height <= d.maxHeight)
  return details
}

export async function getAllDetailsFromTable(): Promise<WardrobeDetailTableSchema[]> {
  const details = (await getDetailTable({})).data || []
  return details
}

export async function getDVPTemplates(): Promise<Result<DVPTableSchema>> {
  const service = new DataBaseService(getDataBaseProvider<DVPTableSchema>())
  return await service.getData(DATA_TABLE_NAMES.DVP_TABLE, [], {})
}
export async function getDetailsFromDB(): Promise<Result<DetailSchema>> {
  const service = new DataBaseService(getDataBaseProvider<DetailSchema>())
  return await service.getData(DATA_TABLE_NAMES.DETAILS, [], {})
}

export async function addDetailTable(data: WardrobeDetailTableSchema): Promise<Result<WardrobeDetailTableSchema>> {
  const service = new DataBaseService(getDataBaseProvider<WardrobeDetailTableSchema>())
  return await service.addData(DATA_TABLE_NAMES.WARDROBE_DETAIL_TABLE, data)
}

export async function deleteDetailTable(id: number): Promise<Result<null>> {
  const service = new DataBaseService(getDataBaseProvider<WardrobeDetailTableSchema>())
  return await service.deleteData(DATA_TABLE_NAMES.WARDROBE_DETAIL_TABLE, { id })
}

export async function updateDetailTable(data: Partial<WardrobeDetailTableSchema>): Promise<Result<null>> {
  const service = new DataBaseService(getDataBaseProvider<WardrobeDetailTableSchema>())
  return await service.updateData(DATA_TABLE_NAMES.WARDROBE_DETAIL_TABLE, { id: data.id }, data)
}