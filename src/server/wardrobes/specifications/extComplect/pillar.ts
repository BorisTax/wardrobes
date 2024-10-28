import { WardrobeData, SpecificationResult, DETAIL_NAME, Detail } from "../../../../types/wardrobe";
import { getCommonData } from "../corpus";
import { pillarKromka } from "../kromka";


export async function getPillarSpecification(data: WardrobeData): Promise<SpecificationResult[]> {
    const result: SpecificationResult[] = []
    const details: Detail[] = [
        { id: DETAIL_NAME.PILLAR, count: 1, length: 282, width: data.depth - 100, kromka: pillarKromka() },
    ]
    await getCommonData(data, details, result)
    return result
}


