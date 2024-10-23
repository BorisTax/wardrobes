import { SpecItem } from "../../../../types/specification";
import { WardrobeData, SpecificationResult, DETAIL_NAME, Detail, FullData, CONSOLE_TYPE } from "../../../../types/wardrobe";
import { getKromkaPrimary, getKromkaSecondary, getGlue } from "../corpus";
import { getDSP } from "../functions";
import { consoleRoofKromka, consoleShelfKromka, consoleStandKromka, consoleStandSideKromka } from "../kromka";
import { getKromkaAndZaglByDSP, getKromkaTypeByChar } from "../../../routers/functions/dspEdgeZag";
import { getDetailNames } from "../../../routers/functions/details";


export async function getConsoleSpecification(data: WardrobeData): Promise<SpecificationResult[]> {
    const result: SpecificationResult[] = []
    const console = data.extComplect.console
    if (console.height === 0 || console.width === 0 || console.depth === 0) return result
    const shelfCount = console.height < 2300 ? 4 : 5
    const details: Detail[] = [
        { id: DETAIL_NAME.CONSOLE_ROOF, count: 2, length: console.depth, width: console.width, kromka: consoleRoofKromka() },
        { id: DETAIL_NAME.CONSOLE_STAND, count: 1, length: console.height - 62, width: console.depth, kromka: consoleStandKromka() },
        { id: DETAIL_NAME.CONSOLE_BACK_STAND, count: 1, length: console.height - 62, width: console.width - 16, kromka: consoleStandSideKromka() },
    ]
    if (console.typeId === CONSOLE_TYPE.STANDART)
        details.push({ id: DETAIL_NAME.CONSOLE_SHELF, count: shelfCount, length: console.depth - 20, width: console.width - 20, kromka: consoleShelfKromka() });
    else {
        details.push({ id: DETAIL_NAME.CONSOLE_SHELF, count: 2, length: console.depth - 20, width: console.width - 64, kromka: consoleShelfKromka() });
        details.push({ id: DETAIL_NAME.CONSOLE_SHELF, count: 2, length: console.depth - 20, width: console.width - 89, kromka: consoleShelfKromka() });
        if (console.height >= 2300) details.push({ id: DETAIL_NAME.CONSOLE_SHELF, count: 1, length: console.depth - 20, width: console.width - 96, kromka: consoleShelfKromka() });
    }
    const kromkaAndZagl = await getKromkaAndZaglByDSP(data.dspId)
    const kromkaSpecId = await getKromkaTypeByChar(kromkaAndZagl.kromkaId)
    const kromkaPrimary = (await getKromkaPrimary(data, details, kromkaAndZagl.kromkaId))
    const kromkaSecondary = await getKromkaSecondary(data, details, kromkaSpecId, kromkaAndZagl.kromkaId)
    result.push([SpecItem.DSP16, await getDSP(data, details)])
    result.push([SpecItem.Kromka2, kromkaPrimary])
    result.push([SpecItem.Glue, await getGlue(data, kromkaPrimary.data.amount, kromkaSecondary.data.amount)])
    result.push([SpecItem.Minifix, await getConsoleMinifix()])
    result.push([SpecItem.Confirmat, await getConsoleConfirmat(details)])
    result.push([SpecItem.Leg, { data: { amount: 1 } }])
    result.push([SpecItem.StyagkaM6, { data: { amount: 3 } }])
    const karton = 2
    result.push([SpecItem.Karton, { data: { amount: karton } }])
    result.push([SpecItem.Skotch, { data: { amount: karton * 20 } }])
    result.push([SpecItem.ConfKluch, { data: { amount: 1 } }])
    return result
}

async function getConsoleMinifix(): Promise<FullData> {
    const detailNames = (await getDetailNames()).data
    const verbose = [["Деталь", "Кол-во", "Минификсы"]]
    const caption = detailNames.find(n => n.id === DETAIL_NAME.CONSOLE_ROOF)?.name || ""
    const count = 2 * 3
    verbose.push([caption, `2`, `${count}`])
    return { data: { amount: count }, verbose }
}
async function getConsoleConfirmat(details: Detail[]): Promise<FullData> {
    const detailNames = (await getDetailNames()).data
    const verbose = [["Деталь", "Кол-во", "Конфирматы"]]
    let total = 0
    for (let d of details) {
        if (d.id !== DETAIL_NAME.CONSOLE_SHELF) continue;
        const caption = detailNames.find(n => n.id === d.id)?.name || ""
        verbose.push([caption, `${d.count}`, `${d.count * 3}`])
        total += d.count * 3
    }
    return { data: { amount: total }, verbose }
}
