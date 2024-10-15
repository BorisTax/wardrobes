import { SpecItem } from "../../../../types/specification";
import { WardrobeData, SpecificationResult } from "../../../../types/wardrobe";


export async function getLightSpecification(data: WardrobeData): Promise<SpecificationResult[]> {
    const result: SpecificationResult[] = []
    const light  = data.extComplect.light
    const count = light ? 1 : 0
    result.push([SpecItem.Lamp, { data: { amount: count } }])
    return result
}



