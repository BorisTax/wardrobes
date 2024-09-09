import { SpecificationItem } from "../../../../types/specification";
import { WardrobeData, SpecificationResult, FullData, VerboseData } from "../../../../types/wardrobe";
import { getTrempel } from "../corpus";


export async function getTrempelSpecification(data: WardrobeData): Promise<SpecificationResult[]> {
    const result: SpecificationResult[] = []
    const trempel = await getTrempelExt(data.depth, await getTrempel(data))
    if (trempel.data.amount === 0) return result
    result.push([SpecificationItem.Trempel, trempel])
    result.push([SpecificationItem.Samorez16, { data: { amount: 4 } }])
    return result
}

async function getTrempelExt(depth: number, data: FullData): Promise<FullData>{
    const count = data.data.amount ? 1 : 0
    const verbose: VerboseData = [["Глубина шкафа", "Тремпель", "Кол-во"]];
    verbose.push([`${depth}`, `${data.data.char?.caption}`, `${count}`]);
    return { data: { amount: count, char: data.data.char }, verbose };
}
