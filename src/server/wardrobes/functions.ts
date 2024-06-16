import { rmSync } from "fs";
import { WardrobeDetailSchema, WardrobeFurnitureTableSchema } from "../../types/schemas";
import { SpecificationItem } from "../../types/specification";
import { DETAIL_NAME, DVPData, Detail, WARDROBE_KIND, WardrobeData, WardrobeDetailTable, WardrobeIntermediateData } from "../../types/wardrobe";
import { materialServiceProvider, specServiceProvider } from "../options";
import { SpecificationService } from "../services/specificationService";
import { FullData, VerboseData } from "../../types/server";

function getFineRange(min: number, max: number): string {
    const maxValue = 3000
    let result = ""
    if (min <= 0 && max >= maxValue) result = "---"
    if (min <= 0 && max < maxValue) result = "<= " + max
    if (min > 0 && max >= maxValue) result = ">= " + min
    if (min > 0 && max < maxValue) result = min + " - " + max
    return result
}

export function isDataFit(width: number, height: number, depth: number, item: WardrobeFurnitureTableSchema): boolean{
    return (width >= item.minwidth) && (width <= item.maxwidth) && (height >= item.minheight) && (height <= item.maxheight)&& (depth >= item.mindepth) && (depth <= item.maxdepth)
}

export function hasEdge2(detail: DETAIL_NAME): boolean {
    return detail === DETAIL_NAME.ROOF ||
        detail === DETAIL_NAME.STAND ||
        detail === DETAIL_NAME.CONSOLE_STAND ||
        detail === DETAIL_NAME.CONSOLE_BACK_STAND ||
        detail === DETAIL_NAME.CONSOLE_ROOF
}
export function hasEdge05(detail: DETAIL_NAME): boolean {
    return detail === DETAIL_NAME.ROOF ||
        detail === DETAIL_NAME.INNER_STAND ||
        detail === DETAIL_NAME.SHELF ||
        detail === DETAIL_NAME.SHELF_PLAT ||
        detail === DETAIL_NAME.PILLAR
}
export function useConfirmat(detail: DETAIL_NAME): boolean {
    return detail === DETAIL_NAME.SHELF ||
        detail === DETAIL_NAME.SHELF_PLAT ||
        detail === DETAIL_NAME.PILLAR
}
export function useMinifix(detail: DETAIL_NAME): boolean {
    return detail === DETAIL_NAME.STAND ||
        detail === DETAIL_NAME.INNER_STAND ||
        detail === DETAIL_NAME.CONSOLE_STAND ||
        detail === DETAIL_NAME.CONSOLE_BACK_STAND
}

export async function getCoef(item: SpecificationItem): Promise<number> {
    const specService = new SpecificationService(specServiceProvider, materialServiceProvider)
    const list = await specService.getSpecList()
    const coef = list.data?.find(s => s.name === item)?.coef || 1
    return coef
}

export async function getDetailNames(): Promise<WardrobeDetailSchema[]>{
    const service = new SpecificationService(specServiceProvider)
    const result = await service.getDetailNames()
    return result.data as WardrobeDetailSchema[]
}

export async function getDetails(kind: WARDROBE_KIND, width: number, height: number, depth: number): Promise<Detail[]>{
    const service = new SpecificationService(specServiceProvider)
    const result = await service.getDetailTable({ kind })
    if(!result.success) return []
    const table = result.data as WardrobeDetailTable[]
    const details: Detail[] = []
    var { count, size } = getDetail(table, DETAIL_NAME.ROOF, width, height, 0, 0)
    const offset = 100
    if (count > 0) details.push({ name: DETAIL_NAME.ROOF, length: size, width: depth, count })
    var { count, size } = getDetail(table, DETAIL_NAME.STAND, width, height, 0, 0)
    if (count > 0) details.push({name: DETAIL_NAME.STAND, length: size, width: depth, count})
    var { count, size } = getDetail(table, DETAIL_NAME.INNER_STAND, width, height, 0, 0)
    const innerStandLCount = count
    if (count > 0) details.push({ name: DETAIL_NAME.INNER_STAND, length: size, width: depth - offset, count })
    var { count, size } = getDetail(table, DETAIL_NAME.SHELF, width, height, 0, innerStandLCount)
    const shelfSize = size
    if (count > 0) details.push({ name: DETAIL_NAME.SHELF, length: size, width: depth - offset, count })
    var { count, size } = getDetail(table, DETAIL_NAME.SHELF_PLAT, width, height, shelfSize, innerStandLCount)
    if (count > 0) details.push({ name: DETAIL_NAME.SHELF_PLAT, length: size, width: depth - offset, count })
    var { count, size } = getDetail(table, DETAIL_NAME.PILLAR, width, height, shelfSize, innerStandLCount)
    if (count > 0) details.push({ name: DETAIL_NAME.PILLAR, length: size, width: depth - offset, count })
    return details
}

function getDetail(table: WardrobeDetailTable[], name: DETAIL_NAME, width: number, height: number, shelfSize: number, standCount: number): { count: number, size: number } {
    const detail = table.find(t => (name === t.name) && (width >= t.minwidth) && (width <= t.maxwidth) && (height >= t.minheight) && (height <= t.maxheight))
    if(!detail) return {count: 0, size: 0}
    const size = calcFunction(detail.size, { width, height, shelfSize, standCount })
    return { count: size ? detail.count : 0, size }
}

function calcFunction(func: string, { width, height, shelfSize, standCount }: { width: number, height: number, shelfSize: number, standCount: number }): number {
    try {
        const f = new Function('W', 'H', 'ShL', 'StN', 'return ' + func)
        const result = f(width, height, shelfSize, standCount)
        return result
    } catch (e) {
        return 0
    }
}

export async function getDSP(data: WardrobeData): Promise<FullData> {
    const details = await getDetails(data.wardKind, data.width, data.height, data.depth)
    const detailNames = await getDetailNames()
    const verbose = [{data: ["Деталь", "Длина", "Ширина", "Кол-во", "Площадь", ""], active: false}]
    let totalArea = 0
    details.forEach(d => {
        const area = d.length * d.width * d.count / 1000000
        const caption = detailNames.find(n => n.name === d.name)?.caption || ""
        verbose.push({data: [caption, `${d.length}`, `${d.width}`, `${d.count}`, area.toFixed(3), ""], active: false})
        totalArea += area
    })
    const coef = await getCoef(SpecificationItem.DSP)
    verbose.push({ data: ["", "", "", "", totalArea.toFixed(3), `x ${coef} = ${(totalArea * coef).toFixed(3)}`], active: false })
    return { amount: totalArea * coef, verbose }
}

export async function getDVP(data: WardrobeData): Promise<FullData>{
    const dvp = await getDVPData(data.width, data.height, data.depth)
    const coef = await getCoef(SpecificationItem.DVP) 
    const area = dvp.dvpLength * dvp.dvpWidth * dvp.dvpCount / 1000000
    const areaCoef = area * coef
    const verbose = [{data: ["", "", ""], active: false}]
    verbose.push({data: ["Расчетные размеры", `${dvp.dvpRealLength}x${dvp.dvpRealWidth} - ${dvp.dvpCount}шт`, ``], active: false})
    verbose.push({data: ["Распиловочные размеры", `${dvp.dvpLength}x${dvp.dvpWidth} - ${dvp.dvpCount}шт`, `${area.toFixed(3)} x ${coef}= ${areaCoef.toFixed(3)}`], active: false})
    return { amount: areaCoef, verbose }
}

export async function getDVPPlanka(data: WardrobeData): Promise<FullData> {
    const { width, height, depth } = data
    const dvpData = await getDVPData(width, height, depth)
    const coef = await getCoef(SpecificationItem.Planka) 
    const verbose: VerboseData = [{ data: ["Длина", "Кол-во", "Итого"] }]
    const total = dvpData.dvpPlanka * dvpData.dvpPlankaCount / 1000
    const totalCoef = total * coef
    verbose.push({ data: [(dvpData.dvpPlanka / 1000).toFixed(3), dvpData.dvpPlankaCount, total.toFixed(3)] })
    if (coef !== 1) verbose.push({ data: ["", "", `${total.toFixed(3)} x ${coef} = ${totalCoef.toFixed(3)}`] })
    return { amount: totalCoef, verbose }
}

export async function getDVPData(width: number, height: number, depth: number): Promise<DVPData> {
    const lines = [3, 4, 5, 6, 7, 8]
    const dvpLayers = lines.map(l => ({ width: Math.round((height - 30 - 2 * (l - 1)) / l), count: l }))
    const service = new SpecificationService(specServiceProvider)
    const result = await service.getDVPTemplates()
    if (!result.success) return { dvpWidth: 0, dvpLength: 0, dvpRealWidth: 0, dvpRealLength: 0, dvpCount: 0, dvpPlanka: 0, dvpPlankaCount: 0 }
    if (!result.data) return { dvpWidth: 0, dvpLength: 0, dvpRealWidth: 0, dvpRealLength: 0, dvpCount: 0, dvpPlanka: 0, dvpPlankaCount: 0 }
    const dvpTemplates592 = result.data.filter(d => d.width === 592).map(i => i.length)
    const dvpTemplates393 = result.data.filter(d => d.width === 393).map(i => i.length)
    const found = dvpLayers.find(d => d.width <= depth) || {count: 1, width: height }
    const section = width > 2750 ? 2 : 1
    const roof = width / section
    const dvpRealWidth = found.width
    const dvpRealLength = roof - 3 
    const length592 = dvpTemplates592.find(t => t >= dvpRealLength)
    const length393 = dvpTemplates393.find(t => t >= dvpRealLength)
    let dvpWidth
    let dvpLength
    if (found.width <= 393 && length393) {
        dvpWidth = 393
        dvpLength = length393
    } else {
        dvpWidth = 592
        dvpLength = length592 || 0 
    }   
    const dvpCount = found.count
    const dvpPlanka = roof - 32
    const dvpPlankaCount = section === 1 ? (dvpCount - 1) : (dvpCount / 2 - 1) * 2 
    
    return {dvpWidth, dvpLength, dvpRealWidth, dvpRealLength, dvpCount, dvpPlanka, dvpPlankaCount}
}

export async function getKarton(data: WardrobeData): Promise<FullData> {
    const {width, height, depth} = data
    const service = new SpecificationService(specServiceProvider, materialServiceProvider)
    const list = (await service.getFurnitureTable({ kind: WARDROBE_KIND.STANDART, item: SpecificationItem.Karton })).data || []
    const caption = await getWardrobeKind(data.wardKind)
    const coef = await getCoef(SpecificationItem.Karton) || 1
    const current = list.find(item => isDataFit(width, height, depth, item))?.count || 0
    const verbose = [{ data: ["Ширина", "Высота", "Глубина", "Кол-во"], active: false }]

    list.forEach(item => {
        const active = isDataFit(width, height, depth, item)
        if (active) verbose.push({ data: [getFineRange(item.minwidth, item.maxwidth), getFineRange(item.minheight, item.maxheight), getFineRange(item.mindepth, item.maxdepth), `${item.count}`], active: false })
    })
    return { amount: current * coef, verbose }
}

export async function getLegs(data: WardrobeData): Promise<FullData> {
    const {wardKind, width, height, depth} = data
    const service = new SpecificationService(specServiceProvider, materialServiceProvider)
    const list = (await service.getFurnitureTable({ kind: data.wardKind, item: SpecificationItem.Leg })).data || []
    const caption = await getWardrobeKind(data.wardKind)
    const current = list.find(item => isDataFit(width, height, depth, item))?.count || 0
    const verbose = [{ data: ["Ширина", "Кол-во"], active: false }]
    list.forEach(item => {
        verbose.push({ data: [getFineRange(item.minwidth, item.maxwidth), `${item.count}`], active: current === item.count })
    })
    return {amount: current, verbose}
}

export async function getConfirmat(data: WardrobeData): Promise<FullData> {
    const details = (await getDetails(data.wardKind, data.width, data.height, data.depth)).filter(d => useConfirmat(d.name))
    const detailNames = await getDetailNames()
    const verbose: VerboseData = [{ data: ["Деталь", "Кол-во", "Конфирматы"], active: false }]
    let total = 0
    details.forEach(d => {
        const conf = d.count * (d.name === DETAIL_NAME.PILLAR ? 2 : 4)
        const caption = detailNames.find(n => n.name === d.name)?.caption || ""
        verbose.push({data: [caption, `${d.count}`, `${conf}`], active: false})
        total += conf
    })
    verbose.push({data: ["", "Итого:", total], active: false})
    return {amount: total, verbose}
}


export async function getMinifix(data: WardrobeData): Promise<FullData> {
    const details = (await getDetails(data.wardKind, data.width, data.height, data.depth)).filter(d => useMinifix(d.name))
    const detailNames = await getDetailNames()
    const verbose: VerboseData = [{ data: ["Деталь", "Кол-во", "Минификсы"], active: false }]
    let total = 0
    details.forEach(d => {
        const count = d.count * ((d.name === DETAIL_NAME.CONSOLE_BACK_STAND || d.name === DETAIL_NAME.PILLAR) ? 2 : 4)
        const caption = detailNames.find(n => n.name === d.name)?.caption || ""
        verbose.push({data: [caption, `${d.count}`, `${count}`], active: false})
        total += count
    })
    verbose.push({data: ["", "Итого:", total], active: false})
    return {amount: total, verbose}
}

export async function getNails(data: WardrobeData): Promise<FullData> {
    const {wardKind, width, height, depth} = data
    const service = new SpecificationService(specServiceProvider, materialServiceProvider)
    const list = (await service.getFurnitureTable({ kind: data.wardKind, item: SpecificationItem.Nails })).data || []
    const caption = await getWardrobeKind(data.wardKind)
    const current = list.find(item => isDataFit(width, height, depth, item))?.count || 0
    const verbose: VerboseData = [{ data: ["Ширина", "Кол-во"] }]
    list.forEach(item => {
        const active = isDataFit(width, height, depth, item)
        if (active) verbose.push({ data: [getFineRange(item.minwidth, item.maxwidth), `${item.count}`] })
    })
    return {amount: current, verbose}
}

export function getSamorez16(width: number) {
    const sizes = [
        { width: 2200, value: 18 },
        { width: 2600, value: 28 },
        { width: 3001, value: 36 },
    ]
    return sizes.find((s => s.width > width))?.value || 0
};

export async function getEdge2(data: WardrobeData): Promise<FullData> {
    const details = (await getDetails(data.wardKind, data.width, data.height, data.depth)).filter(d => hasEdge2(d.name))
    const detailNames = await getDetailNames()
    const verbose = [{data: ["Деталь", "Длина", "Ширина", "Кол-во", "Длина кромки", ""], active: false}]
    let totalEdge = 0
    details.forEach(d => {
        const edge = d.length * d.count / 1000
        const caption = detailNames.find(n => n.name === d.name)?.caption || ""
        verbose.push({data: [caption, `${d.length}`, `${d.width}`, `${d.count}`, edge.toFixed(3), ""], active: false})
        totalEdge += edge
    })
    const coef = await getCoef(SpecificationItem.Kromka2)
    verbose.push({data: ["", "", "", "", totalEdge.toFixed(3), `x ${coef} = ${(totalEdge * coef).toFixed(3)}`], active: false})
    return { amount: totalEdge * coef, verbose }
}

export async function getEdge05(data: WardrobeData): Promise<FullData> {
    const details = (await getDetails(data.wardKind, data.width, data.height, data.depth)).filter(d => hasEdge05(d.name))
    const detailNames = await getDetailNames()
    const verbose = [{data: ["Деталь", "Длина", "Ширина", "Кол-во", "Длина кромки", ""], active: false}]
    let totalEdge = 0
    details.forEach(d => {
        const edge = (d.name === DETAIL_NAME.ROOF ? d.width * 2 : d.length) * d.count / 1000
        const caption = detailNames.find(n => n.name === d.name)?.caption || ""
        verbose.push({data: [caption, `${d.length}`, `${d.width}`, `${d.count}`, edge.toFixed(3), ""], active: false})
        totalEdge += edge
    })
    const coef = await getCoef(SpecificationItem.Kromka2)
    verbose.push({data: ["", "", "", "", totalEdge.toFixed(3), `x ${coef} = ${(totalEdge * coef).toFixed(3)}`], active: false})
    return {amount: totalEdge * coef, verbose}
}

export async function getGlue(data: WardrobeData): Promise<FullData> {
    const coefGlue = await getCoef(SpecificationItem.Glue)
    const edge2 = (await getEdge2(data)).amount
    const edge05 = (await getEdge05(data)).amount
    const glue = (edge2 + edge05) * coefGlue * 0.008
    const verbose = [{data: ["Кромка 2мм", "Кромка 0.45мм", "Итого", "Клей"], active: false}]
    verbose.push({data: [edge2.toFixed(3), edge05.toFixed(3), (edge2 + edge05).toFixed(3), `x 0.008 = ${glue.toFixed(3)}`], active: false})
    return {amount: glue, verbose}
}


export async function getWardrobeKind(kind: WARDROBE_KIND): Promise<string> {
    const service = new SpecificationService(specServiceProvider, materialServiceProvider)
    const wardkinds = (await service.getWardobeKinds()).data as WardrobeDetailSchema[]
    const caption = wardkinds.find(w => w.name === kind)?.caption
    return caption || ""
}
