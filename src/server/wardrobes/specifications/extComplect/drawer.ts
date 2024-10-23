import { SpecItem } from "../../../../types/specification";
import { WardrobeData, SpecificationResult, DETAIL_NAME, Detail, FullData, DRILL_TYPE } from "../../../../types/wardrobe";
import { getKromkaPrimary, getKromkaSecondary, getGlue, getConfirmat, getDetails } from "../corpus";
import { getDSP, getCoef, emptyFullData } from "../functions";
import { allNoneKromka, allThinKromka, singleLengthThinKromka } from "../kromka";
import { getKromkaAndZaglByDSP, getKromkaTypeByChar } from "../../../routers/functions/dspEdgeZag";
import { getDetailNames } from "../../../routers/functions/details";


export async function getDrawerSpecification(data: WardrobeData): Promise<SpecificationResult[]> {
    const result: SpecificationResult[] = []
    const details = (await getDetails(data.wardTypeId, data.wardKindId, data.width, data.height, data.depth))
    const shelf = details.find(d => d.id === DETAIL_NAME.SHELF)
    if (!shelf) return result
    const telDetails: Detail[] = [
        { id: DETAIL_NAME.DRAWER_FASAD, count: 1, length: shelf.length - 8, width: 140, kromka: allThinKromka(), drill: [DRILL_TYPE.NONE] },
        { id: DETAIL_NAME.DRAWER_SIDE, count: 2, length: data.depth - 150, width: 120, kromka: singleLengthThinKromka(), drill: [DRILL_TYPE.NONE] },
        { id: DETAIL_NAME.DRAWER_BRIDGE, count: 2, length: shelf.length - 57, width: 120, kromka:  singleLengthThinKromka(), drill: [DRILL_TYPE.CONFIRMAT1] }
    ]
    const kromkaAndZagl = await getKromkaAndZaglByDSP(data.dspId)
    const kromkaSpecId = await getKromkaTypeByChar(kromkaAndZagl.kromkaId)
    const kromkaPrimary = (await getKromkaPrimary(data, telDetails, kromkaAndZagl.kromkaId))
    const kromkaSecondary = await getKromkaSecondary(data, telDetails, kromkaSpecId, kromkaAndZagl.kromkaId)
    result.push([SpecItem.DSP16, await getDSP(data, telDetails)])
    result.push([SpecItem.DVP, await getTelDVP(shelf.length, data.depth)])
    result.push([kromkaSpecId, kromkaSecondary])
    result.push([SpecItem.Glue, await getGlue(data, kromkaPrimary.data.amount, kromkaSecondary.data.amount)])
    result.push([SpecItem.Confirmat, await getConfirmat(data, telDetails)])
    result.push([SpecItem.Nails, { data: { amount: 0.0125 } }])
    result.push([SpecItem.Samorez16, { data: { amount: 8 } }])
    result.push([SpecItem.Samorez30, { data: { amount: 2 } }])
    const tel = getTelescope(data.depth)
    if (tel.item) result.push([tel.item, tel.data])
    const karton = 2
    result.push([SpecItem.Karton, { data: { amount: karton } }])
    result.push([SpecItem.Skotch, { data: { amount: karton * 20 } }])
    result.push([SpecItem.ConfKluch, { data: { amount: 1 } }])
    return result
}

export async function getTelDVP(shelfLength: number, depth: number): Promise<FullData> {
    const detailNames = (await getDetailNames()).data
    const detail: Detail = { id: DETAIL_NAME.DRAWER_BOTTOM_DVP, count: 1, length: shelfLength - 29, width: depth - 154, kromka: allNoneKromka() }
    const verbose = [["Деталь", "Длина", "Ширина", "Кол-во", "Площадь", ""]]
    let totalArea = 0
    const area = detail.length * detail.width * detail.count / 1000000
    const caption = detailNames.find(n => n.id === detail.id)?.name || ""
    verbose.push([caption, `${detail.length}`, `${detail.width}`, `${detail.count}`, area.toFixed(3), ""])
    totalArea += area
    const coef = await getCoef(SpecItem.DVP)
    verbose.push(["", "", "", "", totalArea.toFixed(3), `x ${coef} = ${(totalArea * coef).toFixed(3)}`])
    return { data: { amount: totalArea * coef }, verbose }
}
function getTelescope(depth: number): { item: SpecItem | null; data: FullData}  {
    const telescopes = [
        { depth: 550, item: SpecItem.Telescope550 },
        { depth: 500, item: SpecItem.Telescope500 },
        { depth: 450, item: SpecItem.Telescope450 },
        { depth: 300, item: SpecItem.Telescope400 },
        { depth: 350, item: SpecItem.Telescope350 },
        { depth: 300, item: SpecItem.Telescope300 },
        { depth: 250, item: SpecItem.Telescope250 },
    ]
    const tel = telescopes.find(t => t.depth <= depth - 150)
    if (!tel) return { item: null, data: emptyFullData() }
    const count = 1
    const verbose = [["Глубина шкафа", "Направляющая", "Кол-во"]]
    verbose.push([`${depth}`, `${tel?.depth} <= ${depth}-150`, `${count}`])
    return { item: tel.item, data: { data: { amount: count }, verbose } }
}
