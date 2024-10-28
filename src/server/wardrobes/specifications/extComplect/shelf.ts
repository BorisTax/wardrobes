import { WardrobeData, SpecificationResult, DETAIL_NAME, Detail } from "../../../../types/wardrobe";
import { getDetails, getCommonData } from "../corpus";
import { singleLengthThinKromka } from "../kromka";


export async function getShelfSpecification(data: WardrobeData): Promise<SpecificationResult[]> {
    const result: SpecificationResult[] = []
    const alldetails = (await getDetails(data.wardTypeId, data.wardKindId, data.width, data.height, data.depth))
    const shelf = alldetails.find(d => d.id === DETAIL_NAME.SHELF)
    if (!shelf) return result
    const details: Detail[] = [
        { id: DETAIL_NAME.SHELF, count: 1, length: shelf.length, width: shelf.width, kromka: singleLengthThinKromka() },
    ]
    await getCommonData(data, details, result)
    return result
}


