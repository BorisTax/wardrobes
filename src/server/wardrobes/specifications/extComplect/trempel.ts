import { SpecItem } from "../../../../types/specification";
import { WardrobeData, SpecificationResult, FullData, VerboseData } from "../../../../types/wardrobe";
import { getChar } from "../../../routers/functions/chars";
import { getTrempelByDepth } from "../../../routers/functions/furniture";
import { getTrempel } from "../corpus";


export async function getTrempelSpecification(data: WardrobeData): Promise<SpecificationResult[]> {
    const result: SpecificationResult[] = []
    const trempel = await getTrempelExt(data.depth, await getTrempel(data))
    if (trempel.data.amount === 0) return result
    result.push([SpecItem.Trempel, trempel])
    result.push([SpecItem.Samorez16, { data: { amount: 4 } }])
    return result
}

async function getTrempelExt(depth: number, data: FullData): Promise<FullData>{
    const count = data.data.amount ? 1 : 0
    const {id} = await getTrempelByDepth(depth)
    const charName = (await getChar(id)).name || ""
    const verbose: VerboseData = [["Глубина шкафа", "Тремпель", "Кол-во"]];
    verbose.push([`${depth}`, `${charName}`, `${count}`]);
    return { data: { amount: count, charId: id }, verbose };
}
