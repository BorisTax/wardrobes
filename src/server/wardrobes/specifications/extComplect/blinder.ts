import { SpecItem } from "../../../../types/specification";
import { WardrobeData, SpecificationResult, DETAIL_NAME, Detail, FullData } from "../../../../types/wardrobe";
import { getDetailsFromDB } from "../../../routers/functions/details";
import { getCommonData } from "../corpus";
import { getKromka, nullDetail } from "../functions";


export async function getBlinderSpecification(data: WardrobeData): Promise<SpecificationResult[]> {
    const result: SpecificationResult[] = []
    const count = data.width < 2750 ? 1 : 2
    const blinder = (await getDetailsFromDB()).data.find(d => d.id === DETAIL_NAME.BLINDER) || nullDetail()
    const details: Detail[] = [
        { id: DETAIL_NAME.BLINDER, 
            count, 
            length: Math.round(data.width / count), 
            width: 284, 
            kromka: getKromka(blinder),
            confirmat: blinder.confirmat,
            minifix: blinder.minifix
        },
    ]
    await getCommonData(data, details, result)
    result.push([SpecItem.Samorez30, { data: { amount: 10 } }])
    result.push([SpecItem.Streich, await getStreich(data.width)])
    return result
}

async function getStreich(width: number): Promise<FullData> {
    const detailNames = (await getDetailsFromDB()).data
    const verbose = [["Ширина шкафа", "Стрейч"]]
    const count = width / 1000 * 1.5
    verbose.push([`${width}`, `/ 1000 x 1.5 = ${count.toFixed(3)}`])
    return { data: { amount: count }, verbose }
}

