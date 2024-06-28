import { FasadMaterial } from "../../../types/enums";
import { ExtMaterial } from "../../../types/materials";
import { WardrobeDetailSchema, WardrobeFurnitureTableSchema } from "../../../types/schemas";
import { SpecificationItem } from "../../../types/specification";
import { DETAIL_NAME, Detail, FullData, IWardrobe, SpecificationResult, WARDROBE_KIND, WARDROBE_TYPE, WardrobeData } from "../../../types/wardrobe";
import { specServiceProvider, materialServiceProvider } from "../../options";
import { MaterialService } from "../../services/materialService";
import { SpecificationService } from "../../services/specificationService";
import StandartWardrobe from "../standart";
import { getDetailNames } from "./corpus";


export function emptyFullData(): FullData {
    return { data: { amount: 0 } };
}
export function emptyFullDataWithVerbose(message: string): FullData {
    return { data: { amount: 0 }, verbose: [[], [message]] };
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
export function flattenSpecification(spec: Map<SpecificationItem, FullData[]>): SpecificationResult[] {
    const result: [SpecificationItem, FullData][] = [];
    spec.forEach((v, k) => {
        v.forEach(item => {
            result.push([k, item]);
        });
    });
    return result;
}
export function getSpecificationPattern(): Map<SpecificationItem, FullData[]> {
    const spec = new Map<SpecificationItem, FullData[]>();
    Object.keys(SpecificationItem).forEach(k => {
        spec.set(k as SpecificationItem, [{ data: { amount: 0, char: { code: "", caption: "" } } }]);
    });
    return spec;
}
export function filterEmptySpecification(spec: Map<SpecificationItem, FullData[]>): Map<SpecificationItem, FullData[]> {
    const newSpec = new Map<SpecificationItem, FullData[]>();
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
export function isDataFit(width: number, height: number, depth: number, item: WardrobeFurnitureTableSchema): boolean {
    return (width >= item.minwidth) && (width <= item.maxwidth) && (height >= item.minheight) && (height <= item.maxheight) && (depth >= item.mindepth) && (depth <= item.maxdepth)
}
export function getWardrobe(data: WardrobeData, details: Detail[]): IWardrobe {
    switch (data.wardKind) {
        case WARDROBE_KIND.STANDART:
            return new StandartWardrobe(data, details)
        default:
            return new StandartWardrobe(data, details)
    }
}
export async function getWardrobeKind(kind: WARDROBE_KIND): Promise<string> {
    const service = new SpecificationService(specServiceProvider, materialServiceProvider)
    const wardkinds = (await service.getWardobeKinds()).data as WardrobeDetailSchema[]
    const caption = wardkinds.find(w => w.name === kind)?.caption
    return caption || ""
}
export async function getDSP(data: WardrobeData, details: Detail[]): Promise<FullData> {
    if (data.wardType === WARDROBE_TYPE.SYSTEM) return emptyFullDataIfSystem()
    const matService = new MaterialService(materialServiceProvider)
    const materials = (await matService.getExtMaterials({ material: FasadMaterial.DSP, name: "", code: "" })).data as ExtMaterial[]
    const mat = materials.find(m => m.name === data.dspName) || { code: "", name: "" }
    const { code, name: caption } = mat
    const detailNames = await getDetailNames()
    const verbose = [["Деталь", "Длина", "Ширина", "Кол-во", "Площадь", ""]]
    let totalArea = 0
    details.forEach(d => {
        const area = d.length * d.width * d.count / 1000000
        const caption = detailNames.find(n => n.name === d.name)?.caption || ""
        verbose.push([caption, `${d.length}`, `${d.width}`, `${d.count}`, area.toFixed(3), ""])
        totalArea += area
    })
    const coef = await getCoef(SpecificationItem.DSP)
    verbose.push(["", "", "", "", totalArea.toFixed(3), `x ${coef} = ${(totalArea * coef).toFixed(3)}`])
    return { data: { amount: totalArea * coef, char: { code, caption } }, verbose }
}
export async function getCoef(item: SpecificationItem): Promise<number> {
    const specService = new SpecificationService(specServiceProvider, materialServiceProvider)
    const list = await specService.getSpecList()
    const coef = list.data?.find(s => s.name === item)?.coef || 1
    return coef
}
export function getConfirmatByDetail(detail: DETAIL_NAME): number {
    switch (detail) {
        case DETAIL_NAME.SHELF || DETAIL_NAME.SHELF_PLAT:
            return 4
        case DETAIL_NAME.PILLAR || DETAIL_NAME.DRAWER_SIDE:
            return 2
        default:
            return 0
    }
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
        detail === DETAIL_NAME.PILLAR ||
        detail === DETAIL_NAME.DRAWER_FASAD ||
        detail === DETAIL_NAME.DRAWER_SIDE ||
        detail === DETAIL_NAME.DRAWER_BRIDGE
}

export function getEdge2Length(detail: Detail): number {
    if ([DETAIL_NAME.ROOF,
    DETAIL_NAME.STAND,
    DETAIL_NAME.CONSOLE_STAND,
    DETAIL_NAME.CONSOLE_BACK_STAND,
    ].includes(detail.name)) return detail.length
    if ([
        DETAIL_NAME.CONSOLE_ROOF,
        DETAIL_NAME.CONSOLE_SHELF,
    ].includes(detail.name)) return detail.width + detail.length
    return 0
}

export function getEdge05Length(detail: Detail): number {
    if ([DETAIL_NAME.INNER_STAND,
    DETAIL_NAME.SHELF,
    DETAIL_NAME.SHELF_PLAT,
    DETAIL_NAME.PILLAR,
    DETAIL_NAME.DRAWER_SIDE,
    DETAIL_NAME.DRAWER_BRIDGE,
    ].includes(detail.name)) return detail.length
    if ([DETAIL_NAME.DRAWER_FASAD].includes(detail.name)) return (detail.width + detail.length) * 2
    if ([DETAIL_NAME.ROOF].includes(detail.name)) return detail.width * 2
    return 0
}
export function calcFunction(func: string, { width, height, shelfSize, standCount }: { width: number; height: number; shelfSize: number; standCount: number} ): number {
    try {
        const f = new Function('W', 'H', 'ShL', 'StN', 'return ' + func)
        const result = f(width, height, shelfSize, standCount)
        return result
    } catch (e) {
        return 0
    }
}



