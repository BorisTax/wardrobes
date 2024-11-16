import { SpecItem } from "../../../../types/specification";
import { WardrobeData, SpecificationResult } from "../../../../types/wardrobe";
import { getTrempel } from "../corpus";


export async function getTrempelSpecification(data: WardrobeData): Promise<SpecificationResult[]> {
    const result: SpecificationResult[] = []
    const trempel = await getTrempel(data)
    if (trempel.data.amount === 0) return result
    trempel.data.amount = 1
    result.push([SpecItem.Trempel, trempel])
    result.push([SpecItem.Samorez16, { data: { amount: 4 } }])
    return result
}


