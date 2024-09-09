import { correctFasadCount, emptyFullDataIfCorpus, emptyFullDataIfNoFasades, emptyFullDataIfSystem, getConfirmatByDetail, getDrill, getEdge, getEdgeByDSP, getEdgeDescripton, getEdgeLength, getFasadCount, getMinifixByDetail, getZagByDSP, singleLengthThickDoubleWidthThinEdge, singleLengthThickEdge, singleLengthThinEdge } from "./functions"
import { emptyFullData } from "./functions"
import { SpecificationItem } from "../../../types/specification"
import { DETAIL_NAME, DVPData, Detail, EDGE_TYPE, FullData, SpecificationResult, VerboseData, WARDROBE_KIND, WARDROBE_TYPE } from "../../../types/wardrobe"
import { Profile, ProfileType, Trempel } from "../../../types/materials"
import { WardrobeData } from "../../../types/wardrobe"
import { WardrobeDetailSchema } from "../../../types/schemas"
import { specServiceProvider, materialServiceProvider, materialsPath } from "../../options"
import { MaterialExtService } from "../../services/materialExtService"
import { SpecificationService } from "../../services/specificationService"
import BrushServiceSQLite from "../../services/extServices/brushServiceSQLite"
import TrempelServiceSQLite from "../../services/extServices/trempelServiceSQLite"
import { getFineRange } from "./functions"
import { getDSP } from "./functions"
import { getCoef } from "./functions"
import { calcFunction } from "./functions"

export async function getCorpusSpecification(data: WardrobeData, resetDetails: boolean, profile: Profile, verbose = false): Promise<SpecificationResult[]> {
    const result: SpecificationResult[] = []
    const details = !resetDetails ? data.details : await getDetails(data.wardKind, data.width, data.height, data.depth);
    const karton = await getKarton(data)
    const skotch = data.wardType === WARDROBE_TYPE.SYSTEM ? 0 : karton.data.amount * 20
    const truba = await getTruba(data, details)
    const edge2 = (await getEdge2(data, details))
    const edge05 = await getEdge05(data, details)
    result.push([SpecificationItem.DSP, await getDSP(data, details)])
    result.push([SpecificationItem.DVP, await getDVP(data)])
    result.push([SpecificationItem.Kromka2, edge2])
    result.push([SpecificationItem.Kromka05, edge05])
    result.push([SpecificationItem.Confirmat, await getConfirmat(data, details)])
    result.push([SpecificationItem.ZagConfirmat, await getZagConfirmat(data, details)])
    result.push([SpecificationItem.Minifix, await getMinifix(data, details)])
    result.push([SpecificationItem.ZagMinifix, await getZagMinifix(data, details)])
    result.push([SpecificationItem.Glue, await getGlue(data, edge2.data.amount, edge05.data.amount)])
    result.push([SpecificationItem.Planka, await getDVPPlanka(data)])
    result.push([SpecificationItem.Leg, await getLegs(data)])
    result.push([SpecificationItem.Karton, karton])
    result.push([SpecificationItem.Skotch, { data: { amount: skotch } }])
    result.push([SpecificationItem.Nails, await getNails(data)])
    result.push([SpecificationItem.Brush, await getBrush(data, profile, ProfileType.STANDART)])
    result.push([SpecificationItem.BrushBavaria, await getBrush(data, profile, ProfileType.BAVARIA)])
    result.push([SpecificationItem.NapravTop, await getNaprav(data, profile, true)])
    result.push([SpecificationItem.NapravBottom, await getNaprav(data, profile, false)])
    result.push([SpecificationItem.Samorez16, await getSamorez16(data)])
    result.push([SpecificationItem.StyagkaM6, await getStyagka(data)])
    result.push([SpecificationItem.Truba, truba])
    result.push([SpecificationItem.Flanec, await getFlanec(truba)])
    result.push([SpecificationItem.Trempel, await getTrempel(data)]);
    result.push([SpecificationItem.Streich, { data: { amount: 12 } }])
    result.push([SpecificationItem.Stopor, await getStopor(data)])
    result.push([SpecificationItem.ConfKluch, await getKluch(data)])
    result.push([SpecificationItem.Box, await getBox(data)])
    if (!verbose) {
        result.forEach(r => {
            r[1].verbose = undefined
        })
    }
    return result
}

export function useMinifix(detail: DETAIL_NAME): boolean {
    return detail === DETAIL_NAME.STAND ||
        detail === DETAIL_NAME.INNER_STAND ||
        detail === DETAIL_NAME.CONSOLE_STAND ||
        detail === DETAIL_NAME.CONSOLE_BACK_STAND;
}

export async function getDetailNames(): Promise<WardrobeDetailSchema[]> {
    const service = new SpecificationService(specServiceProvider);
    const result = await service.getDetailNames();
    return result.data as WardrobeDetailSchema[];
}

export async function getDetails(kind: WARDROBE_KIND, width: number, height: number, depth: number): Promise<Detail[]> {
    const service = new SpecificationService(specServiceProvider);
    const detailsData = await service.getDetails(kind, width, height)
    const detailNames = (await service.getDetailNames()).data || [];
    const offset = 100;
    const details: Detail[] = detailsData.map(dd => (
        {
            name: dd.name,
            caption: detailNames.find(n => n.name === dd.name)?.caption || "",
            length: calcFunction(dd.size, { width, height }),
            width: dd.name === DETAIL_NAME.ROOF || dd.name === DETAIL_NAME.STAND ? depth : depth - offset,
            count: dd.count,
            drill: getDrill(dd),
            edge: getEdge(dd)
        }))
    return details;
}
async function getDetail(service: SpecificationService, kind: WARDROBE_KIND, name: DETAIL_NAME, width: number, height: number): Promise<{ count: number, size: number }> {
    const details = await service.getDetails(kind, width, height)
    const detail = details.find(d => d.name === name)
    if (!detail) return { count: 0, size: 0 };
    const size = calcFunction(detail.size, { width, height });
    return { count: size ? detail.count : 0, size };
}
async function getDVP(data: WardrobeData): Promise<FullData> {
    if (data.wardType === WARDROBE_TYPE.SYSTEM) return emptyFullDataIfSystem()
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
    if (data.wardType === WARDROBE_TYPE.SYSTEM) return emptyFullDataIfSystem()
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
    let dvpRealWidth
    let dvpCount = 0
    do {
        dvpCount++
        dvpRealWidth = Math.round((height - 30 - 2 * (dvpCount - 1)) / dvpCount)
    } while (dvpRealWidth > depth)
    const section = width > 2750 ? 2 : 1;
    dvpCount *= section
    const roof = width / section;
    const dvpRealLength = roof - 3;
    const service = new SpecificationService(specServiceProvider);
    const data = (await service.getDVPTemplates()).data || [{ width: 0, length: 0 }];
    const { width: dvpWidth, length: dvpLength } = data.filter(d => d.width >= dvpRealWidth && d.length >= dvpRealLength).sort((i1, i2) => ((i1.width - dvpRealWidth) + (i1.length - dvpRealLength)) < ((i2.width - dvpRealWidth) + (i2.length - dvpRealLength)) ? -1 : 1)[0]
    const dvpPlanka = roof - 32;
    const dvpPlankaCount = section === 1 ? (dvpCount - 1) : (dvpCount / 2 - 1) * 2;
    return { dvpWidth, dvpLength, dvpRealWidth, dvpRealLength, dvpCount, dvpPlanka, dvpPlankaCount };
}

async function getKarton(data: WardrobeData): Promise<FullData> {
    const { width, height, depth } = data;
    const service = new SpecificationService(specServiceProvider, materialServiceProvider);
    const item = await service.getFurniture(data.wardKind, SpecificationItem.Karton, data.width, data.height, data.depth)
    //const caption = await getWardrobeKind(data.wardKind);
    const coef = await getCoef(SpecificationItem.Karton) || 1;
    const verbose = [["Ширина шкафа", "Высота шкафа", "Глубина шкафа", "Кол-во"]];
    const result = item?.count || 0
    verbose.push([getFineRange(item?.minwidth || 0, item?.maxwidth||0), getFineRange(item?.minheight ||0, item?.maxheight||0), getFineRange(item?.mindepth||0, item?.maxdepth||0), `${result}`]);
    return { data: { amount: result * coef, char: { code: "", caption: "" } }, verbose };
}

async function getLegs(data: WardrobeData): Promise<FullData> {
    if (data.wardType === WARDROBE_TYPE.SYSTEM) return emptyFullDataIfSystem()
    const service = new SpecificationService(specServiceProvider, materialServiceProvider);
    const item = await service.getFurniture(data.wardKind, SpecificationItem.Leg, data.width, data.height, data.depth)
    //const caption = await getWardrobeKind(data.wardKind);
    const result = item?.count || 0
    const verbose = [["Ширина шкафа", "Кол-во"]];
    verbose.push([getFineRange(item?.minwidth || 0, item?.maxwidth || 0), `${result}`]);
    return { data: { amount: result, char: { code: "", caption: "" } }, verbose };
}

export async function getConfirmat(data: WardrobeData, details: Detail[]): Promise<FullData> {
    if (data.wardType === WARDROBE_TYPE.SYSTEM) return emptyFullDataIfSystem()
    const detailNames = await getDetailNames();
    const verbose: VerboseData = [["Деталь", "Кол-во", "Конфирматы \n на 1 деталь", "Итого"]];
    let total = 0;
    details.forEach(d => {
        const conf = getConfirmatByDetail(d)
        if (conf === 0) return
        const caption = detailNames.find(n => n.name === d.name)?.caption || "";
        verbose.push([caption, `${d.count}`, `${conf}`, `${d.count * conf}`]);
        total += d.count * conf;
    });
    verbose.push(["", "", "Итого:", total]);
    return { data: { amount: total, char: { code: "", caption: "" } }, verbose: total ? verbose : undefined };
}

async function getZagConfirmat(data: WardrobeData, details: Detail[]): Promise<FullData> {
    if (data.wardType === WARDROBE_TYPE.SYSTEM) return emptyFullData()
    const zaglushka = await getZagByDSP(data.dspName)
    const { code, name: caption } = zaglushka;
    const conf = await getConfirmat(data, details);
    return { data: { amount: conf.data.amount, char: { code, caption } } };
}

export async function getMinifix(data: WardrobeData, details: Detail[]): Promise<FullData> {
    if (data.wardType === WARDROBE_TYPE.SYSTEM) return emptyFullDataIfSystem()
    const detailNames = await getDetailNames();
    const verbose: VerboseData = [["Деталь", "Кол-во", `Минификсы \n на 1 деталь`, "Итого"]];
    let total = 0;
    details.forEach(d => {
        const count = getMinifixByDetail(d)
        if (count === 0) return
        const caption = detailNames.find(n => n.name === d.name)?.caption || "";
        verbose.push([caption, `${d.count}`, `${count}`, `${d.count * count}`]);
        total += d.count * count;
    });
    verbose.push(["", "", "Итого:", total]);
    return { data: { amount: total, char: { code: "", caption: "" } }, verbose };
}
async function getZagMinifix(data: WardrobeData, details: Detail[]): Promise<FullData> {
    if (data.wardType === WARDROBE_TYPE.SYSTEM) return emptyFullData()
    const zaglushka = await getZagByDSP(data.dspName)
    const { code, name: caption } = zaglushka;
    const conf = await getMinifix(data, details);
    return { data: { amount: conf.data.amount, char: { code, caption } } };
}
export async function getNails(data: WardrobeData): Promise<FullData> {
    if (data.wardType === WARDROBE_TYPE.SYSTEM) return emptyFullDataIfSystem()
    const service = new SpecificationService(specServiceProvider, materialServiceProvider);
    const item = await service.getFurniture(data.wardKind, SpecificationItem.Nails, data.width, data.height, data.depth)
    //const caption = await getWardrobeKind(wardKind);
    const result = item?.count || 0
    const verbose: VerboseData = [["Ширина шкафа", "Кол-во"]];
    verbose.push([getFineRange(item?.minwidth || 0, item?.maxwidth || 0), `${result}`]);
    return { data: { amount: result, char: { code: "", caption: "" } }, verbose };
}

export async function getSamorez16(data: WardrobeData): Promise<FullData> {
    if (data.wardType === WARDROBE_TYPE.SYSTEM) return emptyFullDataIfSystem()
    const { wardKind, width, height, depth } = data;
    const service = new SpecificationService(specServiceProvider, materialServiceProvider);
    const item = await service.getFurniture(wardKind, SpecificationItem.Samorez16, width, height, depth);
    //const caption = await getWardrobeKind(wardKind);
    const current = item?.count || 0
    const verbose: VerboseData = [["Ширина шкафа", "Кол-во"]];
    verbose.push([getFineRange(item?.minwidth || 0, item?.maxwidth || 0), `${current}`]);
    return { data: { amount: current, char: { code: "", caption: "" } }, verbose };
}

async function getStyagka(data: WardrobeData): Promise<FullData> {
    const service = new SpecificationService(specServiceProvider, materialServiceProvider);
    const details = await service.getDetails(data.wardKind, data.width, data.height)
    const roof = details.find(d => d.name === DETAIL_NAME.ROOF)
    const ward = roof?.count === 2 ? "Одинарный" : "Двойной"
    const count = roof?.count === 2 ? 0 : 3
    const verbose = [["Шкаф", "Стяжка М6"]];
    verbose.push([ward, `${count}шт`]);
    return { data: { amount: count, char: { code: "", caption: "" } }, verbose };
}

export async function getEdge2(data: WardrobeData, details: Detail[]): Promise<FullData> {
    if (data.wardType === WARDROBE_TYPE.SYSTEM) return emptyFullDataIfSystem()
    const edge = await getEdgeByDSP(data.dspName)
    const { code, name: caption } = edge;
    const detailNames = await getDetailNames();
    const verbose = [["Деталь", "Длина", "Ширина", "Кол-во", "Кромка", "Длина кромки, м", ""]];
    let totalEdge = 0;
    details.forEach(d => {
        const edge = getEdgeLength(d, EDGE_TYPE.THICK) * d.count / 1000;
        if (edge === 0) return
        const caption = detailNames.find(n => n.name === d.name)?.caption || "";
        const desc = getEdgeDescripton(d, EDGE_TYPE.THICK)
        verbose.push([caption, `${d.length}`, `${d.width}`, `${d.count}`, desc, edge.toFixed(3), ""]);
        totalEdge += edge;
    });
    const coef = await getCoef(SpecificationItem.Kromka2);
    verbose.push(["", "", "", "", "", totalEdge.toFixed(3), `x ${coef} = ${(totalEdge * coef).toFixed(3)}`]);
    return { data: { amount: totalEdge * coef, char: { code, caption } }, verbose };
}

export async function getEdge05(data: WardrobeData, details: Detail[]): Promise<FullData> {
    if (data.wardType === WARDROBE_TYPE.SYSTEM) return emptyFullDataIfSystem()
    const edge = await getEdgeByDSP(data.dspName)
    const { code, name: caption } = edge;
    const detailNames = await getDetailNames();
    const verbose = [["Деталь", "Длина", "Ширина", "Кол-во", "Кромка", "Длина кромки, м", ""]];
    let totalEdge = 0;
    details.forEach(d => {
        const edge = getEdgeLength(d, EDGE_TYPE.THIN) * d.count / 1000;
        if (edge === 0) return
        const caption = detailNames.find(n => n.name === d.name)?.caption || "";
        const desc = getEdgeDescripton(d, EDGE_TYPE.THIN)
        verbose.push([caption, `${d.length}`, `${d.width}`, `${d.count}`, desc, edge.toFixed(3), ""]);
        totalEdge += edge;
    });
    const coef = await getCoef(SpecificationItem.Kromka2);
    verbose.push(["", "", "", "", "", totalEdge.toFixed(3), `x ${coef} = ${(totalEdge * coef).toFixed(3)}`]);
    return { data: { amount: totalEdge * coef, char: { code, caption } }, verbose };
}

export async function getGlue(data: WardrobeData, edge2: number, edge05: number): Promise<FullData> {
    if (data.wardType === WARDROBE_TYPE.SYSTEM) return emptyFullDataIfSystem()
    const coefGlue = await getCoef(SpecificationItem.Glue);
    const glue = (edge2 + edge05) * coefGlue * 0.008;
    const verbose = [["Кромка 2мм", "Кромка 0.45мм", "Итого", "Клей"]];
    verbose.push([edge2.toFixed(3), edge05.toFixed(3), (edge2 + edge05).toFixed(3), `x 0.008 = ${glue.toFixed(3)}`]);
    return { data: { amount: glue, char: { code: "", caption: "" } }, verbose };
}

async function getBrush(data: WardrobeData, profile: Profile, type: ProfileType): Promise<FullData> {
    const fasadCount = getFasadCount(data)
    if(!correctFasadCount(fasadCount)) return emptyFullDataIfNoFasades()
    if (profile.type !== type) return emptyFullData()
    const service = new MaterialExtService(new BrushServiceSQLite(materialsPath))
    const brushList = (await (service.getExtData())).data
    const brush = brushList && brushList.find(b => b.name === profile.brush) || { name: "", code: "" }
    const { code, name: caption } = brush
    const coef = await getCoef(type === ProfileType.STANDART ? SpecificationItem.Brush : SpecificationItem.BrushBavaria);
    const verbose = [["Высота стойки", "Кол-во фасадов", ""]]
    const height = (data.height - 62)
    const result = height / 1000 * coef * fasadCount * 2
    verbose.push([`${data.height}-62=${height}`, `x ${fasadCount}`, `x 2 x ${coef}`, `=${result.toFixed(3)}м`])
    return { data: { amount: result, char: { code, caption }, useCharAsCode: true }, verbose }
}

async function getNaprav(data: WardrobeData, profile: Profile, top: boolean): Promise<FullData> {
    if (data.wardType === WARDROBE_TYPE.CORPUS) return emptyFullDataIfCorpus()
    const item = top ? SpecificationItem.NapravTop : SpecificationItem.NapravBottom
    const coef = await getCoef(item)
    const width = data.width - 32
    const result = (width / 1000) * coef
    const coefString = coef !== 1 ? `x ${coef} =  ${result.toFixed(3)}` : ""
    const verbose = [['Длина', '', '']]
    verbose.push([`(${data.width} - 32)`, `${(width / 1000).toFixed(3)}м`, coefString])
    return { data: { amount: result, char: { code: profile.code, caption: profile.name } }, verbose }
}

export async function getTruba(data: WardrobeData, details: Detail[]): Promise<FullData & { count: number }> {
    if (data.wardType === WARDROBE_TYPE.SYSTEM) return { ...emptyFullDataIfSystem(), count: 0 }
    const coef = await getCoef(SpecificationItem.Truba)
    const service = new SpecificationService(specServiceProvider, materialServiceProvider);
    const item = await service.getFurniture(data.wardKind, SpecificationItem.Truba, data.width, data.height, data.depth );
    const shelfPlat = details.find(d => d.name === DETAIL_NAME.SHELF_PLAT)
    const size = shelfPlat?.length || 0
    //const caption = await getWardrobeKind(wardKind);
    const count = item?.count || 0
    const result = size * count / 1000 * coef
    const coefString = coef !== 1 ? ` x ${coef} =  ${result.toFixed(3)}` : ""
    const verbose: VerboseData = [["Ширина шкафа", "Глубина шкафа", "Кол-во", "Длина", "Итого"]];
    if (count > 0) verbose.push([getFineRange(item?.minwidth || 0, item?.maxwidth || 0), getFineRange(item?.mindepth || 0, item?.maxdepth || 0), `${count}`, `${size}`, `${(size * count / 1000).toFixed(3) + coefString}`]);
    else verbose.push(["", `${data.depth}`, `нет`, ``, ``]);
    return { data: { amount: result, char: { code: "", caption: "" } }, verbose, count };
}
async function  getFlanec(truba: FullData & { count: number }): Promise<FullData> {
    const count = truba.count
    const verbose: VerboseData = [["Труба", "Фланец"]];
    if (count > 0) verbose.push([`${count}шт`, `${count * 2}шт`]);else verbose.push([`нет`, `нет`])
    return { data: { amount: count * 2 }, verbose }
}

export async function getTrempel(data: WardrobeData): Promise<FullData> {
    if (data.wardType === WARDROBE_TYPE.SYSTEM) return emptyFullDataIfSystem()
    const service = new SpecificationService(specServiceProvider, materialServiceProvider);
    const matService = new MaterialExtService<Trempel>(new TrempelServiceSQLite(materialsPath));
    const list = (await matService.getExtData()).data as Trempel[];
    const [trempel, mindepth, maxdepth] = data.depth <= 400 ? [list.find(l => l.name === 't250'), 0, 400] : [list.find(l => l.name === 't300'), 401, 499]
    const item = await service.getFurniture(data.wardKind, SpecificationItem.Trempel, data.width, data.height, data.depth );
    const count = item?.count || 0
    const verbose: VerboseData = [["Ширина шкафа", "Глубина шкафа", "Тремпель", "Кол-во"]];
    if (count > 0) verbose.push([getFineRange(item?.minwidth || 0, item?.maxwidth || 0), getFineRange(mindepth, maxdepth), trempel?.caption || "", `${count}`]);
    else verbose.push(["", `${data.depth}`, "", "нет"]);
    return { data: { amount: count, char: { code: trempel?.code || "", caption: trempel?.caption || "" } }, verbose };
}

async function getStopor(data: WardrobeData): Promise<FullData> {
    const fasadCount = getFasadCount(data)
    const verbose: VerboseData = [["", ""]];
    verbose.push(["Кол-во фасадов", `${fasadCount}`]);
    return { data: { amount: fasadCount }, verbose };
}
async function getKluch(data: WardrobeData): Promise<FullData> {
    if (data.wardType === WARDROBE_TYPE.SYSTEM) return emptyFullDataIfSystem()
    return { data: { amount: 1 } };
}
async function getBox(data: WardrobeData): Promise<FullData> {
    if (data.wardType === WARDROBE_TYPE.SYSTEM) return emptyFullDataIfSystem()
    return { data: { amount: 1 } };
}

