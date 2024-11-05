import { SpecItem } from "../../../../types/specification";
import { WardrobeData, SpecificationResult, DETAIL_NAME, FullData, VerboseData } from "../../../../types/wardrobe";
import { getDetails, getTruba } from "../corpus";
import { getCoef } from "../functions";


export async function getTrubaSpecification(data: WardrobeData): Promise<SpecificationResult[]> {
    const result: SpecificationResult[] = []
    const details = (await getDetails(data.wardrobeTypeId, data.wardrobeId, data.width, data.height, data.depth))
    const shelf = details.find(d => d.id === DETAIL_NAME.SHELF_PLAT)
    if (!shelf) return result
    const truba = await getTrubaExt(shelf.length, await getTruba(data, details))
    if (truba.data.amount === 0) return result
    result.push([SpecItem.Truba, truba])
    result.push([SpecItem.Flanec, { data: { amount: 2 } }])
    result.push([SpecItem.Samorez16, { data: { amount: 6 } }])
    //const karton = 2
    //result.push([SpecificationItem.Karton, { data: { amount: karton } }])
    //result.push([SpecificationItem.Skotch, { data: { amount: karton * 20 } }])
    //result.push([SpecificationItem.ConfKluch, { data: { amount: 1 } }])
    return result
}

async function getTrubaExt(shelfPlat: number, data: FullData & {count: number}): Promise<FullData>{
    const size = data.data.amount / (data.count || 1)
    //const caption = await getWardrobeKind(wardKind);
    const coef = await getCoef(SpecItem.Truba)
    const count = 1
    const result = size * count / 1000 * coef
    const coefString = coef !== 1 ? ` x ${coef} =  ${result.toFixed(3)}` : ""
    const verbose: VerboseData = [["Длина платяной полки", "Труба"]];
    verbose.push([`${shelfPlat}`, `${coefString}`]);
    return { data: { amount: result }, verbose };
}

