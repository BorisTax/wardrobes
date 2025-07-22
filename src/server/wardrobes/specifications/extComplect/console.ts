import { SpecItem } from "../../../../types/specification";
import { WardrobeData, SpecificationResult, Detail, CONSOLE_TYPE, WARDROBE_KIND, WARDROBE_TYPE } from "../../../../types/wardrobe";
import {  getDetailsFromDB } from "../../../routers/functions/details";
import { getAllCharOfSpec } from "../../../routers/functions/spec";
import { getCommonData, getDetails} from "../corpus";
import { getKromka, nullDetail } from "../functions";


export async function getConsoleSpecification(data: WardrobeData): Promise<SpecificationResult[]> {
    const result: SpecificationResult[] = []
    const console = data.extComplect.console
    if (console.height === 0 || console.width === 0 || console.depth === 0) return result
    const detailsTable = await getDetails(WARDROBE_TYPE.WARDROBE, console.typeId === CONSOLE_TYPE.STANDART ? WARDROBE_KIND.CONSOLE : WARDROBE_KIND.CONSOLE_RADIUS, data.extComplect.console.width, data.extComplect.console.height, data.extComplect.console.depth)
    const detailNames = (await getDetailsFromDB()).data
    const details: Detail[] = detailsTable.map(d => {
        const det = detailNames.find(det => d.id === det.id) || nullDetail()
        return {
            id: d.id,
            length: d.length,
            width: d.width,
            count: d.count,
            kromka: getKromka(det),
            confirmat: det.confirmat,
            minifix: det.minifix
        }
    })
    await getCommonData(data, details, result)
    const legCharId = (await getAllCharOfSpec(SpecItem.Leg))[0] || 0
    result.push([SpecItem.Leg, { data: { amount: 1, charId: legCharId } }])
    result.push([SpecItem.StyagkaM6, { data: { amount: 3 } }])
    const karton = 2
    result.push([SpecItem.Karton, { data: { amount: karton } }])
    result.push([SpecItem.Skotch, { data: { amount: karton * 20 } }])
    result.push([SpecItem.ConfKluch, { data: { amount: 1 } }])
    return result 
}


