import { emptyFullData, getFasadCount, getSpecificationPattern } from "./fasades"
import { SpecificationItem } from "../../../types/specification"
import { DETAIL_NAME, DVPData, Detail, FullData, VerboseData, WARDROBE_KIND, WardrobeDetailTable } from "../../../types/wardrobe"
import { Edge, ExtMaterial, Profile, ProfileType, Zaglushka } from "../../../types/materials"
import { IWardrobe, WardrobeData } from "../../../types/wardrobe"
import StandartWardrobe from "../standart"
import { FasadMaterial } from "../../../types/enums"
import { WardrobeFurnitureTableSchema, WardrobeDetailSchema } from "../../../types/schemas"
import { specServiceProvider, materialServiceProvider, materialsPath } from "../../options"
import EdgeServiceSQLite from "../../services/extServices/edgeServiceSQLite"
import ZagluskaServiceSQLite from "../../services/extServices/zaglushkaServiceSQLite"
import { MaterialExtService } from "../../services/materialExtService"
import { MaterialService } from "../../services/materialService"
import { SpecificationService } from "../../services/specificationService"
import BrushServiceSQLite from "../../services/extServices/brushServiceSQLite"

export async function getCorpusSpecification(wardrobe: IWardrobe, data: WardrobeData, profile: Profile): Promise<Map<SpecificationItem, FullData[]>> {
    const spec = getSpecificationPattern()
    //const { details, dsp, dvpData, legs, karton } = intermediateData
    const truba = wardrobe.getTruba()
    const trempel = wardrobe.getTrempel()
    const karton = [await getKarton(data)]
    spec.set(SpecificationItem.DSP, [await getDSP(data)])
    spec.set(SpecificationItem.DVP, [await getDVP(data)])
    spec.set(SpecificationItem.Kromka2, [await getEdge2(data)])
    spec.set(SpecificationItem.Kromka05, [await getEdge05(data)])
    spec.set(SpecificationItem.Confirmat, [await getConfirmat(data)])
    spec.set(SpecificationItem.ZagConfirmat, [await getZagConfirmat(data)])
    spec.set(SpecificationItem.Minifix, [await getMinifix(data)])
    spec.set(SpecificationItem.ZagMinifix, [await getZagMinifix(data)])
    spec.set(SpecificationItem.Glue, [await getGlue(data)])
    spec.set(SpecificationItem.Planka, [await getDVPPlanka(data)])
    spec.set(SpecificationItem.Leg, [await getLegs(data)])
    spec.set(SpecificationItem.Karton, karton)
    spec.set(SpecificationItem.Skotch, [{ data: { amount: karton[0].data.amount * 20 } }])
    spec.set(SpecificationItem.Nails, [await getNails(data)])
    spec.set(SpecificationItem.Brush, [await getBrush(data, profile, ProfileType.STANDART)])
    spec.set(SpecificationItem.BrushBavaria, [await getBrush(data, profile, ProfileType.BAVARIA)])
    //spec.set(SpecificationItem.NapravTop, { amount: wardrobe.getNaprav() * (coefList.get(SpecificationItem.NapravTop) || 1) })
    //spec.set(SpecificationItem.NapravBottom, { amount: wardrobe.getNaprav() * (coefList.get(SpecificationItem.NapravBottom) || 1) })
    //spec.set(SpecificationItem.Samorez16, { amount: wardrobe.getSamorez16() * (coefList.get(SpecificationItem.Samorez16) || 1) })
    //spec.set(SpecificationItem.StyagkaM6, { amount: wardrobe.getStyagka() * (coefList.get(SpecificationItem.StyagkaM6) || 1) })
    //spec.set(SpecificationItem.NapravTop, { amount: truba.length * truba.count * (coefList.get(SpecificationItem.Truba) || 1) })
    // if (trempel.length === 250)
    //     spec.set(SpecificationItem.Trempel250, { amount: trempel.count * (coefList.get(SpecificationItem.Trempel250) || 1) });
    // else
    //     spec.set(SpecificationItem.Trempel300, { amount: trempel.count * (coefList.get(SpecificationItem.Trempel300) || 1) })

    //spec.set(SpecificationItem.Streich, { amount: 12 })
    return spec
}

export function getWardrobe(data: WardrobeData, details: Detail[]): IWardrobe {
    switch (data.wardKind) {
        case WARDROBE_KIND.STANDART:
            return new StandartWardrobe(data, details)
        default:
            return new StandartWardrobe(data, details)
    }
}
function getFineRange(min: number, max: number): string {
    const maxValue = 3000;
    let result = "";
    if (min <= 0 && max >= maxValue) result = "---";
    if (min <= 0 && max < maxValue) result = "<= " + max;
    if (min > 0 && max >= maxValue) result = ">= " + min;
    if (min > 0 && max < maxValue) result = min + " - " + max;
    return result;
}

export function isDataFit(width: number, height: number, depth: number, item: WardrobeFurnitureTableSchema): boolean {
    return (width >= item.minwidth) && (width <= item.maxwidth) && (height >= item.minheight) && (height <= item.maxheight) && (depth >= item.mindepth) && (depth <= item.maxdepth);
}

export function hasEdge2(detail: DETAIL_NAME): boolean {
    return detail === DETAIL_NAME.ROOF ||
        detail === DETAIL_NAME.STAND ||
        detail === DETAIL_NAME.CONSOLE_STAND ||
        detail === DETAIL_NAME.CONSOLE_BACK_STAND ||
        detail === DETAIL_NAME.CONSOLE_ROOF;
}
export function hasEdge05(detail: DETAIL_NAME): boolean {
    return detail === DETAIL_NAME.ROOF ||
        detail === DETAIL_NAME.INNER_STAND ||
        detail === DETAIL_NAME.SHELF ||
        detail === DETAIL_NAME.SHELF_PLAT ||
        detail === DETAIL_NAME.PILLAR;
}
export function useConfirmat(detail: DETAIL_NAME): boolean {
    return detail === DETAIL_NAME.SHELF ||
        detail === DETAIL_NAME.SHELF_PLAT ||
        detail === DETAIL_NAME.PILLAR;
}
export function useMinifix(detail: DETAIL_NAME): boolean {
    return detail === DETAIL_NAME.STAND ||
        detail === DETAIL_NAME.INNER_STAND ||
        detail === DETAIL_NAME.CONSOLE_STAND ||
        detail === DETAIL_NAME.CONSOLE_BACK_STAND;
}

export async function getCoef(item: SpecificationItem): Promise<number> {
    const specService = new SpecificationService(specServiceProvider, materialServiceProvider);
    const list = await specService.getSpecList();
    const coef = list.data?.find(s => s.name === item)?.coef || 1;
    return coef;
}

export async function getDetailNames(): Promise<WardrobeDetailSchema[]> {
    const service = new SpecificationService(specServiceProvider);
    const result = await service.getDetailNames();
    return result.data as WardrobeDetailSchema[];
}

export async function getDetails(kind: WARDROBE_KIND, width: number, height: number, depth: number): Promise<Detail[]> {
    const service = new SpecificationService(specServiceProvider);
    const result = await service.getDetailTable({ kind });
    if (!result.success) return [];
    const table = result.data as WardrobeDetailTable[];
    const details: Detail[] = [];
    var { count, size } = getDetail(table, DETAIL_NAME.ROOF, width, height, 0, 0);
    const offset = 100;
    if (count > 0) details.push({ name: DETAIL_NAME.ROOF, length: size, width: depth, count });
    var { count, size } = getDetail(table, DETAIL_NAME.STAND, width, height, 0, 0);
    if (count > 0) details.push({ name: DETAIL_NAME.STAND, length: size, width: depth, count });
    var { count, size } = getDetail(table, DETAIL_NAME.INNER_STAND, width, height, 0, 0);
    const innerStandLCount = count;
    if (count > 0) details.push({ name: DETAIL_NAME.INNER_STAND, length: size, width: depth - offset, count });
    var { count, size } = getDetail(table, DETAIL_NAME.SHELF, width, height, 0, innerStandLCount);
    const shelfSize = size;
    if (count > 0) details.push({ name: DETAIL_NAME.SHELF, length: size, width: depth - offset, count });
    var { count, size } = getDetail(table, DETAIL_NAME.SHELF_PLAT, width, height, shelfSize, innerStandLCount);
    if (count > 0) details.push({ name: DETAIL_NAME.SHELF_PLAT, length: size, width: depth - offset, count });
    var { count, size } = getDetail(table, DETAIL_NAME.PILLAR, width, height, shelfSize, innerStandLCount);
    if (count > 0) details.push({ name: DETAIL_NAME.PILLAR, length: size, width: depth - offset, count });
    return details;
}
function getDetail(table: WardrobeDetailTable[], name: DETAIL_NAME, width: number, height: number, shelfSize: number, standCount: number): { count: number; size: number; } {
    const detail = table.find(t => (name === t.name) && (width >= t.minwidth) && (width <= t.maxwidth) && (height >= t.minheight) && (height <= t.maxheight));
    if (!detail) return { count: 0, size: 0 };
    const size = calcFunction(detail.size, { width, height, shelfSize, standCount });
    return { count: size ? detail.count : 0, size };
}
function calcFunction(func: string, { width, height, shelfSize, standCount }: { width: number; height: number; shelfSize: number; standCount: number; }): number {
    try {
        const f = new Function('W', 'H', 'ShL', 'StN', 'return ' + func);
        const result = f(width, height, shelfSize, standCount);
        return result;
    } catch (e) {
        return 0;
    }
}

async function getDSP(data: WardrobeData): Promise<FullData> {
    const matService = new MaterialService(materialServiceProvider);
    const materials = (await matService.getExtMaterials({ material: FasadMaterial.DSP, name: "", code: "" })).data as ExtMaterial[];
    const mat = materials.find(m => m.name === data.dspName) || { code: "", name: "" };
    const { code, name: caption } = mat;
    const details = await getDetails(data.wardKind, data.width, data.height, data.depth);
    const detailNames = await getDetailNames();
    const verbose = [["Деталь", "Длина", "Ширина", "Кол-во", "Площадь", ""]];
    let totalArea = 0;
    details.forEach(d => {
        const area = d.length * d.width * d.count / 1000000;
        const caption = detailNames.find(n => n.name === d.name)?.caption || "";
        verbose.push([caption, `${d.length}`, `${d.width}`, `${d.count}`, area.toFixed(3), ""]);
        totalArea += area;
    });
    const coef = await getCoef(SpecificationItem.DSP);
    verbose.push(["", "", "", "", totalArea.toFixed(3), `x ${coef} = ${(totalArea * coef).toFixed(3)}`]);
    return { data: { amount: totalArea * coef, char: { code, caption } }, verbose };
}

async function getDVP(data: WardrobeData): Promise<FullData> {
    const dvp = await getDVPData(data.width, data.height, data.depth);
    const coef = await getCoef(SpecificationItem.DVP);
    const area = dvp.dvpLength * dvp.dvpWidth * dvp.dvpCount / 1000000;
    const areaCoef = area * coef;
    const verbose = [["", "Длина", "Ширина", "Кол-во", ""]];
    const count = dvp.dvpCount
    verbose.push(["Расчетные", `${dvp.dvpRealLength}`, `${dvp.dvpRealWidth} =((${data.height}-30-2x${count - 1})/${count})`, `${dvp.dvpCount}`, ``]);
    verbose.push(["Распиловочные", `${dvp.dvpLength}`, `${dvp.dvpWidth}`, `${dvp.dvpCount}`, `${area.toFixed(3)} x ${coef}= ${areaCoef.toFixed(3)}`]);
    return { data: { amount: areaCoef, char: { code: "", caption: "" } }, verbose };
}

async function getDVPPlanka(data: WardrobeData): Promise<FullData> {
    const { width, height, depth } = data;
    const dvpData = await getDVPData(width, height, depth);
    const coef = await getCoef(SpecificationItem.Planka);
    const verbose: VerboseData = [["Длина планки", "Кол-во", "Итого"]];
    const total = dvpData.dvpPlanka * dvpData.dvpPlankaCount / 1000;
    const dvpLength = dvpData.dvpRealLength + 3
    const totalCoef = total * coef;
    verbose.push([`${dvpData.dvpPlanka} = (${dvpLength}-32)`, dvpData.dvpPlankaCount, `${(dvpData.dvpPlanka / 1000).toFixed(3)} x ${dvpData.dvpPlankaCount} = ${total.toFixed(3)}`]);
    if (coef !== 1) verbose.push(["", "", `${total.toFixed(3)} x ${coef} = ${totalCoef.toFixed(3)}`]);
    return { data: { amount: totalCoef, char: { code: "", caption: "" } }, verbose };
}

async function getDVPData(width: number, height: number, depth: number): Promise<DVPData> {
    const lines = [3, 4, 5, 6, 7, 8];
    const dvpLayers = lines.map(l => ({ width: Math.round((height - 30 - 2 * (l - 1)) / l), count: l }));
    const service = new SpecificationService(specServiceProvider);
    const result = await service.getDVPTemplates();
    if (!result.success) return { dvpWidth: 0, dvpLength: 0, dvpRealWidth: 0, dvpRealLength: 0, dvpCount: 0, dvpPlanka: 0, dvpPlankaCount: 0 };
    if (!result.data) return { dvpWidth: 0, dvpLength: 0, dvpRealWidth: 0, dvpRealLength: 0, dvpCount: 0, dvpPlanka: 0, dvpPlankaCount: 0 };
    const dvpTemplates592 = result.data.filter(d => d.width === 592).map(i => i.length);
    const dvpTemplates393 = result.data.filter(d => d.width === 393).map(i => i.length);
    const found = dvpLayers.find(d => d.width <= depth) || { count: 1, width: height };
    const section = width > 2750 ? 2 : 1;
    const roof = width / section;
    const dvpRealWidth = found.width;
    const dvpRealLength = roof - 3;
    const length592 = dvpTemplates592.find(t => t >= dvpRealLength);
    const length393 = dvpTemplates393.find(t => t >= dvpRealLength);
    let dvpWidth;
    let dvpLength;
    if (found.width <= 393 && length393) {
        dvpWidth = 393;
        dvpLength = length393;
    } else {
        dvpWidth = 592;
        dvpLength = length592 || 0;
    }
    const dvpCount = found.count * section;
    const dvpPlanka = roof - 32;
    const dvpPlankaCount = section === 1 ? (dvpCount - 1) : (dvpCount / 2 - 1) * 2;

    return { dvpWidth, dvpLength, dvpRealWidth, dvpRealLength, dvpCount, dvpPlanka, dvpPlankaCount };
}

async function getKarton(data: WardrobeData): Promise<FullData> {
    const { width, height, depth } = data;
    const service = new SpecificationService(specServiceProvider, materialServiceProvider);
    const list = (await service.getFurnitureTable({ kind: WARDROBE_KIND.STANDART, item: SpecificationItem.Karton })).data || [];
    const caption = await getWardrobeKind(data.wardKind);
    const coef = await getCoef(SpecificationItem.Karton) || 1;
    const current = list.find(item => isDataFit(width, height, depth, item))?.count || 0;
    const verbose = [["Ширина шкафа", "Высота шкафа", "Глубина шкафа", "Кол-во"]];

    list.forEach(item => {
        const active = isDataFit(width, height, depth, item);
        if (active) verbose.push([getFineRange(item.minwidth, item.maxwidth), getFineRange(item.minheight, item.maxheight), getFineRange(item.mindepth, item.maxdepth), `${item.count}`]);
    });
    return { data: { amount: current * coef, char: { code: "", caption: "" } }, verbose };
}

async function getLegs(data: WardrobeData): Promise<FullData> {
    const { wardKind, width, height, depth } = data;
    const service = new SpecificationService(specServiceProvider, materialServiceProvider);
    const list = (await service.getFurnitureTable({ kind: data.wardKind, item: SpecificationItem.Leg })).data || [];
    const caption = await getWardrobeKind(data.wardKind);
    const current = list.find(item => isDataFit(width, height, depth, item))?.count || 0;
    const verbose = [["Ширина шкафа", "Кол-во"]];
    list.forEach(item => {
        verbose.push([getFineRange(item.minwidth, item.maxwidth), `${item.count}`]);
    });
    return { data: { amount: current, char: { code: "", caption: "" } }, verbose };
}

async function getConfirmat(data: WardrobeData): Promise<FullData> {
    const details = (await getDetails(data.wardKind, data.width, data.height, data.depth)).filter(d => useConfirmat(d.name));
    const detailNames = await getDetailNames();
    const verbose: VerboseData = [["Деталь", "Кол-во", "Конфирматы"]];
    let total = 0;
    details.forEach(d => {
        const conf = d.count * (d.name === DETAIL_NAME.PILLAR ? 2 : 4);
        const caption = detailNames.find(n => n.name === d.name)?.caption || "";
        verbose.push([caption, `${d.count}`, `${conf}`]);
        total += conf;
    });
    verbose.push(["", "Итого:", total]);
    return { data: { amount: total, char: { code: "", caption: "" } }, verbose };
}
async function getZagConfirmat(data: WardrobeData): Promise<FullData> {
    const service = new MaterialExtService<Zaglushka>(new ZagluskaServiceSQLite(materialsPath));
    const list = (await service.getExtData()).data as Zaglushka[];
    const zaglushka = list.find(m => m.dsp === data.dspName) || { code: "", name: "" };
    const { code, name: caption } = zaglushka;
    const conf = await getConfirmat(data);
    return { data: { amount: conf.data.amount, char: { code, caption } } };
}


async function getMinifix(data: WardrobeData): Promise<FullData> {
    const details = (await getDetails(data.wardKind, data.width, data.height, data.depth)).filter(d => useMinifix(d.name));
    const detailNames = await getDetailNames();
    const verbose: VerboseData = [["Деталь", "Кол-во", "Минификсы"]];
    let total = 0;
    details.forEach(d => {
        const count = d.count * ((d.name === DETAIL_NAME.CONSOLE_BACK_STAND || d.name === DETAIL_NAME.PILLAR) ? 2 : 4);
        const caption = detailNames.find(n => n.name === d.name)?.caption || "";
        verbose.push([caption, `${d.count}`, `${count}`]);
        total += count;
    });
    verbose.push(["", "Итого:", total]);
    return { data: { amount: total, char: { code: "", caption: "" } }, verbose };
}
async function getZagMinifix(data: WardrobeData): Promise<FullData> {
    const service = new MaterialExtService<Zaglushka>(new ZagluskaServiceSQLite(materialsPath));
    const list = (await service.getExtData()).data as Zaglushka[];
    const zaglushka = list.find(m => m.dsp === data.dspName) || { code: "", name: "" };
    const { code, name: caption } = zaglushka;
    const conf = await getMinifix(data);
    return { data: { amount: conf.data.amount, char: { code, caption } } };
}
async function getNails(data: WardrobeData): Promise<FullData> {
    const { wardKind, width, height, depth } = data;
    const service = new SpecificationService(specServiceProvider, materialServiceProvider);
    const list = (await service.getFurnitureTable({ kind: data.wardKind, item: SpecificationItem.Nails })).data || [];
    const caption = await getWardrobeKind(data.wardKind);
    const current = list.find(item => isDataFit(width, height, depth, item))?.count || 0;
    const verbose: VerboseData = [["Ширина шкафа", "Кол-во"]];
    list.forEach(item => {
        const active = isDataFit(width, height, depth, item);
        if (active) verbose.push([getFineRange(item.minwidth, item.maxwidth), `${item.count}`]);
    });
    return { data: { amount: current, char: { code: "", caption: "" } }, verbose };
}

function getSamorez16(width: number) {
    const sizes = [
        { width: 2200, value: 18 },
        { width: 2600, value: 28 },
        { width: 3001, value: 36 },
    ];
    return sizes.find((s => s.width > width))?.value || 0;
}
;

async function getEdge2(data: WardrobeData): Promise<FullData> {
    const edgeService = new MaterialExtService<Edge>(new EdgeServiceSQLite(materialsPath));
    const list = (await edgeService.getExtData()).data as Edge[];
    const edge = list.find(m => m.dsp === data.dspName) || { code: "", name: "" };
    const { code, name: caption } = edge;
    const details = (await getDetails(data.wardKind, data.width, data.height, data.depth)).filter(d => hasEdge2(d.name));
    const detailNames = await getDetailNames();
    const verbose = [["Деталь", "Длина", "Ширина", "Кол-во", "Длина кромки", ""]];
    let totalEdge = 0;
    details.forEach(d => {
        const edge = d.length * d.count / 1000;
        const caption = detailNames.find(n => n.name === d.name)?.caption || "";
        verbose.push([caption, `${d.length}`, `${d.width}`, `${d.count}`, edge.toFixed(3), ""]);
        totalEdge += edge;
    });
    const coef = await getCoef(SpecificationItem.Kromka2);
    verbose.push(["", "", "", "", totalEdge.toFixed(3), `x ${coef} = ${(totalEdge * coef).toFixed(3)}`]);
    return { data: { amount: totalEdge * coef, char: { code, caption } }, verbose };
}

async function getEdge05(data: WardrobeData): Promise<FullData> {
    const edgeService = new MaterialExtService<Edge>(new EdgeServiceSQLite(materialsPath));
    const list = (await edgeService.getExtData()).data as Edge[];
    const edge = list.find(m => m.dsp === data.dspName) || { code: "", name: "" };
    const { code, name: caption } = edge;
    const details = (await getDetails(data.wardKind, data.width, data.height, data.depth)).filter(d => hasEdge05(d.name));
    const detailNames = await getDetailNames();
    const verbose = [["Деталь", "Длина", "Ширина", "Кол-во", "Длина кромки", ""]];
    let totalEdge = 0;
    details.forEach(d => {
        const edge = (d.name === DETAIL_NAME.ROOF ? d.width * 2 : d.length) * d.count / 1000;
        const caption = detailNames.find(n => n.name === d.name)?.caption || "";
        verbose.push([caption, `${d.length}`, `${d.width}`, `${d.count}`, edge.toFixed(3), ""]);
        totalEdge += edge;
    });
    const coef = await getCoef(SpecificationItem.Kromka2);
    verbose.push(["", "", "", "", totalEdge.toFixed(3), `x ${coef} = ${(totalEdge * coef).toFixed(3)}`]);
    return { data: { amount: totalEdge * coef, char: { code, caption } }, verbose };
}

async function getGlue(data: WardrobeData): Promise<FullData> {
    const coefGlue = await getCoef(SpecificationItem.Glue);
    const edge2 = (await getEdge2(data)).data.amount;
    const edge05 = (await getEdge05(data)).data.amount;
    const glue = (edge2 + edge05) * coefGlue * 0.008;
    const verbose = [["Кромка 2мм", "Кромка 0.45мм", "Итого", "Клей"]];
    verbose.push([edge2.toFixed(3), edge05.toFixed(3), (edge2 + edge05).toFixed(3), `x 0.008 = ${glue.toFixed(3)}`]);
    return { data: { amount: glue, char: { code: "", caption: "" } }, verbose };
}

async function getBrush(data: WardrobeData, profile: Profile, type: ProfileType): Promise<FullData> {
    if (profile.type !== type) return emptyFullData()[0]
    const service = new MaterialExtService(new BrushServiceSQLite(materialsPath))
    const brushList = (await (service.getExtData())).data
    const brush = brushList && brushList.find(b => b.name === profile.brush) || { name: "", code: "" }
    const { code, name: caption } = brush
    const coef = await getCoef(type === ProfileType.STANDART ? SpecificationItem.Brush : SpecificationItem.BrushBavaria);
    const verbose = [["Высота стойки", "Кол-во фасадов", ""]]
    const fasadCount = getFasadCount(data)
    const height = (data.height - 62)
    const result = height / 1000 * coef * fasadCount * 2
    verbose.push([`${data.height}-62=${height}`, `x ${fasadCount}`, `x 2 x ${coef}`, `=${result.toFixed(3)}м`])
    return { data: { amount: result, char: { code, caption }, useCharAsCode: true }, verbose }
}

export async function getWardrobeKind(kind: WARDROBE_KIND): Promise<string> {
    const service = new SpecificationService(specServiceProvider, materialServiceProvider);
    const wardkinds = (await service.getWardobeKinds()).data as WardrobeDetailSchema[];
    const caption = wardkinds.find(w => w.name === kind)?.caption;
    return caption || "";
}


