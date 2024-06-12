import { Result } from "../../types/server"
import { Detail, WardrobeData } from "../../types/wardrobe"
import { getDetails } from "./functions"

export async function getVerboseDSPData(data: WardrobeData): Promise<Result<Detail[]>>{
        const result = await getDetails(data.wardKind, data.width, data.height, data.depth)
        return { success: true, status: 200, data: result }
  }