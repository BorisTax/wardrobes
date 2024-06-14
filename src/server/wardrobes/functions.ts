import { WardrobeDetailSchema } from "../../types/schemas";
import { SpecificationItem } from "../../types/specification";
import { DETAIL_NAME, DVPData, Detail, WARDROBE_KIND, WardrobeData, WardrobeDetailTable, WardrobeIntermediateData } from "../../types/wardrobe";
import { materialServiceProvider, specServiceProvider } from "../options";
import { SpecificationService } from "../services/specificationService";

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

export async function getWardrobeIntermediateData(data: WardrobeData): Promise<WardrobeIntermediateData> {
    const details = await getDetails(data.wardKind, data.width, data.height, data.depth)
    const dvpData = await getDVPData(data.width, data.height, data.depth)

    return { details, dvpData }
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

export function getDSP(details: Detail[]){
    return details.reduce((a, d) => a + d.width * d.length * d.count, 0) / 1000000
};
export function getDVP(dvpData: DVPData) {
    return (dvpData.dvpLength * dvpData.dvpWidth * dvpData.dvpCount) / 1000000
}
export function getDVPPlanka(dvpData: DVPData) {
    return (dvpData.dvpPlanka * dvpData.dvpPlankaCount) / 1000
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

export function getKarton(width: number, height: number){
    const wLess500_hLess2150 = [
        { width: 1600, value: 2.5 },
        { width: 2100, value: 2.6 },
        { width: 2500, value: 3 },
        { width: 3001, value: 3.5 },
    ]
    const wGreater500_hLess2150 = [
        { width: 1600, value: 3 },
        { width: 2500, value: 3.5 },
        { width: 2800, value: 4 },
        { width: 3001, value: 4.5 },
    ]
    const wLess500_hGreater2150 = [
        { width: 1900, value: 3 },
        { width: 2500, value: 3.5 },
        { width: 2800, value: 4 },
        { width: 3001, value: 4.5 },
    ]
    const wGreater500_hGreater2150 = [
        { width: 1600, value: 3 },
        { width: 2100, value: 3.5 },
        { width: 2500, value: 4 },
        { width: 2800, value: 4.5 },
        { width: 3001, value: 5 },
    ]
    if (width < 500 && height < 2150) return wLess500_hLess2150.find(i => i.width > width)?.value || 0;
    if (width >= 500 && height < 2150) return wGreater500_hLess2150.find(i => i.width > width)?.value || 0;
    if (width < 500 && height >= 2150) return wLess500_hGreater2150.find(i => i.width > width)?.value || 0;
    if (width >= 500 && height >= 2150) return wGreater500_hGreater2150.find(i => i.width > width)?.value || 0;
    return 0
}

export function getLegs(width: number) {
    const sizes = [
        { width: 1400, value: 6 },
        { width: 2200, value: 8 },
        { width: 2800, value: 10 },
        { width: 3001, value: 16 },
    ]
    return sizes.find((s => s.width > width))?.value || 0
};

export function getNails(width: number) {
    const sizes = [
        { width: 1400, value: 0.095 },
        { width: 1600, value: 0.1 },
        { width: 1900, value: 0.11 },
        { width: 2100, value: 0.14 },
        { width: 2500, value: 0.15 },
        { width: 3001, value: 0.2 },
    ]
    return sizes.find((s => s.width > width))?.value || 0
};

export function getSamorez16(width: number) {
    const sizes = [
        { width: 2200, value: 18 },
        { width: 2600, value: 28 },
        { width: 3001, value: 36 },
    ]
    return sizes.find((s => s.width > width))?.value || 0
};

export function getEdge2(details: Detail[]): number {
    return details.filter(d => d.name === DETAIL_NAME.ROOF || d.name === DETAIL_NAME.STAND).reduce((a, d) => a + d.length * d.count, 0) / 1000
};

export function getEdge05(details: Detail[]): number {
    return details.filter(d => d.name !== DETAIL_NAME.STAND).reduce((a, d) => a + ((d.name === DETAIL_NAME.ROOF) ? d.width * 2 : d.length) * d.count, 0) / 1000
};

export function getGlue(details: Detail[]) {
    return (getEdge2(details) + getEdge05(details)) * 0.008
};

export function getConfirmat(details: Detail[]){
    return details.reduce((a, d) => {
        let count = 0
        if (d.name===DETAIL_NAME.SHELF || d.name===DETAIL_NAME.SHELF_PLAT) count = d.count * 4;
        if (d.name===DETAIL_NAME.PILLAR) count = d.count * 2;
        return a + count
    }, 0) 
};

export function getMinifix(details: Detail[]){
    return details.reduce((a, d) => {
        let count = 0
        if (d.name===DETAIL_NAME.STAND || d.name===DETAIL_NAME.INNER_STAND) count = d.count * 4;
        if (d.name===DETAIL_NAME.PILLAR) count = d.count * 2;
        return a + count
    }, 0) 
};