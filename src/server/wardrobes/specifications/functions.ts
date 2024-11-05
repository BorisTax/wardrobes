import { DefaultSchema, FurnitureTableSchema } from "../../../types/schemas";
import { SpecItem } from "../../../types/specification";
import { DETAIL_NAME, DRILL_TYPE, Detail, KROMKA_SIDE, KROMKA_TYPE, FullData, SpecificationResult, WARDROBE_TYPE, WardrobeData } from "../../../types/wardrobe";
import { WardrobeDetailTableSchema } from "../../../types/schemas";
import { getSpecList } from "../../routers/functions/spec";
import { getWardobes } from "../../routers/functions/wardrobe";
import { allNoneKromka, singleLengthThickDoubleWidthThinKromka, singleLengthThickKromka, singleLengthThinKromka } from "./kromka";
import { getDetailNames } from "../../routers/functions/details";
import { off } from "process";


export function emptyFullData(): FullData {
    return { data: { amount: 0, charId: 0 } };
}
export function emptyFullDataWithVerbose(message: string): FullData {
    return { data: { amount: 0, charId: 0 }, verbose: [[], [message]] };
}
export function emptyFullDataIfNoFasades(): FullData {
    return emptyFullDataWithVerbose("Кол-во фасадов некорректное");
}
export function emptyFullDataIfSystem(): FullData {
    return emptyFullDataWithVerbose("Не учитывается, если тип Система");
}
export function emptyFullDataIfCorpus(): FullData {
    return emptyFullDataWithVerbose("Не учитывается, если тип Корпус");
}
export function flattenSpecification(spec: Map<SpecItem, FullData[]>): SpecificationResult[] {
    const result: [SpecItem, FullData][] = [];
    spec.forEach((v, k) => {
        v.forEach(item => {
            result.push([k, item]);
        });
    });
    return result;
}

export function filterEmptySpecification(spec: Map<SpecItem, FullData[]>): Map<SpecItem, FullData[]> {
    const newSpec = new Map<SpecItem, FullData[]>();
    spec.forEach((v, k) => { if (v.every(d => d.data.amount !== 0)) newSpec.set(k, v); });
    return newSpec;
}
export function getFasadCount(data: WardrobeData): number {
    return Object.values(data.fasades).reduce((a, f) => f.count + a, 0);
}
export function correctFasadCount(count: number): boolean {
    return count > 1 && count < 7;
}
export function getFineRange(min: number, max: number): string {
    const maxValue = 3000
    let result = ""
    if (min <= 0 && max >= maxValue) result = "---"
    if (min <= 0 && max < maxValue) result = "меньше-равно " + max
    if (min > 0 && max >= maxValue) result = "больше-равно " + min
    if (min > 0 && max < maxValue) result = min + " - " + max
    return result
}
export function isDataFit(width: number, height: number, depth: number, item: FurnitureTableSchema): boolean {
    return (width >= item.minWidth) && (width <= item.maxWidth) && (height >= item.minHeight) && (height <= item.maxHeight) && (depth >= item.minDepth) && (depth <= item.maxDepth)
}

export async function getWardrobeName(id: number): Promise<string> {
    const wardkinds = (await getWardobes()).data as DefaultSchema[]
    return wardkinds.find(w => w.id === id)?.name || ""
}

export async function getDSP(data: WardrobeData, details: Detail[]): Promise<FullData> {
    if (data.wardrobeTypeId === WARDROBE_TYPE.SYSTEM) return emptyFullDataIfSystem()
    const detailNames = (await getDetailNames()).data
    const verbose = [["Деталь", "Длина", "Ширина", "Кол-во", "Площадь", ""]]
    let totalArea = 0
    details.forEach(d => {
        const area = d.length * d.width * d.count / 1000000
        const caption = detailNames.find(n => n.id === d.id)?.name || ""
        verbose.push([caption, `${d.length}`, `${d.width}`, `${d.count}`, area.toFixed(3), ""])
        totalArea += area
    })
    const coef = await getCoef(SpecItem.DSP16)
    verbose.push(["", "", "", "", totalArea.toFixed(3), `x ${coef} = ${(totalArea * coef).toFixed(3)}`])
    return { data: { amount: totalArea * coef, charId: data.dspId }, verbose }
}

export async function getCoef(item: SpecItem): Promise<number> {
    const list = await getSpecList()
    const coef = list.data?.find(s => s.id === item)?.coef || 1
    return coef
}
export function getConfirmatByDetail(detail: Detail): number {
    return detail.drill?.reduce((prev, curr) => prev + ((curr === DRILL_TYPE.CONFIRMAT1 ? 1 : 0) + (curr === DRILL_TYPE.CONFIRMAT2 ? 2 : 0)), 0) || 0
}
export function getMinifixByDetail(detail: Detail): number {
    return detail.drill?.reduce((prev, curr) => prev + ((curr === DRILL_TYPE.MINIFIX1 ? 1 : 0) + (curr === DRILL_TYPE.MINIFIX2 ? 2 : 0)), 0) || 0
}


export function getKromkaLength(detail: Detail, kromka: KROMKA_TYPE[]): number {
    let result = 0
    if (kromka.includes(detail.kromka?.L1)) result += detail.length
    if (kromka.includes(detail.kromka?.L2)) result += detail.length
    if (kromka.includes(detail.kromka?.W1)) result += detail.width
    if (kromka.includes(detail.kromka?.W2)) result += detail.width
    return result
}
export function getKromkaDescripton(detail: Detail, kromka: KROMKA_TYPE[]): string {
    let length = 0
    let width = 0
    const result = []
    if (kromka.includes(detail.kromka?.L1)) length = 1
    if (kromka.includes(detail.kromka?.L2)) length += 1
    if (kromka.includes(detail.kromka?.W1)) width = 1
    if (kromka.includes(detail.kromka?.W2)) width += 1
    if (length > 0) result.push(`${length} по длине`)
    if (width > 0) result.push(`${width} по ширине`)
    return result.join(', ')
}


export function calcFunction(func: string, { width, height, depth, offset }: { width: number; height: number, depth: number, offset: number} ): number {
    try {
        const f = new Function('W', 'H', 'D', 'OFFSET', 'return ' + func)
        const result = f(width, height, depth, offset)
        return result
    } catch (e) {
        return 0
    }
}

export function getDrill(detail: WardrobeDetailTableSchema): DRILL_TYPE[] {
    if ([DETAIL_NAME.STAND, DETAIL_NAME.INNER_STAND].includes(detail.detailId)) return [DRILL_TYPE.MINIFIX2, DRILL_TYPE.MINIFIX2]
    if ([DETAIL_NAME.SHELF, DETAIL_NAME.SHELF_PLAT].includes(detail.detailId)) return [DRILL_TYPE.CONFIRMAT2, DRILL_TYPE.CONFIRMAT2]
    if ([DETAIL_NAME.PILLAR].includes(detail.detailId)) return [DRILL_TYPE.MINIFIX2, DRILL_TYPE.CONFIRMAT2]
    return []
} 

export function getKromka(wardTypeId: WARDROBE_TYPE, detail: WardrobeDetailTableSchema): KROMKA_SIDE {
    if ([DETAIL_NAME.ROOF].includes(detail.detailId)) return singleLengthThickDoubleWidthThinKromka()
    if ([DETAIL_NAME.STAND].includes(detail.detailId)) return singleLengthThickKromka()
    if ([DETAIL_NAME.INNER_STAND, DETAIL_NAME.SHELF, DETAIL_NAME.SHELF_PLAT, DETAIL_NAME.PILLAR].includes(detail.detailId)) return wardTypeId === WARDROBE_TYPE.GARDEROB ? singleLengthThickKromka() : singleLengthThinKromka()
    return allNoneKromka()
}

export function getArmirovkaTapes(width: number, tolerance: number): { tape400: number; tape200: number; } {
    let tape400 = 0;
    let tape200 = 0;
    let min = width * 2;
    let sum = 100;
    for (let t400 = 0; t400 * 400 <= width + 400; t400++) {
        for (let t200 = 0; t200 * 200 <= width + 200; t200++) {
            let m = t400 * 400 + t200 * 200 - width + tolerance;
            if (m >= 0 && m <= min) {
                if (Math.abs(m - min) < 0.001) {
                    if (t400 + t200 > sum) continue;
                }
                min = m;
                tape400 = t400;
                tape200 = t200;
                sum = tape400 + tape200;
            }
        }
    }
    return { tape400, tape200 };
}

