import { SpecificationItem } from "../../../../types/specification";
import { WardrobeData, SpecificationResult, DETAIL_NAME, Detail, FullData } from "../../../../types/wardrobe";
import { getEdge2, getEdge05, getGlue, getDetailNames } from "../corpus";
import { singleLengthThinEdge } from "../edges";
import { getDSP } from "../functions";


export async function getStandSpecification(data: WardrobeData): Promise<SpecificationResult[]> {
    const result: SpecificationResult[] = []
    const stand  = data.extComplect.stand
    if (stand.height === 0) return result
    const details: Detail[] = [
        { name: DETAIL_NAME.INNER_STAND, count: 1, length: stand.height, width: data.depth - 100, edge: singleLengthThinEdge() },
    ]
    const edge2 = await getEdge2(data, details)
    const edge05 = await getEdge05(data, details)
    const minifix = await getMinifix()
    result.push([SpecificationItem.DSP, await getDSP(data, details)])
    result.push([SpecificationItem.Kromka05, edge05])
    result.push([SpecificationItem.Glue, await getGlue(data, edge2.data.amount, edge05.data.amount)])
    result.push([SpecificationItem.Minifix, minifix])
    result.push([SpecificationItem.ZagMinifix, { data: { amount: minifix.data.amount } }])
    //const karton = 2
    //result.push([SpecificationItem.Karton, { data: { amount: karton } }])
    //result.push([SpecificationItem.Skotch, { data: { amount: karton * 20 } }])
    //result.push([SpecificationItem.ConfKluch, { data: { amount: 1 } }])
    return result
}

async function getMinifix(): Promise<FullData> {
    const detailNames = await getDetailNames()
    const verbose = [["Деталь", "Кол-во", "Минификсы"]]
    const caption = detailNames.find(n => n.name === DETAIL_NAME.INNER_STAND)?.caption || ""
    const count = 4
    verbose.push([caption, `1`, `${count}`])
    return { data: { amount: count }, verbose }
}

