import { SpecificationItem } from "../../../../types/specification";
import { WardrobeData, SpecificationResult, DETAIL_NAME, Detail, FullData } from "../../../../types/wardrobe";
import { getEdge2, getEdge05, getGlue, getDetailNames } from "../corpus";
import { getDSP } from "../functions";


export async function getLightSpecification(data: WardrobeData): Promise<SpecificationResult[]> {
    const result: SpecificationResult[] = []
    const light  = data.extComplect.light
    const count = light ? 1 : 0

    result.push([SpecificationItem.Lamp, { data: { amount: count } }])
    //const karton = 2
    //result.push([SpecificationItem.Karton, { data: { amount: karton } }])
    //result.push([SpecificationItem.Skotch, { data: { amount: karton * 20 } }])
    //result.push([SpecificationItem.ConfKluch, { data: { amount: 1 } }])
    return result
}



