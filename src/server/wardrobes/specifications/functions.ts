import { FASAD_TYPE } from "../../../types/enums";
import { DSP_EDGE_ZAGL, Edge, FasadMaterial, Zaglushka } from "../../../types/materials";
import { WardrobeDetailSchema, WardrobeDetailTableSchema, WardrobeFurnitureTableSchema } from "../../../types/schemas";
import { SpecificationItem } from "../../../types/specification";
import { DETAIL_NAME, DRILL_TYPE, Detail, EDGE_SIDE, EDGE_TYPE, FullData, IWardrobe, SpecificationResult, WARDROBE_KIND, WARDROBE_TYPE, WardrobeData, WardrobeDetailTable } from "../../../types/wardrobe";
import { specServiceProvider, materialServiceProvider, materialsPath } from "../../options";
import DSPEdgeZaglServiceSQLite from "../../services/extServices/DSPEdgeZaglServiceSQLite";
import EdgeServiceSQLite from "../../services/extServices/edgeServiceSQLite";
import ZagluskaServiceSQLite from "../../services/extServices/zaglushkaServiceSQLite";
import { MaterialExtService } from "../../services/materialExtService";
import { MaterialService } from "../../services/materialService";
import { SpecificationService } from "../../services/specificationService";
import StandartWardrobe from "../standart";
import { getDetailNames } from "./corpus";
import { singleLengthThickDoubleWidthThinEdge, singleLengthThickEdge, singleLengthThinEdge } from "./edges";


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
    const materials = (await matService.getExtMaterials({ type: FASAD_TYPE.DSP, name: "", code: "" })).data as FasadMaterial[]
    const mat = materials.find(m => m.id === data.dspId) || { code: "", name: "" }
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
export function getConfirmatByDetail(detail: Detail): number {
    return detail.drill?.reduce((prev, curr) => prev + ((curr === DRILL_TYPE.CONFIRMAT1 ? 1 : 0) + (curr === DRILL_TYPE.CONFIRMAT2 ? 2 : 0)), 0) || 0
}
export function getMinifixByDetail(detail: Detail): number {
    return detail.drill?.reduce((prev, curr) => prev + ((curr === DRILL_TYPE.MINIFIX1 ? 1 : 0) + (curr === DRILL_TYPE.MINIFIX2 ? 2 : 0)), 0) || 0
}


export function getEdgeLength(detail: Detail, edge: EDGE_TYPE): number {
    let result = 0
    if (detail.edge?.L1 === edge) result += detail.length
    if (detail.edge?.L2 === edge) result += detail.length
    if (detail.edge?.W1 === edge) result += detail.width
    if (detail.edge?.W2 === edge) result += detail.width
    return result
}
export function getEdgeDescripton(detail: Detail, edge: EDGE_TYPE): string {
    let length = 0
    let width = 0
    const result = []
    if (detail.edge?.L1 === edge) length = 1
    if (detail.edge?.L2 === edge) length += 1
    if (detail.edge?.W1 === edge) width = 1
    if (detail.edge?.W2 === edge) width += 1
    if (length > 0) result.push(`${length} по длине`)
    if (width > 0) result.push(`${width} по ширине`)
    return result.join(', ')
}


export function calcFunction(func: string, { width, height }: { width: number; height: number} ): number {
    try {
        const f = new Function('W', 'H', 'return ' + func)
        const result = f(width, height)
        return result
    } catch (e) {
        return 0
    }
}

export function getDrill(detail: WardrobeDetailTable): DRILL_TYPE[] {
    if ([DETAIL_NAME.STAND, DETAIL_NAME.INNER_STAND].includes(detail.name as DETAIL_NAME)) return [DRILL_TYPE.MINIFIX2, DRILL_TYPE.MINIFIX2]
    if ([DETAIL_NAME.SHELF, DETAIL_NAME.SHELF_PLAT].includes(detail.name as DETAIL_NAME)) return [DRILL_TYPE.CONFIRMAT2, DRILL_TYPE.CONFIRMAT2]
    if ([DETAIL_NAME.PILLAR].includes(detail.name as DETAIL_NAME)) return [DRILL_TYPE.MINIFIX2, DRILL_TYPE.CONFIRMAT2]
    return []
} 

export function getEdge(detail: WardrobeDetailTable): EDGE_SIDE | undefined {
    if ([DETAIL_NAME.ROOF].includes(detail.name as DETAIL_NAME)) return singleLengthThickDoubleWidthThinEdge()
    if ([DETAIL_NAME.STAND].includes(detail.name as DETAIL_NAME)) return singleLengthThickEdge()
    if ([DETAIL_NAME.INNER_STAND, DETAIL_NAME.SHELF, DETAIL_NAME.SHELF_PLAT, DETAIL_NAME.PILLAR].includes(detail.name as DETAIL_NAME)) return singleLengthThinEdge()
    return undefined
}

export async function getZagByDSP(dspId: number): Promise<Zaglushka> {
    let service = new MaterialExtService<DSP_EDGE_ZAGL>(new DSPEdgeZaglServiceSQLite(materialsPath));
    const list = (await service.getExtData()).data as DSP_EDGE_ZAGL[];
    const zagservice = new MaterialExtService<Zaglushka>(new ZagluskaServiceSQLite(materialsPath));
    const zagList = (await zagservice.getExtData()).data as Zaglushka[];
    const zagId = list.find(m => m.dspId === dspId)?.zaglushkaId
    const zaglushka = zagList.find(z => z.id === zagId) || { id: -1, code: "", name: "" }
    return zaglushka;
}

export async function getEdgeByDSP(dspId: number): Promise<Edge> {
    let service = new MaterialExtService<DSP_EDGE_ZAGL>(new DSPEdgeZaglServiceSQLite(materialsPath));
    const list = (await service.getExtData()).data as DSP_EDGE_ZAGL[];
    const edgeservice = new MaterialExtService<Edge>(new EdgeServiceSQLite(materialsPath));
    const edgeList = (await edgeservice.getExtData()).data as Edge[];
    const edgeId = list.find(m => m.dspId === dspId)?.edgeId
    const edge = edgeList.find(z => z.id === edgeId) || { id: -1, code: "", name: "", typeId: -1 }
    return edge;
}