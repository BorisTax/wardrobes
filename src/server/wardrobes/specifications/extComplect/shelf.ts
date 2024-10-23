import { SpecItem } from "../../../../types/specification";
import { WardrobeData, SpecificationResult, DETAIL_NAME, Detail } from "../../../../types/wardrobe";
import { getKromkaAndZaglByDSP, getKromkaTypeByChar } from "../../../routers/functions/dspEdgeZag";
import { getKromkaPrimary, getKromkaSecondary, getGlue, getConfirmat, getDetails } from "../corpus";
import { singleLengthThinKromka } from "../kromka";
import { getDSP } from "../functions";


export async function getShelfSpecification(data: WardrobeData): Promise<SpecificationResult[]> {
    const result: SpecificationResult[] = []
    const details = (await getDetails(data.wardTypeId, data.wardKindId, data.width, data.height, data.depth))
    const shelf = details.find(d => d.id === DETAIL_NAME.SHELF)
    if (!shelf) return result
    const shelves: Detail[] = [
        { id: DETAIL_NAME.SHELF, count: 1, length: shelf.length, width: shelf.width, kromka: singleLengthThinKromka() },
    ]
    const kromkaAndZagl = await getKromkaAndZaglByDSP(data.dspId)
    const kromkaSpecId = await getKromkaTypeByChar(kromkaAndZagl.kromkaId)
    const kromkaPrimary = (await getKromkaPrimary(data, shelves, kromkaAndZagl.kromkaId))
    const kromkaSecondary = await getKromkaSecondary(data, shelves, kromkaSpecId, kromkaAndZagl.kromkaId)
    const conf = await getConfirmat(data, shelves)
    result.push([SpecItem.DSP16, await getDSP(data, shelves)])
    result.push([kromkaSpecId, kromkaSecondary])
    result.push([SpecItem.Glue, await getGlue(data, kromkaPrimary.data.amount, kromkaSecondary.data.amount)])
    result.push([SpecItem.Confirmat, conf])
    result.push([SpecItem.ZagConfirmat, { data: { amount: conf.data.amount } }])
    return result
}


