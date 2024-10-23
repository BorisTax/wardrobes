import { SpecItem } from "../../../../types/specification";
import { WardrobeData, SpecificationResult, DETAIL_NAME, Detail } from "../../../../types/wardrobe";
import { getKromkaAndZaglByDSP, getKromkaTypeByChar } from "../../../routers/functions/dspEdgeZag";
import { getKromkaPrimary, getKromkaSecondary, getGlue, getConfirmat, getMinifix } from "../corpus";
import { getDSP } from "../functions";
import { pillarKromka } from "../kromka";


export async function getPillarSpecification(data: WardrobeData): Promise<SpecificationResult[]> {
    const result: SpecificationResult[] = []
    const details: Detail[] = [
        { id: DETAIL_NAME.PILLAR, count: 1, length: 282, width: data.depth - 100, kromka: pillarKromka() },
    ]
    const kromkaAndZagl = await getKromkaAndZaglByDSP(data.dspId)
    const kromkaSpecId = await getKromkaTypeByChar(kromkaAndZagl.kromkaId)
    const kromkaPrimary = (await getKromkaPrimary(data, details, kromkaAndZagl.kromkaId))
    const kromkaSecondary = await getKromkaSecondary(data, details, kromkaSpecId, kromkaAndZagl.kromkaId)
    const conf = await getConfirmat(data, details)
    const minifix = await getMinifix(data, details)
    result.push([SpecItem.DSP16, await getDSP(data, details)])
    result.push([kromkaSpecId, kromkaSecondary])
    result.push([SpecItem.Glue, await getGlue(data, kromkaPrimary.data.amount, kromkaPrimary.data.amount)])
    result.push([SpecItem.Confirmat, conf])
    result.push([SpecItem.ZagConfirmat, { data: { amount: conf.data.amount } }])
    result.push([SpecItem.Minifix, minifix])
    result.push([SpecItem.ZagMinifix, { data: { amount: minifix.data.amount } }])
    return result
}


