import { SpecItem } from "../../../../types/specification";
import { WardrobeData, SpecificationResult, DETAIL_NAME, Detail, FullData, CONSOLE_TYPE } from "../../../../types/wardrobe";
import { getCommonData } from "../corpus";
import { consoleRoofKromka, consoleShelfKromka, consoleStandKromka, consoleStandSideKromka } from "../kromka";
import { getDrill } from "../functions";


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
    details.forEach(d => d.drill = getDrill(d.id))
    await getCommonData(data, details, result)
    result.push([SpecItem.Leg, { data: { amount: 1 } }])
    result.push([SpecItem.StyagkaM6, { data: { amount: 3 } }])
    const karton = 2
    result.push([SpecItem.Karton, { data: { amount: karton } }])
    result.push([SpecItem.Skotch, { data: { amount: karton * 20 } }])
    result.push([SpecItem.ConfKluch, { data: { amount: 1 } }])
    return result
}


