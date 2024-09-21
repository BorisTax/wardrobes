import { SpecificationItem } from "../../../../types/specification";
import { WardrobeData, SpecificationResult, DETAIL_NAME, Detail, FullData } from "../../../../types/wardrobe";
import { getEdge2, getEdge05, getGlue, getDetailNames } from "../corpus";
import { singleLengthThickDoubleWidthThinEdge } from "../edges";
import { getDSP } from "../functions";


export async function getBlinderSpecification(data: WardrobeData): Promise<SpecificationResult[]> {
    const result: SpecificationResult[] = []
    const blinder  = data.extComplect.blinder
    const count = data.width < 2750 ? 1 : 2
    const details: Detail[] = [
        { name: DETAIL_NAME.BLINDER, count, length: Math.round(data.width / count), width: 284, edge: singleLengthThickDoubleWidthThinEdge() },
    ]
    const edge2 = await getEdge2(data, details)
    const edge05 = await getEdge05(data, details)
    result.push([SpecificationItem.DSP, await getDSP(data, details)])
    result.push([SpecificationItem.Kromka05, edge05])
    result.push([SpecificationItem.Kromka2, edge2])
    result.push([SpecificationItem.Glue, await getGlue(data, edge2.data.amount, edge05.data.amount)])
    result.push([SpecificationItem.Samorez30, { data: { amount: 10 } }])
    //const karton = 2
    //result.push([SpecificationItem.Karton, { data: { amount: karton } }])
    //result.push([SpecificationItem.Skotch, { data: { amount: karton * 20 } }])
    //result.push([SpecificationItem.ConfKluch, { data: { amount: 1 } }])
    result.push([SpecificationItem.Streich, await getStreich(data.width)])
    return result
}

async function getStreich(width: number): Promise<FullData> {
    const detailNames = await getDetailNames()
    const verbose = [["Ширина шкафа", "Стрейч"]]
    const count = width / 1000 * 1.5
    verbose.push([`${width}`, `/ 1000 x 1.5 = ${count.toFixed(3)}`])
    return { data: { amount: count }, verbose }
}

