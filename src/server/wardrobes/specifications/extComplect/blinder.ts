import { SpecItem } from "../../../../types/specification";
import { WardrobeData, SpecificationResult, DETAIL_NAME, Detail, FullData } from "../../../../types/wardrobe";
import { getDetailNames } from "../../../routers/functions/details";
import { getKromkaByDSP } from "../../../routers/functions/dspEdgeZag";
import { getKromkaPrimary, getKromkaSecondary, getGlue } from "../corpus";
import { singleLengthThickDoubleWidthThinKromka } from "../kromka";
import { getDSP } from "../functions";


export async function getBlinderSpecification(data: WardrobeData): Promise<SpecificationResult[]> {
    const result: SpecificationResult[] = []
    const count = data.width < 2750 ? 1 : 2
    const details: Detail[] = [
        { id: DETAIL_NAME.BLINDER, count, length: Math.round(data.width / count), width: 284, kromka: singleLengthThickDoubleWidthThinKromka() },
    ]
    const kromka = await getKromkaByDSP(data.dspId)
    const kromkaPrimary = (await getKromkaPrimary(data, details, kromka.kromkaId))
    const kromkaSecondary = await getKromkaSecondary(data, details, kromka.kromkaSpecId, kromka.kromkaId)
    result.push([SpecItem.DSP16, await getDSP(data, details)])
    result.push([kromka.kromkaSpecId, kromkaSecondary])
    result.push([SpecItem.Kromka2, kromkaPrimary])
    result.push([SpecItem.Glue, await getGlue(data, kromkaPrimary.data.amount, kromkaSecondary.data.amount)])
    result.push([SpecItem.Samorez30, { data: { amount: 10 } }])
    result.push([SpecItem.Streich, await getStreich(data.width)])
    return result
}

async function getStreich(width: number): Promise<FullData> {
    const detailNames = (await getDetailNames()).data
    const verbose = [["Ширина шкафа", "Стрейч"]]
    const count = width / 1000 * 1.5
    verbose.push([`${width}`, `/ 1000 x 1.5 = ${count.toFixed(3)}`])
    return { data: { amount: count }, verbose }
}

