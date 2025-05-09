import { WardrobeData, SpecificationResult, DETAIL_NAME, Detail } from "../../../../types/wardrobe";
import { getDetailsFromDB } from "../../../routers/functions/details";
import { getCommonData } from "../corpus";
import { getKromka, nullDetail } from "../functions";


export async function getPillarSpecification(data: WardrobeData): Promise<SpecificationResult[]> {
    const result: SpecificationResult[] = []
    const pillar = (await getDetailsFromDB()).data.find(d => d.id === DETAIL_NAME.PILLAR) || nullDetail()
    const details: Detail[] = [
        {
            id: DETAIL_NAME.PILLAR,
            count: 1,
            length: 282,
            width: data.depth - 100,
            kromka: getKromka(pillar),
            confirmat: pillar.confirmat,
            minifix: pillar.minifix

        },
    ]
    await getCommonData(data, details, result)
    return result
}


