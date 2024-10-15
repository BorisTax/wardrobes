import { SpecItem } from "../../../../types/specification";
import { WardrobeData, SpecificationResult, DETAIL_NAME, Detail } from "../../../../types/wardrobe";
import { getKromkaByDSP } from "../../../routers/functions/dspEdgeZag";
import { getDetails, getKromkaPrimary, getKromkaSecondary, getGlue, getConfirmat } from "../corpus";
import { singleLengthThinEdge } from "../edges";
import { getDSP } from "../functions";


export async function getShelfPlatSpecification(data: WardrobeData): Promise<SpecificationResult[]> {
    const result: SpecificationResult[] = []
    const details = (await getDetails(data.wardTypeId, data.wardKindId, data.width, data.height, data.depth))
    const shelf = details.find(d => d.id === DETAIL_NAME.SHELF_PLAT)
    if (!shelf) return result
    const shelves: Detail[] = [
        { id: DETAIL_NAME.SHELF_PLAT, count: 1, length: shelf.length, width: shelf.width, kromka: singleLengthThinEdge() },
    ]
    const kromka = await getKromkaByDSP(data.dspId)
    const kromkaPrimary = (await getKromkaPrimary(data, shelves, kromka.kromkaId))
    const kromkaSecondary = await getKromkaSecondary(data, shelves, kromka.kromkaSpecId, kromka.kromkaId)
    const conf = await getConfirmat(data, shelves)
    result.push([SpecItem.DSP16, await getDSP(data, shelves)])
    result.push([kromka.kromkaSpecId, kromkaSecondary])
    result.push([SpecItem.Glue, await getGlue(data, kromkaPrimary.data.amount, kromkaSecondary.data.amount)])
    result.push([SpecItem.Confirmat, conf])
    result.push([SpecItem.ZagConfirmat, { data: { amount: conf.data.amount } }])
    return result
}


