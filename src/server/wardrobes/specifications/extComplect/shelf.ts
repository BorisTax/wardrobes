import { WardrobeData, SpecificationResult, DETAIL_NAME, Detail } from "../../../../types/wardrobe";
import { getDetailsFromDB } from "../../../routers/functions/details";
import { getDetails, getCommonData } from "../corpus";
import { getKromka, nullDetail } from "../functions";


export async function getShelfSpecification(data: WardrobeData): Promise<SpecificationResult[]> {
    const result: SpecificationResult[] = []
    const alldetails = (await getDetails(data.wardrobeTypeId, data.wardrobeId, data.width, data.height, data.depth))
    const shelfName = (await getDetailsFromDB()).data.find(d => d.id === DETAIL_NAME.SHELF) || nullDetail()
    const shelf = alldetails.find(d => d.id === DETAIL_NAME.SHELF)
    if (!shelf) return result
    const details: Detail[] = [
        {
            id: DETAIL_NAME.SHELF,
            count: 1, length: shelf.length,
            width: shelf.width,
            kromka: getKromka(shelfName),
            confirmat: shelfName.confirmat,
            minifix: shelfName.minifix
        },
    ]
    await getCommonData(data, details, result)
    return result
}


