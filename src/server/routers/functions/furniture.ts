import { DATA_TABLE_NAMES, FurnitureTableSchema } from "../../../types/schemas";
import { Result } from "../../../types/server";
import { getDataBaseProvider } from "../../options";
import { DataBaseService } from "../../services/dataBaseService";

export async function getFurniture(wardrobeId: number, specId: number, width: number, height: number, depth: number) {
    const service = new DataBaseService(getDataBaseProvider<FurnitureTableSchema>())
    const allFurniture = (await service.getData(DATA_TABLE_NAMES.FURNITURE, [], { wardrobeId, specId })).data
    const furniture = allFurniture.filter(d => width >= d.minWidth && width <= d.maxWidth && height >= d.minHeight && height <= d.maxHeight && depth >= d.minDepth && depth <= d.maxDepth)
    return furniture
}


export async function getFurnitureTable(): Promise<FurnitureTableSchema[]>{
  const service = new DataBaseService(getDataBaseProvider<FurnitureTableSchema>())
  return (await service.getData(DATA_TABLE_NAMES.FURNITURE, [], {})).data || []
}

export async function addFurnitureTable(data: FurnitureTableSchema): Promise<Result<FurnitureTableSchema>> {
  const service = new DataBaseService(getDataBaseProvider<FurnitureTableSchema>())
  return await service.addData(DATA_TABLE_NAMES.FURNITURE, data)
}

export async function deleteFurnitureTable(id: number): Promise<Result<null>> {
  const service = new DataBaseService(getDataBaseProvider<FurnitureTableSchema>())
  return await service.deleteData(DATA_TABLE_NAMES.FURNITURE, { id })
}

export async function updateFurnitureTable(data: Partial<FurnitureTableSchema>): Promise<Result<null>> {
  const service = new DataBaseService(getDataBaseProvider<FurnitureTableSchema>())
  return await service.updateData(DATA_TABLE_NAMES.FURNITURE, { id: data.id }, data)
}