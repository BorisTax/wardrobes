import { DATA_TABLE_NAMES, DefaultSchema, DVPTableSchema } from "../../../types/schemas"
import { Result } from "../../../types/server"
import { WardrobeDetailTableSchema } from "../../../types/schemas"
import { getDataBaseProvider } from "../../options"
import { DataBaseService } from "../../services/dataBaseService"

export async function getDetailTable({ id, detailId }: { id: number, detailId?: number }): Promise<Result<WardrobeDetailTableSchema[]>> {
    const service = new DataBaseService(getDataBaseProvider<WardrobeDetailTableSchema>())
    return await service.getData(DATA_TABLE_NAMES.WARDROBE_DETAIL_TABLE, ["detailId", "count", "size"], { id, detailId })
  }
export async function getDetailsFromTable(id: number, width: number, height: number): Promise<WardrobeDetailTableSchema[]> {
    const allDetails = (await getDetailTable({id})).data || []
    const details = allDetails.filter(d => width >= d.minWidth && width <= d.maxWidth && height >= d.minHeight && height <= d.maxHeight)
    return details
}

export async function getDVPTemplates(): Promise<Result<DVPTableSchema[]>> {
    const service = new DataBaseService(getDataBaseProvider<DVPTableSchema>())
    return await service.getData(DATA_TABLE_NAMES.DVP_TABLE, [], {})
  }
export async function  getDetailNames(): Promise<Result<DefaultSchema[]>> {
    const service = new DataBaseService(getDataBaseProvider<DefaultSchema>())
    return await service.getData(DATA_TABLE_NAMES.DETAILS, [], {})
  }