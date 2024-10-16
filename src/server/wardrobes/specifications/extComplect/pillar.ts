import { SpecItem } from "../../../../types/specification";
import { WardrobeData, SpecificationResult, DETAIL_NAME, Detail } from "../../../../types/wardrobe";
import { getKromkaByDSP } from "../../../routers/functions/dspEdgeZag";
import { getKromkaPrimary, getKromkaSecondary, getGlue, getConfirmat, getMinifix } from "../corpus";
import { getDSP } from "../functions";
import { pillarKromka } from "../kromka";


export async function getPillarSpecification(data: WardrobeData): Promise<SpecificationResult[]> {
    const result: SpecificationResult[] = []
    const details: Detail[] = [
        { id: DETAIL_NAME.PILLAR, count: 1, length: 282, width: data.depth - 100, kromka: pillarKromka() },
    ]
    const kromka = await getKromkaByDSP(data.dspId)
    const kromkaPrimary = (await getKromkaPrimary(data, details, kromka.kromkaId))
    const kromkaSecondary = await getKromkaSecondary(data, details, kromka.kromkaSpecId, kromka.kromkaId)
    const conf = await getConfirmat(data, details)
    const minifix = await getMinifix(data, details)
    result.push([SpecItem.DSP16, await getDSP(data, details)])
    result.push([kromka.kromkaSpecId, kromkaSecondary])
    result.push([SpecItem.Glue, await getGlue(data, kromkaPrimary.data.amount, kromkaPrimary.data.amount)])
    result.push([SpecItem.Confirmat, conf])
    result.push([SpecItem.ZagConfirmat, { data: { amount: conf.data.amount } }])
    result.push([SpecItem.Minifix, minifix])
    result.push([SpecItem.ZagMinifix, { data: { amount: minifix.data.amount } }])
    return result
}


