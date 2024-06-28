import { SpecificationItem } from "../../../../types/specification";
import { WardrobeData, SpecificationResult, DETAIL_NAME, Detail, FullData, CONSOLE_TYPE } from "../../../../types/wardrobe";
import { getEdge2, getEdge05, getGlue, getDetailNames } from "../corpus";
import { getDSP } from "../functions";


export async function getConsoleSpecification(data: WardrobeData): Promise<SpecificationResult[]> {
    const result: SpecificationResult[] = []
    const console = data.extComplect.console
    if (console.height === 0 || console.width === 0 || console.depth === 0) return result
    const shelfCount = console.height < 2300 ? 4 : 5
    const details: Detail[] = [
        { name: DETAIL_NAME.CONSOLE_ROOF, count: 2, length: console.depth, width: console.width },
        { name: DETAIL_NAME.CONSOLE_STAND, count: 1, length: console.height - 62, width: console.depth },
        { name: DETAIL_NAME.CONSOLE_BACK_STAND, count: 1, length: console.height - 62, width: console.width - 16 },
    ]
    if (console.type === CONSOLE_TYPE.STANDART)
        details.push({ name: DETAIL_NAME.CONSOLE_SHELF, count: shelfCount, length: console.depth - 20, width: console.width - 20 });
    else {
        details.push({ name: DETAIL_NAME.CONSOLE_SHELF, count: 2, length: console.depth - 20, width: console.width - 64 });
        details.push({ name: DETAIL_NAME.CONSOLE_SHELF, count: 2, length: console.depth - 20, width: console.width - 89 });
        if (console.height >= 2300) details.push({ name: DETAIL_NAME.CONSOLE_SHELF, count: 1, length: console.depth - 20, width: console.width - 96 });
    }
    const edge2 = await getEdge2(data, details)
    const edge05 = await getEdge05(data, details)
    result.push([SpecificationItem.DSP, await getDSP(data, details)])
    result.push([SpecificationItem.Kromka2, edge2])
    result.push([SpecificationItem.Glue, await getGlue(data, edge2.data.amount, edge05.data.amount)])
    result.push([SpecificationItem.Minifix, await getConsoleMinifix()])
    result.push([SpecificationItem.Confirmat, await getConsoleConfirmat(details)])
    result.push([SpecificationItem.Leg, { data: { amount: 1 } }])
    result.push([SpecificationItem.StyagkaM6, { data: { amount: 3 } }])
    const karton = 2
    result.push([SpecificationItem.Karton, { data: { amount: karton } }])
    result.push([SpecificationItem.Skotch, { data: { amount: karton * 20 } }])
    result.push([SpecificationItem.ConfKluch, { data: { amount: 1 } }])
    return result
}

async function getConsoleMinifix(): Promise<FullData> {
    const detailNames = await getDetailNames()
    const verbose = [["Деталь", "Кол-во", "Минификсы"]]
    const caption = detailNames.find(n => n.name === DETAIL_NAME.CONSOLE_ROOF)?.caption || ""
    const count = 2 * 3
    verbose.push([caption, `2`, `${count}`])
    return { data: { amount: count }, verbose }
}
async function getConsoleConfirmat(details: Detail[]): Promise<FullData> {
    const detailNames = await getDetailNames()
    const verbose = [["Деталь", "Кол-во", "Конфирматы"]]
    let total = 0
    for (let d of details) {
        if (d.name !== DETAIL_NAME.CONSOLE_SHELF) continue;
        const caption = detailNames.find(n => n.name === d.name)?.caption || ""
        verbose.push([caption, `${d.count}`, `${d.count * 3}`])
        total += d.count * 3
    }
    return { data: { amount: total }, verbose }
}
