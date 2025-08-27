import { correctFasadCount, emptyFullDataIfCorpus, emptyFullDataIfNoFasades, emptyFullDataIfSystem, getKromka, getKromkaDescripton, getKromkaLength, getFasadCount, nullDetail } from "./functions"
import { emptyFullData } from "./functions"
import { SpecItem } from "../../../types/specification"
import { DETAIL_NAME, DVPData, Detail, KROMKA_TYPE, FullData, SpecificationResult, VerboseData, WARDROBE_TYPE, WARDROBE_KIND } from "../../../types/wardrobe"
import { WardrobeData } from "../../../types/wardrobe"
import { getFineRange } from "./functions"
import { getDSP } from "./functions"
import { getCoef } from "./functions"
import { calcFunction } from "./functions"
import { getKromkaAndZaglByDSP, getKromkaTypeByChar } from "../../routers/functions/dspEdgeZag"
import { getFurniture } from "../../routers/functions/furniture"
import { getDetailsFromDB, getDetailsByWardrobe, getDVPTemplates } from "../../routers/functions/details"
import {  getCharIdAndBrushSpecIdByProfileId } from "../../routers/functions/profiles"
import { getChar } from "../../routers/functions/chars"
import { getAllCharOfSpec, getSpecList } from "../../routers/functions/spec"

export async function getCorpusSpecification(data: WardrobeData, resetDetails: boolean, verbose = false): Promise<SpecificationResult[]> {
    const result: SpecificationResult[] = []
    const details = !resetDetails ? data.details : await getDetails(data.wardrobeTypeId, data.wardrobeId, data.width, data.height, data.depth);
    const karton = await getKarton(data)
    const skotch = data.wardrobeTypeId === WARDROBE_TYPE.SYSTEM ? 0 : karton.data.amount * 20
    const truba = await getTruba(data)
    await getCommonData(data, details, result)
    const {brushSpecId, profileCharId} = await getCharIdAndBrushSpecIdByProfileId(data.profileId)
    result.push([SpecItem.DVP, await getDVP(data)])
    result.push([SpecItem.PlankaDVP, await getDVPPlanka(data)])
    result.push([SpecItem.Leg, await getLegs(data)])
    result.push([SpecItem.Karton, karton])
    result.push([SpecItem.Skotch, { data: { amount: skotch, charId: 0 } }])
    result.push([SpecItem.Nails, await getNails(data)])
    result.push([brushSpecId, await getBrush(data, brushSpecId)])
    result.push([SpecItem.NapravTop, await getNaprav(data, profileCharId, true)])
    result.push([SpecItem.NapravBottom, await getNaprav(data, profileCharId, false)])
    result.push([SpecItem.Samorez16, await getSamorez16(data)])
    result.push([SpecItem.StyagkaM6, await getStyagka(data)])
    result.push([SpecItem.Truba, truba])
    result.push([SpecItem.Flanec, await getFlanec(truba)])
    result.push([SpecItem.Trempel, await getTrempel(data)]);
    result.push([SpecItem.Pantograf, await getPantograf(data)])
    result.push([SpecItem.Streich, { data: { amount: 12, charId: 0 } }])
    result.push([SpecItem.Stopor, await getStopor(data)])
    result.push([SpecItem.ConfKluch, await getKluch(data)])
    result.push([SpecItem.Box, await getBox(data)])
    if (!verbose) {
        result.forEach(r => {
            r[1].verbose = undefined
        })
    }
    return result
}

export async function getCommonData(data: WardrobeData, details: Detail[], result: SpecificationResult[]){
    const kromkaAndZagl = await getKromkaAndZaglByDSP(data.dspId)
    const kromkaSpecId = await getKromkaTypeByChar(kromkaAndZagl.kromkaId)
    const kromkaPrimary = (await getKromkaPrimary(data, details, kromkaAndZagl.kromkaId))
    const kromkaSecondary = await getKromkaSecondary(data, details, kromkaSpecId, kromkaAndZagl.kromkaId)
    const spec = (await getSpecList()).data
    const kromkaPrimaryCaption = spec.find(s => s.id === SpecItem.Kromka2)?.name || ""
    const kromkaSecondaryCaption = spec.find(s => s.id === kromkaSpecId)?.name || ""
    result.push([SpecItem.DSP16, await getDSP(data, details)])
    result.push([SpecItem.Kromka2, kromkaPrimary])
    result.push([kromkaSpecId, kromkaSecondary])
    result.push([SpecItem.Glue, await getGlue(data, kromkaPrimary.data.amount, kromkaSecondary.data.amount, kromkaPrimaryCaption, kromkaSecondaryCaption)])
    result.push([SpecItem.Confirmat, await getConfirmat(data, details)])
    result.push([SpecItem.ZagConfirmat, await getZagConfirmat(data, details, kromkaAndZagl.zaglushkaId)])
    result.push([SpecItem.Minifix, await getMinifix(data, details)])
    result.push([SpecItem.ZagMinifix, await getZagMinifix(data, details, kromkaAndZagl.zaglushkaId)])
}

export function useMinifix(detail: DETAIL_NAME): boolean {
    return detail === DETAIL_NAME.STAND ||
        detail === DETAIL_NAME.INNER_STAND ||
        detail === DETAIL_NAME.CONSOLE_STAND ||
        detail === DETAIL_NAME.CONSOLE_BACK_STAND;
}


export async function getDetails(wardrobeTypeId: number, wardrobeId: number, width: number, height: number, depth: number): Promise<Detail[]> {
    const detailsData = await getDetailsByWardrobe(wardrobeId, width, height)
    const detailNames = (await getDetailsFromDB()).data
    const offset = wardrobeTypeId === WARDROBE_TYPE.GARDEROB ? 0 : 100;
    const details: Detail[] =  detailsData.map(dd => {
        const det = detailNames.find(n => n.id === dd.detailId) || nullDetail()
        return {   
            id: dd.detailId,
            name: det.name,
            length: calcFunction(dd.length, { width, height, depth, offset }),
            width: calcFunction(dd.width, { width, height, depth, offset }),
            count: dd.count,
            confirmat: det.confirmat,
            minifix: det.minifix,
            kromka: getKromka(det)
        }})
    return details;
}

async function getDVP(data: WardrobeData): Promise<FullData> {
    if (data.wardrobeTypeId === WARDROBE_TYPE.SYSTEM) return emptyFullDataIfSystem()
    const coef = await getCoef(SpecItem.DVP);
    let totalArea = 0
    const verbose = [["Расчетные размеры (Длина х Ширина (расчет ширины))", "Распиловочные размеры", "Кол-во", "Площадь"]];
    const depth = data.wardrobeId===WARDROBE_KIND.CORNER?450:data.depth
    const inputData = [{ width: data.width, height: data.height, depth }]
    if (data.wardrobeId === WARDROBE_KIND.CORNER) inputData.push({ width: data.width - 477, height: data.height, depth })
    for (let d of inputData) {
        const dvp = await getDVPData(d.width, d.height, d.depth);
        const area = dvp.dvpLength * dvp.dvpWidth * dvp.dvpCount / 1000000;
        totalArea += area;
        const count = dvp.dvpCount
        verbose.push([`${dvp.dvpRealLength} х ${dvp.dvpRealWidth} ((${data.height}-30-2x${count - 1})/${dvp.dvpRows})`, `${dvp.dvpLength} х ${dvp.dvpWidth}`, `${dvp.dvpCount}`, `${area.toFixed(3)}`]);
    }
    verbose.push(["", '', `Итого:`, `${totalArea.toFixed(3)} x ${coef}= ${(totalArea * coef).toFixed(3)}`]);
    return { data: { amount: totalArea * coef, charId: 0 }, verbose };
}

async function getDVPPlanka(data: WardrobeData): Promise<FullData> {
    if (data.wardrobeTypeId === WARDROBE_TYPE.SYSTEM) return emptyFullDataIfSystem()
    const coef = await getCoef(SpecItem.PlankaDVP);
    const verbose: VerboseData = [["Длина планки", "Кол-во", "Итого"]];
    let total = 0
    const inputData = [{ width: data.width, height: data.height, depth: data.depth }]
    if (data.wardrobeId === WARDROBE_KIND.CORNER) inputData.push({ width: data.width - 500, height: data.height, depth: data.depth })
    for (let d of inputData) {
        const dvpData = await getDVPData(d.width, d.height, d.depth);
        const len = dvpData.dvpPlanka * dvpData.dvpPlankaCount / 1000;
        total += len
        const dvpLength = dvpData.dvpRealLength + 3
        verbose.push([`${dvpLength}-32 = ${dvpData.dvpPlanka}`, dvpData.dvpPlankaCount, `${(dvpData.dvpPlanka / 1000).toFixed(3)} x ${dvpData.dvpPlankaCount} = ${len.toFixed(3)}`]);
    }
    verbose.push(["", "Итого:", `${total.toFixed(3)} x ${coef} = ${(total * coef).toFixed(3)}`]);
    return { data: { amount: total * coef, charId: 122 }, verbose };
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
    const data = (await getDVPTemplates()).data || [{ width: 0, length: 0 }];
    //const dvpData = data.filter(d => d.width >= dvpRealWidth && d.length >= dvpRealLength).sort((i1, i2) => ((i1.width - dvpRealWidth) + (i1.length - dvpRealLength)) < ((i2.width - dvpRealWidth) + (i2.length - dvpRealLength)) ? -1 : 1)[0]
    const dvpData = data.filter(d => d.width >= dvpRealWidth && d.length >= dvpRealLength).sort((i1, i2) => (i1.width * i1.length - dvpRealWidth * dvpRealLength) < (i2.width * i2.length - dvpRealWidth * dvpRealLength) ? -1 : 1)[0]
    const { width: dvpWidth, length: dvpLength } = dvpData ? dvpData : { width: dvpRealWidth, length: dvpRealLength }
    const dvpPlanka = roof - 32;
    const dvpPlankaCount = section === 1 ? (dvpCount - 1) : (dvpCount / 2 - 1) * 2;
    return { dvpWidth, dvpLength, dvpRealWidth, dvpRealLength, dvpRows: dvpCount / section, dvpCount, dvpPlanka, dvpPlankaCount };
}

async function getKarton(data: WardrobeData): Promise<FullData> {
    const item = (await getFurniture(data.wardrobeId, SpecItem.Karton, data.width, data.height, data.depth))[0]
    const coef = await getCoef(SpecItem.Karton) || 1;
    const verbose = [["Ширина шкафа", "Высота шкафа", "Глубина шкафа", "Кол-во"]];
    const result = item?.count || 0
    verbose.push([getFineRange(item?.minWidth || 0, item?.maxWidth||0), getFineRange(item?.minHeight ||0, item?.maxHeight||0), getFineRange(item?.minDepth||0, item?.maxDepth||0), `${result}`]);
    return { data: { amount: result * coef, charId: 0 }, verbose };
}

async function getLegs(data: WardrobeData): Promise<FullData> {
    if (data.wardrobeTypeId === WARDROBE_TYPE.SYSTEM) return emptyFullDataIfSystem()
    const item = (await getFurniture(data.wardrobeId, SpecItem.Leg, data.width, data.height, data.depth))[0]
    const charId = (await getAllCharOfSpec(SpecItem.Leg))[0] || 0
    const result = item?.count || 0
    const verbose = [["Ширина шкафа", "Кол-во"]];
    verbose.push([getFineRange(item?.minWidth || 0, item?.maxWidth || 0), `${result}`]);
    return { data: { amount: result, charId }, verbose };
}

export async function getConfirmat(data: WardrobeData, details: Detail[]): Promise<FullData> {
    if (data.wardrobeTypeId === WARDROBE_TYPE.SYSTEM) return emptyFullDataIfSystem()
    const detailNames = (await getDetailsFromDB()).data
    const verbose: VerboseData = [["Деталь", "Кол-во", "Конфирматы \n на 1 деталь", "Итого"]];
    const charId = (await getAllCharOfSpec(SpecItem.Confirmat))[0] || 0
    let total = 0;
    details.forEach(d => {
        const conf = d.confirmat
        if (conf === 0) return
        const caption = detailNames.find(n => n.id === d.id)?.name || "";
        verbose.push([caption, `${d.count}`, `${conf}`, `${d.count * conf}`]);
        total += d.count * conf;
    });
    verbose.push(["", "", "Итого:", total]);
    return { data: { amount: total, charId }, verbose: total ? verbose : undefined };
}

async function getZagConfirmat(data: WardrobeData, details: Detail[], zaglushkaId: number): Promise<FullData> {
    if (data.wardrobeTypeId === WARDROBE_TYPE.SYSTEM) return emptyFullData()
    const conf = await getConfirmat(data, details);
    return { data: { amount: conf.data.amount, charId: zaglushkaId } };
}

export async function getMinifix(data: WardrobeData, details: Detail[]): Promise<FullData> {
    if (data.wardrobeTypeId === WARDROBE_TYPE.SYSTEM) return emptyFullDataIfSystem()
    const detailNames = (await getDetailsFromDB()).data
    const verbose: VerboseData = [["Деталь", "Кол-во", `Минификсы \n на 1 деталь`, "Итого"]];
    let total = 0;
    details.forEach(d => {
        const count = d.minifix
        if (count === 0) return
        const caption = detailNames.find(n => n.id === d.id)?.name || "";
        verbose.push([caption, `${d.count}`, `${count}`, `${d.count * count}`]);
        total += d.count * count;
    });
    verbose.push(["", "", "Итого:", total]);
    return { data: { amount: total, charId: 0 }, verbose };
}
async function getZagMinifix(data: WardrobeData, details: Detail[], zaglushkaId: number): Promise<FullData> {
    if (data.wardrobeTypeId === WARDROBE_TYPE.SYSTEM) return emptyFullData()
    const conf = await getMinifix(data, details);
    return { data: { amount: conf.data.amount, charId: zaglushkaId } };
}
export async function getNails(data: WardrobeData): Promise<FullData> {
    if (data.wardrobeTypeId === WARDROBE_TYPE.SYSTEM) return emptyFullDataIfSystem()
    const item = (await getFurniture(data.wardrobeId, SpecItem.Nails, data.width, data.height, data.depth))[0]
    const result = item?.count || 0
    const verbose: VerboseData = [["Ширина шкафа", "Кол-во"]];
    verbose.push([getFineRange(item?.minWidth || 0, item?.maxWidth || 0), `${result}`]);
    return { data: { amount: result, charId: 0 }, verbose };
}

export async function getSamorez16(data: WardrobeData): Promise<FullData> {
    if (data.wardrobeTypeId === WARDROBE_TYPE.SYSTEM) return emptyFullDataIfSystem()
    const { wardrobeId: wardKind, width, height, depth } = data;
    const item = (await getFurniture(wardKind, SpecItem.Samorez16, width, height, depth))[0];
    const current = item?.count || 0
    const verbose: VerboseData = [["Ширина шкафа", "Кол-во"]];
    verbose.push([getFineRange(item?.minWidth || 0, item?.maxWidth || 0), `${current}`]);
    return { data: { amount: current, charId: 0 }, verbose };
}

async function getStyagka(data: WardrobeData): Promise<FullData> {
    if (data.wardrobeTypeId === WARDROBE_TYPE.SYSTEM) return emptyFullDataIfSystem()
    const details = await getDetailsByWardrobe(data.wardrobeId, data.width, data.height)
    const roof = details.find(d => d.detailId === DETAIL_NAME.ROOF)
    const ward = roof?.count === 2 ? "Одинарный" : "Двойной"
    const count = roof?.count === 2 ? 0 : 3
    const verbose = [["Шкаф", "Стяжка М6"]];
    verbose.push([ward, `${count}шт`]);
    return { data: { amount: count, charId: 0 }, verbose };
}

export async function getKromkaPrimary(data: WardrobeData, details: Detail[], kromkaId: number): Promise<FullData> {
    if (data.wardrobeTypeId === WARDROBE_TYPE.SYSTEM) return emptyFullDataIfSystem()
    const detailNames = (await getDetailsFromDB()).data
    const verbose = [["Деталь", "Длина", "Ширина", "Кол-во", "Кромка", "Длина кромки, м", ""]];
    let total = 0;
    details.forEach(d => {
        const types = [KROMKA_TYPE.THICK]
        const edge = getKromkaLength(d, types) * d.count / 1000;
        if (edge === 0) return
        const caption = detailNames.find(n => n.id === d.id)?.name || "";
        const desc = getKromkaDescripton(d, types)
        verbose.push([caption, `${d.length}`, `${d.width}`, `${d.count}`, desc, edge.toFixed(3), ""]);
        total += edge;
    });
    const coef = await getCoef(SpecItem.Kromka2);
    verbose.push(["", "", "", "", "Итого", total.toFixed(3), `x ${coef} = ${(total * coef).toFixed(3)}`]);
    return { data: { amount: total * coef, charId: kromkaId }, verbose };
}

export async function getKromkaSecondary(data: WardrobeData, details: Detail[], kromkaSpecId: number, kromkaId: number): Promise<FullData> {
    if (data.wardrobeTypeId === WARDROBE_TYPE.SYSTEM) return emptyFullDataIfSystem()
    const detailNames = (await getDetailsFromDB()).data
    const verbose = [["Деталь", "Длина", "Ширина", "Кол-во", "Кромка", "Длина кромки, м", ""]];
    let total = 0;
    details.forEach(d => {
        const types = [KROMKA_TYPE.THIN]
        const edge = getKromkaLength(d, types) * d.count / 1000;
        if (edge === 0) return
        const caption = detailNames.find(n => n.id === d.id)?.name || "";
        const desc = getKromkaDescripton(d, types)
        verbose.push([caption, `${d.length}`, `${d.width}`, `${d.count}`, desc, edge.toFixed(3), ""]);
        total += edge;
    });
    const coef = await getCoef(kromkaSpecId);
    verbose.push(["", "", "", "", "Итого", total.toFixed(3), `x ${coef} = ${(total * coef).toFixed(3)}`]);
    return { data: { amount: total * coef, charId: kromkaId }, verbose };
}

export async function getGlue(data: WardrobeData, kromkaPrimary: number, kromkaSecondary: number, kromkaPrimaryCaption: string, kromkaSecondaryCaption: string): Promise<FullData> {
    if (data.wardrobeTypeId === WARDROBE_TYPE.SYSTEM) return emptyFullDataIfSystem()
    const coefGlue = await getCoef(SpecItem.Glue);
    const glue = (kromkaPrimary + kromkaSecondary) * coefGlue * 0.008;
    const verbose = [[kromkaPrimaryCaption, kromkaSecondaryCaption, "Итого", "Клей"]];
    verbose.push([kromkaPrimary.toFixed(3), kromkaSecondary.toFixed(3), (kromkaPrimary + kromkaSecondary).toFixed(3), `x 0.008 = ${glue.toFixed(3)}`]);
    return { data: { amount: glue, charId: 0 }, verbose };
}

async function getBrush(data: WardrobeData, brushSpecId:number): Promise<FullData> {
    const fasadCount = getFasadCount(data)
    if(!correctFasadCount(fasadCount)) return emptyFullDataIfNoFasades()
    const coef = await getCoef(brushSpecId);
    const verbose = [["Высота стойки", "Кол-во фасадов", ""]]
    const height = (data.height - 62)
    const result = height / 1000 * coef * fasadCount * 2
    verbose.push([`${data.height}-62=${height}`, `x ${fasadCount}`, `x 2 x ${coef}`, `=${result.toFixed(3)}м`])
    return { data: { amount: result, charId: 0 }, verbose }
}

async function getNaprav(data: WardrobeData, profileId: number, top: boolean): Promise<FullData> {
    if (data.wardrobeTypeId === WARDROBE_TYPE.GARDEROB) return emptyFullDataIfCorpus()
    const item = top ? SpecItem.NapravTop : SpecItem.NapravBottom
    const coef = await getCoef(item)
    const width = data.width - 32
    const result = (width / 1000) * coef
    const coefString = coef !== 1 ? `x ${coef} =  ${result.toFixed(3)}` : ""
    const verbose = [['Длина', '', '']]
    verbose.push([`(${data.width} - 32)`, `${(width / 1000).toFixed(3)}м`, coefString])
    return { data: { amount: result, charId: profileId }, verbose }
}

export async function getTruba(data: WardrobeData): Promise<FullData & { count: number }> {
    if (data.wardrobeTypeId === WARDROBE_TYPE.SYSTEM) return { ...emptyFullDataIfSystem(), count: 0 }
    const coef = await getCoef(SpecItem.Truba)
    const items = await getFurniture(data.wardrobeId, SpecItem.Truba, data.width, data.height, data.depth );
    const verbose: VerboseData = [["Ширина шкафа", "Глубина шкафа", "Кол-во", "Длина", "Итого"]];
    let result = 0
    let totalCount=0
    for(let item of items){
        const count = item.count
        totalCount += count
        const size = calcFunction(item.size, { width: data.width, depth: data.depth, height: data.height, offset: 0 })
        result += size * count / 1000 * coef
        const coefString = coef !== 1 ? ` x ${coef} =  ${result.toFixed(3)}` : ""
        if (count > 0) verbose.push([getFineRange(item?.minWidth || 0, item?.maxWidth || 0), getFineRange(item?.minDepth || 0, item?.maxDepth || 0), `${count}`, `${size}`, `${(size * count / 1000).toFixed(3) + coefString}`]);
        else verbose.push(["", `${data.depth}`, `нет`, ``, ``]);
    }
    return { data: { amount: result, charId: 0 }, verbose, count: totalCount };
}
async function  getFlanec(truba: FullData & { count: number }): Promise<FullData> {
    const count = truba.count
    const verbose: VerboseData = [["Труба", "Фланец"]];
    if (count > 0) verbose.push([`${count}шт`, `${count * 2}шт`]);else verbose.push([`нет`, `нет`])
    return { data: { amount: count * 2, charId: 0 }, verbose }
}

export async function getTrempel(data: WardrobeData): Promise<FullData> {
    if (data.wardrobeTypeId === WARDROBE_TYPE.SYSTEM) return emptyFullDataIfSystem()
    const items = await getFurniture(data.wardrobeId, SpecItem.Trempel, data.width, data.height, data.depth );
    const { charId, minDepth, maxDepth } = items[0] || {charId: 0, maxDepth: 0, minDepth: 0}
    const verbose: VerboseData = [["Ширина шкафа", "Глубина шкафа", "Тремпель", "Кол-во"]];
    let count = 0
    for (let item of items) {
        count += item?.count || 0
        const charName = (await getChar(charId))?.name || ""
        if (count > 0) verbose.push([getFineRange(item?.minWidth || 0, item?.maxWidth || 0), getFineRange(minDepth, maxDepth), charName, `${count}`]);
        else verbose.push(["", `${data.depth}`, "", "нет"]);
    }
    return { data: { amount: count, charId }, verbose };
}


export async function getPantograf(data: WardrobeData): Promise<FullData> {
    if (data.wardrobeTypeId === WARDROBE_TYPE.SYSTEM) return emptyFullDataIfSystem()
    const items = await getFurniture(data.wardrobeId, SpecItem.Pantograf, data.width, data.height, data.depth);
    const verbose: VerboseData = [["Ширина секции", "Пантограф", "Кол-во"]];
    let count = 0
    let charId = 0
    for (let item of items) {
        const size = calcFunction(item.size, { width: data.width, height: data.height, depth: data.depth, offset: 0 })
        charId = item.charId || 0
        count += item?.count || 0
        const charName = (await getChar(charId))?.name || ""
        verbose.push([`${size}`, charName, count]);
    }
    return { data: { amount: count, charId }, verbose };
}

async function getStopor(data: WardrobeData): Promise<FullData> {
    const fasadCount = getFasadCount(data)
    const verbose: VerboseData = [["", ""]];
    verbose.push(["Кол-во фасадов", `${fasadCount}`]);
    return { data: { amount: fasadCount, charId: 0 }, verbose };
}
async function getKluch(data: WardrobeData): Promise<FullData> {
    if (data.wardrobeTypeId === WARDROBE_TYPE.SYSTEM) return emptyFullDataIfSystem()
    return { data: { amount: 1, charId: 0 } };
}
async function getBox(data: WardrobeData): Promise<FullData> {
    if (data.wardrobeTypeId === WARDROBE_TYPE.SYSTEM) return emptyFullDataIfSystem()
    return { data: { amount: 1, charId: 0 } };
}

