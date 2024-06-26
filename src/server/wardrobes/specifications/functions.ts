import { WardrobeDetailSchema, WardrobeFurnitureTableSchema } from "../../../types/schemas";
import { SpecificationItem } from "../../../types/specification";
import { Detail, FullData, IWardrobe, SpecificationResult, WARDROBE_KIND, WardrobeData } from "../../../types/wardrobe";
import { specServiceProvider, materialServiceProvider } from "../../options";
import { SpecificationService } from "../../services/specificationService";
import StandartWardrobe from "../standart";


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

