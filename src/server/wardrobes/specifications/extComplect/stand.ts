import { WardrobeData, SpecificationResult, DETAIL_NAME, Detail, FullData } from "../../../../types/wardrobe";
import { getDetailNames } from "../../../routers/functions/details";
import { getCommonData } from "../corpus";
import { singleLengthThinKromka } from "../kromka";


export async function getStandSpecification(data: WardrobeData): Promise<SpecificationResult[]> {
    const result: SpecificationResult[] = []
    const stand  = data.extComplect.stand
    if (stand.height === 0) return result
    const details: Detail[] = [
        { id: DETAIL_NAME.INNER_STAND, count: 1, length: stand.height, width: data.depth - 100, kromka: singleLengthThinKromka() },
    ]
    await getCommonData(data, details, result)
    return result
}

async function getMinifix(): Promise<FullData> {
    const detailNames = (await getDetailNames()).data
    const verbose = [["Деталь", "Кол-во", "Минификсы"]]
    const caption = detailNames.find(n => n.id === DETAIL_NAME.INNER_STAND)?.name || ""
    const count = 4
    verbose.push([caption, `1`, `${count}`])
    return { data: { amount: count }, verbose }
}

