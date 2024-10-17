import { SpecItem } from "../../../../types/specification";
import { WardrobeData, SpecificationResult, DETAIL_NAME, Detail, FullData } from "../../../../types/wardrobe";
import { getDetailNames } from "../../../routers/functions/details";
import { getKromkaByDSP } from "../../../routers/functions/dspEdgeZag";
import { getKromkaPrimary, getKromkaSecondary, getGlue } from "../corpus";
import { singleLengthThinKromka } from "../kromka";
import { getDSP } from "../functions";


export async function getStandSpecification(data: WardrobeData): Promise<SpecificationResult[]> {
    const result: SpecificationResult[] = []
    const stand  = data.extComplect.stand
    if (stand.height === 0) return result
    const details: Detail[] = [
        { id: DETAIL_NAME.INNER_STAND, count: 1, length: stand.height, width: data.depth - 100, kromka: singleLengthThinKromka() },
    ]
    const kromka = await getKromkaByDSP(data.dspId)
    const kromkaPrimary = (await getKromkaPrimary(data, details, kromka.kromkaId))
    const kromkaSecondary = await getKromkaSecondary(data, details, kromka.kromkaSpecId, kromka.kromkaId)
    const minifix = await getMinifix()
    result.push([SpecItem.DSP16, await getDSP(data, details)])
    result.push([kromka.kromkaSpecId, kromkaSecondary])
    result.push([SpecItem.Glue, await getGlue(data, kromkaPrimary.data.amount, kromkaSecondary.data.amount)])
    result.push([SpecItem.Minifix, minifix])
    result.push([SpecItem.ZagMinifix, { data: { amount: minifix.data.amount } }])
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

