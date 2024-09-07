import { SpecificationItem } from "../../../../types/specification";
import { WardrobeData, SpecificationResult, DETAIL_NAME, Detail, FullData, EDGE_TYPE, DRILL_TYPE } from "../../../../types/wardrobe";
import { getDetails, getEdge2, getEdge05, getGlue, getConfirmat, getDetailNames } from "../corpus";
import { getDSP, getCoef, emptyFullData, allThinEdge, singleLengthThinEdge } from "../functions";


export async function getDrawerSpecification(data: WardrobeData): Promise<SpecificationResult[]> {
    const result: SpecificationResult[] = []
    const details = (await getDetails(data.wardKind, data.width, data.height, data.depth))
    const shelf = details.find(d => d.name === DETAIL_NAME.SHELF)
    if (!shelf) return result
    const telDetails: Detail[] = [
        { name: DETAIL_NAME.DRAWER_FASAD, count: 1, length: shelf.length - 8, width: 140, edge: allThinEdge(), drill: [DRILL_TYPE.NONE] },
        { name: DETAIL_NAME.DRAWER_SIDE, count: 2, length: data.depth - 150, width: 120, edge: singleLengthThinEdge(), drill: [DRILL_TYPE.NONE] },
        { name: DETAIL_NAME.DRAWER_BRIDGE, count: 2, length: shelf.length - 57, width: 120, edge:  singleLengthThinEdge(), drill: [DRILL_TYPE.CONFIRMAT1] }
    ]
    const edge2 = await getEdge2(data, telDetails)
    const edge05 = await getEdge05(data, telDetails)
    result.push([SpecificationItem.DSP, await getDSP(data, telDetails)])
    result.push([SpecificationItem.DVP, await getTelDVP(shelf.length, data.depth)])
    result.push([SpecificationItem.Kromka05, edge05])
    result.push([SpecificationItem.Glue, await getGlue(data, edge2.data.amount, edge05.data.amount)])
    result.push([SpecificationItem.Confirmat, await getConfirmat(data, telDetails)])
    result.push([SpecificationItem.Nails, { data: { amount: 0.0125 } }])
    result.push([SpecificationItem.Samorez16, { data: { amount: 8 } }])
    result.push([SpecificationItem.Samorez30, { data: { amount: 2 } }])
    const tel = getTelescope(data.depth)
    if (tel.item) result.push([tel.item, tel.data])
    const karton = 2
    result.push([SpecificationItem.Karton, { data: { amount: karton } }])
    result.push([SpecificationItem.Skotch, { data: { amount: karton * 20 } }])
    result.push([SpecificationItem.ConfKluch, { data: { amount: 1 } }])
    return result
}

export async function getTelDVP(shelfLength: number, depth: number): Promise<FullData> {
    const detailNames = await getDetailNames()
    const detail: Detail = { name: DETAIL_NAME.DRAWER_BOTTOM_DVP, count: 1, length: shelfLength - 29, width: depth - 154 }
    const verbose = [["Деталь", "Длина", "Ширина", "Кол-во", "Площадь", ""]]
    let totalArea = 0
    const area = detail.length * detail.width * detail.count / 1000000
    const caption = detailNames.find(n => n.name === detail.name)?.caption || ""
    verbose.push([caption, `${detail.length}`, `${detail.width}`, `${detail.count}`, area.toFixed(3), ""])
    totalArea += area
    const coef = await getCoef(SpecificationItem.DVP)
    verbose.push(["", "", "", "", totalArea.toFixed(3), `x ${coef} = ${(totalArea * coef).toFixed(3)}`])
    return { data: { amount: totalArea * coef }, verbose }
}
function getTelescope(depth: number): { item: SpecificationItem | null; data: FullData}  {
    const telescopes = [
        { depth: 550, item: SpecificationItem.Telescope550 },
        { depth: 500, item: SpecificationItem.Telescope500 },
        { depth: 450, item: SpecificationItem.Telescope450 },
        { depth: 300, item: SpecificationItem.Telescope400 },
        { depth: 350, item: SpecificationItem.Telescope350 },
        { depth: 300, item: SpecificationItem.Telescope300 },
        { depth: 250, item: SpecificationItem.Telescope250 },
    ]
    const tel = telescopes.find(t => t.depth <= depth - 150)
    if (!tel) return { item: null, data: emptyFullData() }
    const count = 1
    const verbose = [["Глубина шкафа", "Направляющая", "Кол-во"]]
    verbose.push([`${depth}`, `${tel?.depth} <= ${depth}-150`, `${count}`])
    return { item: tel.item, data: { data: { amount: count }, verbose } }
}
