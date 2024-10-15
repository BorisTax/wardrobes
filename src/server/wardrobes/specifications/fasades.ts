import Fasad from "../../../classes/Fasad";
import { getFasadHeight, getFasadWidth } from "../../../functions/wardrobe";
import { Division, FASAD_TYPE, LACOBEL_TYPE } from "../../../types/enums";
import { ProfileType } from "../../../types/enums";
import { FullData, SpecificationResult, VerboseData, WARDROBE_TYPE } from "../../../types/wardrobe";
import { SpecItem } from "../../../types/specification";
import { WardrobeData } from "../../../types/wardrobe";
import { getArmirovkaTapes, getCoef } from "./functions";
import { emptyFullData, flattenSpecification } from "./functions";
import { getSpecificationPattern } from "./functions";
import { getFasadCount, correctFasadCount } from "./functions";
import { getAllCharOfSpec } from "../../routers/functions/spec";
import { getLacobels } from "../../routers/functions/materials";
import { LacobelSchema, ProfileSchema } from "../../../types/schemas";

export function createFasades(data: WardrobeData, profileType: ProfileType): Fasad[]{
    const fasades: Fasad[] = []
    const count = getFasadCount(data)
    if (!correctFasadCount(count)) return fasades
    if (data.wardTypeId === WARDROBE_TYPE.GARDEROB) return fasades
    const width = getFasadWidth(data.width, count, data.wardTypeId, profileType)
    const height = getFasadHeight(data.height, data.wardTypeId, profileType)
    data.fasades.dsp.matId.forEach(id => {
        const fasad = new Fasad({ width, height, fasadType: FASAD_TYPE.DSP, materialId: id })
        fasades.push(fasad)
    })
    data.fasades.mirror.matId.forEach(id => {
        const fasad = new Fasad({ width, height, fasadType: FASAD_TYPE.MIRROR, materialId: id })
        fasades.push(fasad)
    })
    data.fasades.fmp.matId.forEach(id => {
        const fasad = new Fasad({ width, height, fasadType: FASAD_TYPE.FMP, materialId: id })
        fasades.push(fasad)
    })
    data.fasades.sand.matId.forEach(id => {
        const fasad = new Fasad({ width, height, fasadType: FASAD_TYPE.SAND, materialId: id })
        fasades.push(fasad)
    })
    data.fasades.lacobel.matId.forEach(id => {
        const fasad = new Fasad({ width, height, fasadType: FASAD_TYPE.LACOBEL, materialId: id })
        fasades.push(fasad)
    })
    return fasades
}

export async function getFasadSpecification(fasad: Fasad, profile: ProfileSchema, verbose = false): Promise<SpecificationResult[]> {
    const spec = await calcSpecification(fasad, profile);
    const result = flattenSpecification(spec);
    if (!verbose) {
        result.forEach(r => {
            r[1].verbose = undefined
        })
    }
    return result
}

async function calcSpecification(fasad: Fasad, profile: ProfileSchema): Promise<Map<SpecItem, FullData[]>> {
    const spec = getSpecificationPattern();
    const lacobels = await (await getLacobels()).data || []
    spec.set(SpecItem.DSP10, await calcDSP10(fasad))
    spec.set(SpecItem.Mirror, await calcMirror(fasad));
    spec.set(SpecItem.Arakal, await calcArakal(fasad));
    spec.set(SpecItem.Hydro, await calcHydro(fasad));
    spec.set(SpecItem.Lacobel, await calcLacobel(fasad, lacobels))
    spec.set(SpecItem.Ritrama, await calcRitrama(fasad, lacobels));
    spec.set(SpecItem.Armirovka, await calcArmirovka(fasad, lacobels));
    spec.set(SpecItem.FMPPaper, await calcFMPPaper(fasad));
    spec.set(SpecItem.FMPGlass, await calcFMPGlass(fasad));
    spec.set(SpecItem.Paint, await calcPaint(fasad));
    spec.set(SpecItem.EVA, await calcEva(fasad)); 
    spec.set(SpecItem.Uplot, await calcUplotnitel(fasad, profile.type));
    spec.set(SpecItem.UplotSoedBavaria, await calcUplotnitelSoed(fasad, profile.type));
    spec.set(SpecItem.ProfileSoed, await calcProfileSoed(fasad, profile.charId))
    spec.set(SpecItem.ProfileVert, await calcProfileVert(fasad, profile.charId))
    spec.set(SpecItem.ProfileHorTop, await calcProfileHor(fasad, profile.charId, true))
    spec.set(SpecItem.ProfileHorBottom, await calcProfileHor(fasad, profile.charId, false))
    spec.set(SpecItem.Streich, await calcStreich(fasad))
    spec.set(SpecItem.Roliki, await calcRoliki(fasad, profile))
    spec.set(SpecItem.RolikiBavaria, await calcRolikiBavaria(fasad, profile))
    return spec;
}
async function calcArea(fasad: Fasad, checkFasad: (f: Fasad) => boolean): Promise<FullData[]> {
    const result: FullData[] = []
    if (fasad.Children.length === 0) {
        if (!checkFasad(fasad)) return result
        const area = fasad.cutWidth * fasad.cutHeight / 1000000;
        result.push({ data: { amount: area, charId: fasad.MaterialId }, verbose: [[`${fasad.cutHeight}`, `${fasad.cutWidth}`, area.toFixed(3), ""]] });
        if (fasad.Parent !== null) return result
    }
    for (let c of fasad.Children) {
        const res = await calcArea(c, checkFasad)
        res.forEach(r => {
            const prev = result.find(p => p.data.charId === r.data.charId)
            if (!prev) result.push(r);
            else {
                prev.data.amount += r.data.amount
                prev.verbose = [...prev.verbose as VerboseData, ...r.verbose as VerboseData]
            }
        })
    }
    return result
}

function calcDimensions(fasad: Fasad, checkFasad: (f: Fasad) => boolean): { height: number, width: number }[] {
        const result: { height: number, width: number }[] = []
        if (fasad.Children.length === 0) {
            if (!checkFasad(fasad)) return result
            result.push({ width: fasad.cutWidth, height: fasad.cutHeight });
            if (fasad.Parent !== null) return result
        }
        for (let c of fasad.Children) {
            const res = calcDimensions(c, checkFasad)
            res.forEach(r => {
                result.push(r);
            })
        }
        return result
}

async function calcDSP10(fasad: Fasad): Promise<FullData[]> {
    const result = await calcArea(fasad, f=>f.FasadType===FASAD_TYPE.DSP)
    const coef = await getCoef(SpecItem.DSP10)
    const finalResult = result.map(r => {
        const area = r.data.amount
        r.data.amount = area * coef
        const verbose = [["Высота фасада", "Ширина фасада", "Площадь", ""], ...r.verbose as VerboseData, ["", "Итого", `${area.toFixed(3)}`, (coef !== 1) ? `x ${coef} = ${(area * coef).toFixed(3)}` : ""]]
        return { ...r, verbose: area > 0 ? verbose : undefined  }
    })
    return finalResult
}
async function calcMirror(fasad: Fasad): Promise<FullData[]> {
    const result = await calcArea(fasad, f => [FASAD_TYPE.MIRROR, FASAD_TYPE.SAND].includes(f.FasadType))
    const coef = await getCoef(SpecItem.Mirror)
    const finalResult = result.map(r => {
        const area = r.data.amount
        r.data.amount = area * coef
        const verbose = [["Высота фасада", "Ширина фасада", "Площадь", ""], ...r.verbose as VerboseData, ["", "Итого", `${area.toFixed(3)}`, (coef !== 1) ? `x ${coef} = ${(area * coef).toFixed(3)}` : ""]]
        return { ...r, verbose: area > 0 ? verbose : undefined }
    })
    return finalResult
}
async function calcArakal(fasad: Fasad): Promise<FullData[]> {
    const result = await calcArea(fasad, f => f.FasadType === FASAD_TYPE.SAND)
    const coef = await getCoef(SpecItem.Arakal)
    const finalResult = result.map(r => {
        const area = r.data.amount
        r.data.amount = area * coef
        const verbose = [["Высота фасада", "Ширина фасада", "Площадь", ""], ...r.verbose as VerboseData, ["", "Итого", `${area.toFixed(3)}`, (coef !== 1) ? `x ${coef} = ${(area * coef).toFixed(3)}` : ""]]
        return { ...r, verbose: area > 0 ? verbose : undefined }
    })
    return finalResult
}
async function calcHydro(fasad: Fasad): Promise<FullData[]> {
    const result = await calcArea(fasad, f => f.FasadType === FASAD_TYPE.SAND)
    const coef = await getCoef(SpecItem.Hydro)
    const mult = 0.035
    if (result.length > 0) {
        const total = result[0].data.amount * 0.035 * coef
        const data = `x ${mult} ${coef !== 1 ? "x " + coef : ""} = ${total.toFixed(3)}`
        result[0].verbose?.push(["", "", "", data])
        if (total <= 0) result[0].verbose = undefined
        result[0].data.amount = total
    }
    return result
}
async function calcLacobel(fasad: Fasad, lacobel: LacobelSchema[]): Promise<FullData[]> {
    const result = await calcArea(fasad, f => !!lacobel.find(l => l.id === f.MaterialId && l.lacobelTypeId === LACOBEL_TYPE.LACOBELGLASS))
    const coef = await getCoef(SpecItem.Lacobel)
    const finalResult = result.map(r => {
        const area = r.data.amount
        r.data.amount = area * coef
        const verbose = [["Высота фасада", "Ширина фасада", "Площадь", ""], ...r.verbose as VerboseData, ["", "Итого", `${area.toFixed(3)}`, (coef !== 1) ? `x ${coef} = ${(area * coef).toFixed(3)}` : ""]]
        return { ...r, verbose: area > 0 ? verbose : undefined }
    })
    return finalResult
}

async function calcRitrama(fasad: Fasad, lacobel: LacobelSchema[]): Promise<FullData[]> {
    const dims = await calcDimensions(fasad, f => !!lacobel.find(l => l.id === f.MaterialId && l.lacobelTypeId === LACOBEL_TYPE.LACOBEL))
    const verbose: VerboseData = [["Высота фасада", "Ширина фасада", "Ритрама", "Площадь"]]
    let total = 0
    for (let d of dims) {
        let ritrama = ((d.height + 100) * 1200 / 1000000)
        total += ritrama
        verbose.push([d.height, d.width, `(${d.height}+100)x1200`, ritrama.toFixed(3)])
    }
    verbose.push(["", "", `Итого:`, total.toFixed(3)])
    return [{ data: { amount: total, charId: 0 }, verbose: total > 0 ? verbose : undefined }]
}

async function calcArmirovka(fasad: Fasad, lacobel: LacobelSchema[], tolerance = 5): Promise<FullData[]> {
    const dims = await calcDimensions(fasad, f => [FASAD_TYPE.FMP, FASAD_TYPE.MIRROR, FASAD_TYPE.SAND].includes(f.FasadType) || !!lacobel.find(l => l.id === f.MaterialId && l.lacobelTypeId === LACOBEL_TYPE.LACOBELGLASS))
    const verbose: VerboseData = [["Высота фасада", "Ширина фасада", "Полоса 400мм", "Полоса 200мм", "", "Площадь"]]
    let total = 0
    for (let d of dims) {
        const { tape200, tape400 } = getArmirovkaTapes(d.width, tolerance)
        let area = (d.height + 100) * (tape400 * 400 + tape200 * 200) / 1000000;
        total += area
        verbose.push([d.height, d.width, `${tape400}шт`, `${tape200}шт`, `(${d.height}+100) x (400x${tape400}+200x${tape200})`, area.toFixed(3)])
    }
    verbose.push(["", "", "", "", `Итого:`, total.toFixed(3)])
    return [{ data: { amount: total, charId: 0 }, verbose: total > 0 ? verbose : undefined }]
}

async function calcFMPPaper(fasad: Fasad, widthLimit = 700): Promise<FullData[]> {
    const dims = await calcDimensions(fasad, f => f.FasadType === FASAD_TYPE.FMP)
    const coef = await getCoef(SpecItem.FMPPaper)
    const verbose: VerboseData = [["Высота фасада", "Ширина фасада", "Ширина полосы", "", "Площадь"]]
    let total = 0
    const sizes = [610, 914, 1067];
    for (let d of dims) {
        const offset = d.width < widthLimit ? 40 : 50;
        const size = sizes.find(s => d.width + offset < s) || sizes[2];
        let area = (d.height + 100) * size / 1000000;
        total += area
        verbose.push([d.height, d.width, size, `(${d.height}+100) x ${size}`, area.toFixed(3)])
    }
    const result = total * coef
    const coefString = coef !== 1 ? `x ${coef} =  ${result.toFixed}` : ""
    verbose.push(["", "", "", `Итого:`, total.toFixed(3), coefString])
    return [{ data: { amount: total, charId: 0 }, verbose: total > 0 ? verbose : undefined }]
}

async function calcFMPGlass(fasad: Fasad): Promise<FullData[]> {
    const dims = await calcDimensions(fasad, f => [FASAD_TYPE.FMP, FASAD_TYPE.LACOBEL].includes(f.FasadType))
    const verbose: VerboseData = [["Высота фасада", "Ширина фасада", "Площадь",""]]
    let total = 0
    const coef = await getCoef(SpecItem.FMPGlass)
    for (let d of dims) {
        let area = (d.height * d.width) / 1000000;
        total += area
        verbose.push([d.height, d.width, area.toFixed(3)])
    }
    const result = total * coef
    const coefString = coef !== 1 ? `x ${coef} =  ${result.toFixed(3)}` : ""
    verbose.push(["", `Итого:`, total.toFixed(3), coefString])
    return [{ data: { amount: result, charId: 0 }, verbose: result > 0 ? verbose : undefined }]
}

async function calcPaint(fasad: Fasad): Promise<FullData[]> {
    const dims = await calcDimensions(fasad, f => f.FasadType === FASAD_TYPE.FMP)
    const coef = await getCoef(SpecItem.Paint)
    const verbose: VerboseData = [["Высота фасада", "Ширина фасада", "Площадь",""]]
    let total = 0
    const mult = 13.8
    for (let d of dims) {
        let area = (d.height * d.width) / 1000000;
        total += area
        verbose.push([d.height, d.width, area.toFixed(3)])
    }
    const coefString = coef!==1?`x ${coef}`:""
    const result =  total * coef * mult * 0.001
    verbose.push(["", `Итого:`, total.toFixed(3), `x 13.8 x 0.001 ${coefString} = ${(result.toFixed(3))}`])
    return [{ data: { amount: result, charId: 0 }, verbose: result > 0 ? verbose : undefined }]
}
async function calcEva(fasad: Fasad): Promise<FullData[]>  {
    const dims = await calcDimensions(fasad, f => f.FasadType === FASAD_TYPE.FMP)
    const coef = await getCoef(SpecItem.EVA)
    const verbose: VerboseData = [["Высота фасада", "Ширина фасада", "Площадь",""]]
    let total = 0
    for (let d of dims) {
        let area = (d.height * d.width) / 1000000;
        total += area
        verbose.push([d.height, d.width, area.toFixed(3)])
    }
    const result = total * coef
    const coefString = coef !== 1 ? `x ${coef} =  ${result.toFixed(3)}` : ""
    verbose.push(["", `Итого:`, total.toFixed(3), coefString])
    return [{ data: { amount: result, charId: 0 }, verbose: result > 0 ? verbose : undefined }]
}

type EdgesData = { width: number, height: number, edges: {side: EdgeSides, length: number}[] }

enum EdgeSides {
    TOP = "top",
    BOTTOM = "bottom",
    RIGHT = "right",
    LEFT = "left",
}
const EdgeSideCaptions = {
    [EdgeSides.TOP]: "сверху",
    [EdgeSides.BOTTOM]: "снизу",
    [EdgeSides.RIGHT]: "справа",
    [EdgeSides.LEFT]: "слева",
}

async function calcEdges(fasad: Fasad): Promise<{ outer: EdgesData[], inner: EdgesData[], full: EdgesData[] }> {
    const result: { outer: EdgesData[], inner: EdgesData[], full: EdgesData[] } = { outer: [], inner: [], full: [] }
    if (fasad.Children.length === 0) {
        if (fasad.FasadType === FASAD_TYPE.DSP) return result
        const { top, bottom, left, right } = fasad.OuterEdges;
        const outer: EdgesData = { width: fasad.Width, height: fasad.Height, edges: [] }
        const inner: EdgesData = { width: fasad.Width, height: fasad.Height, edges: [] }
        const full: EdgesData = { width: fasad.Width, height: fasad.Height, edges: [] }
        if (left) outer.edges.push({ side: EdgeSides.LEFT, length: fasad.Height }); else inner.edges.push({ side: EdgeSides.LEFT, length: fasad.Height })
        if (right) outer.edges.push({ side: EdgeSides.RIGHT, length: fasad.Height }); else inner.edges.push({ side: EdgeSides.RIGHT, length: fasad.Height })
        if (top) outer.edges.push({ side: EdgeSides.TOP, length: fasad.Width }); else inner.edges.push({ side: EdgeSides.TOP, length: fasad.Width })
        if (bottom) outer.edges.push({ side: EdgeSides.BOTTOM, length: fasad.Width }); else inner.edges.push({ side: EdgeSides.BOTTOM, length: fasad.Width })
        full.edges.push({ side: EdgeSides.LEFT, length: fasad.Height })
        full.edges.push({ side: EdgeSides.RIGHT, length: fasad.Height })
        full.edges.push({ side: EdgeSides.TOP, length: fasad.Width })
        full.edges.push({ side: EdgeSides.BOTTOM, length: fasad.Width })
        result.outer.push(outer)
        result.inner.push(inner)
        result.full.push(full)
    }
    for (let c of fasad.Children) {
        const res = await calcEdges(c)
        res.outer.forEach(r => {
            result.outer.push(r);
        })
        res.inner.forEach(r => {
            result.inner.push(r);
        })
        res.full.forEach(r => {
            result.full.push(r);
        })
    }
    return result
}

async function calcUplotnitel(fasad: Fasad, profileType: ProfileType): Promise<FullData[]> {
    const charId = (await getAllCharOfSpec(SpecItem.Uplot))[0]
    const edges = (profileType === ProfileType.STANDART) ? (await calcEdges(fasad)).full : (await calcEdges(fasad)).outer
    const verbose = [["Высота фасада", "Ширина фасада", "Уплотнитель", "Длина,м", ""]]
    let sum = 0
    edges.forEach(e => {
        if (e.edges.length > 0) {
            const s = (e.edges.reduce((a, i) => a + i.length, 0)) / 1000
            sum += s
            const sides = e.edges.map(i => EdgeSideCaptions[i.side]).join(", ")
            verbose.push([`${e.height}`, `${e.width}`, `${sides} (${e.edges.map(i => i.length).join("+")})`, `${s.toFixed(3)}`])
        }
    })
    const coef = await getCoef(SpecItem.Uplot)
    const result = sum * coef
    const coefString = coef !== 1 ? `x ${coef} =  ${result.toFixed(3)}` : ""
    verbose.push(["", "", "", `${sum.toFixed(3)}`, coefString])
    return [{ data: { amount: result, charId }, verbose: result > 0 ? verbose : undefined }]
}

async function calcUplotnitelSoed(fasad: Fasad, profileType: ProfileType): Promise<FullData[]> {
    if (profileType === ProfileType.STANDART) return [emptyFullData()]
    const edges = (await calcEdges(fasad)).inner
    const verbose = [["Высота фасада", "Ширина фасада", "Уплотнитель", "Длина,м", ""]]
    let sum = 0
    edges.forEach(e => {
        if (e.edges.length > 0) {
            const s = (e.edges.reduce((a, i) => a + i.length, 0)) / 1000
            sum += s
            const sides = e.edges.map(i => EdgeSideCaptions[i.side]).join(", ")
            verbose.push([`${e.height}`, `${e.width}`, `${sides} (${e.edges.map(i => i.length).join("+")})`, `${s.toFixed(3)}`])
        }
    })
    const coef = await getCoef(SpecItem.UplotSoedBavaria)
    const result = sum * coef
    const coefString = coef !== 1 ? `x ${coef} =  ${result.toFixed(3)}` : ""
    verbose.push(["", "", "", `${sum.toFixed(3)}`, coefString])
    return [{ data: { amount: result, charId: 0 }, verbose: result > 0 ? verbose : undefined }]
}

async function calcProfileSoed(fasad: Fasad, profileCharId: number): Promise<FullData[]> {
    function getProfiles(fasad: Fasad): number[] {
        let result: number[] = []
        if (fasad.Children.length === 0) return result;
        result = new Array(fasad.Children.length - 1).fill(fasad.Division === Division.HEIGHT ? fasad.Width : fasad.Height);
        fasad.Children.forEach((f: Fasad) => result = [...result, ...getProfiles(f)])
        return result;
    }
    const coef = await getCoef(SpecItem.ProfileSoed)
    const prof = getProfiles(fasad)
    const sum = prof.reduce((a, i) => a + i, 0) / 1000
    const result = sum * coef
    const coefString = coef !== 1 ? `x ${coef} =  ${result.toFixed(3)}` : ""
    const verbose = [["Профили", "Итого", ""]]
    verbose.push([prof.join("+"), `${sum.toFixed(3)}`, coefString])
    return [{ data: { amount: result, charId: profileCharId }, verbose: result > 0 ? verbose : undefined }]
}
async function calcProfileHor(fasad: Fasad, profileCharId: number, top: boolean): Promise<FullData[]> {
    const prof = top ? SpecItem.ProfileHorTop : SpecItem.ProfileHorBottom
    const coef = await getCoef(prof)
    const width = fasad.Width - 13
    const result = (width / 1000) * coef
    const coefString = coef !== 1 ? `x ${coef} =  ${result.toFixed(3)}` : ""
    const verbose = [['Длина', '', '']]
    verbose.push([`(${fasad.Width} - 13) = ${width}`, `${(width / 1000).toFixed(3)}м`, coefString])
    return [{ data: { amount: result, charId: profileCharId }, verbose: result > 0 ? verbose : undefined }]
}

async function calcProfileVert(fasad: Fasad, profileCharId: number): Promise<FullData[]> {
    const count = (fasad.Height > 2300) ? 2 : 1
    const verbose = [['Высота фасада', '', '']]
    verbose.push([`${fasad.Height}`, `${count === 1 ? "меньше-равно" : "больше"} 2300 - ${count}шт`])
    return [{ data: { amount: count, charId: profileCharId }, verbose: count > 0 ? verbose : undefined }]
}
async function calcStreich(fasad: Fasad): Promise<FullData[]>  {
    return [{ data: { amount: 12, charId: 0 } }]
}
async function calcKarton(fasad: Fasad): Promise<FullData[]>  {
    return [{ data: { amount: 0.25, charId: 0 } }]
}
async function calcRoliki(fasad: Fasad, profile: ProfileSchema): Promise<FullData[]>  {
    if (profile.type === ProfileType.BAVARIA) return [emptyFullData()]
    return [{ data: { amount: 1, charId: 0 } }]
}
async function calcRolikiBavaria(fasad: Fasad, profile: ProfileSchema): Promise<FullData[]>  {
    if (profile.type === ProfileType.STANDART) return [emptyFullData()]
    return [{ data: { amount: 1, charId: 0 } }]
}


