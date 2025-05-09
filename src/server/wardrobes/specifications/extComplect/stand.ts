import { WardrobeData, SpecificationResult, DETAIL_NAME, Detail, FullData } from "../../../../types/wardrobe";
import { getDetailsFromDB } from "../../../routers/functions/details";
import { getCommonData } from "../corpus";
import { getKromka, nullDetail } from "../functions";


export async function getStandSpecification(data: WardrobeData): Promise<SpecificationResult[]> {
    const result: SpecificationResult[] = []
    const stand = data.extComplect.stand
    if (stand.height === 0) return result
    const shelfName = (await getDetailsFromDB()).data.find(d => d.id === DETAIL_NAME.SHELF) || nullDetail()
    const details: Detail[] = [
        {
            id: DETAIL_NAME.INNER_STAND,
            count: 1,
            length: stand.height,
            width: data.depth - 100,
            kromka: getKromka(shelfName),
            confirmat: shelfName.confirmat,
            minifix: shelfName.minifix
        },
    ]
    await getCommonData(data, details, result)
    return result
}

async function getMinifix(): Promise<FullData> {
    const detailNames = (await getDetailsFromDB()).data
    const verbose = [["Деталь", "Кол-во", "Минификсы"]]
    const caption = detailNames.find(n => n.id === DETAIL_NAME.INNER_STAND)?.name || ""
    const count = 4
    verbose.push([caption, `1`, `${count}`])
    return { data: { amount: count }, verbose }
}

