import Fasad from "../../../classes/Fasad";
import { getFasadHeight, getFasadWidth } from "../../../functions/wardrobe";
import { Division, FASAD_TYPE } from "../../../types/enums";
import { FasadMaterial, Profile, ProfileType } from "../../../types/materials";
import { FullData, SpecificationResult, VerboseData, WARDROBE_TYPE } from "../../../types/wardrobe";
import { SpecificationItem } from "../../../types/specification";
import { WardrobeData } from "../../../types/wardrobe";
import { materialServiceProvider, materialsPath } from "../../options";
import { MaterialService } from "../../services/materialService";
import { getCoef } from "./functions";
import { MaterialExtService } from "../../services/materialExtService";
import UplotnitelServiceSQLite from "../../services/extServices/uplotnitelServiceSQLite";
import { emptyFullData, flattenSpecification } from "./functions";
import { getSpecificationPattern } from "./functions";
import { getFasadCount, correctFasadCount } from "./functions";

export function createFasades(data: WardrobeData, profileType: ProfileType): Fasad[]{
    const fasades: Fasad[] = []
    const count = getFasadCount(data)
    if (!correctFasadCount(count)) return fasades
    if (data.wardType === WARDROBE_TYPE.GARDEROB) return fasades
    const width = getFasadWidth(data.width, count, data.wardType, profileType)
    const height = getFasadHeight(data.height, data.wardType, profileType)
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
    data.fasades.lacobelGlass.matId.forEach(id => {
        const fasad = new Fasad({ width, height, fasadType: FASAD_TYPE.LACOBELGLASS, materialId: id })
        fasades.push(fasad)
    })
    return fasades
}

export async function getFasadSpecification(fasad: Fasad, profile: Profile, verbose = false): Promise<SpecificationResult[]> {
    const spec = await calcSpecification(fasad, profile);
    const result = flattenSpecification(spec);
    if (!verbose) {
        result.forEach(r => {
            r[1].verbose = undefined
        })
    }
    return result
}

async function calcSpecification(fasad: Fasad, profile: Profile): Promise<Map<SpecificationItem, FullData[]>> {
    const spec = getSpecificationPattern();
    const matService = new MaterialService(materialServiceProvider)
    const materials = (await matService.getExtMaterials({})).data as FasadMaterial[]
    spec.set(SpecificationItem.DSP10, await calcDSP10(fasad, materials))
    spec.set(SpecificationItem.Mirror, await calcMirror(fasad, materials));
    spec.set(SpecificationItem.Arakal, await calcArakal(fasad, materials));
    spec.set(SpecificationItem.Hydro, await calcHydro(fasad, materials));
    spec.set(SpecificationItem.Lacobel, await calcLacobel(fasad, materials))
    spec.set(SpecificationItem.Ritrama, await calcRitrama(fasad));
    spec.set(SpecificationItem.Armirovka, await calcArmirovka(fasad));
    spec.set(SpecificationItem.FMPPaper, await calcFMPPaper(fasad));
    spec.set(SpecificationItem.FMPGlass, await calcFMPGlass(fasad));
    spec.set(SpecificationItem.Paint, await calcPaint(fasad));
    spec.set(SpecificationItem.EVA, await calcEva(fasad)); 
    spec.set(SpecificationItem.Uplot, await calcUplotnitel(fasad, profile.type));
    spec.set(SpecificationItem.UplotSoedBavaria, await calcUplotnitelSoed(fasad, profile.type));
    spec.set(SpecificationItem.ProfileSoedStandart, await calcProfileSoed(fasad, profile))
    spec.set(SpecificationItem.ProfileVertStandart, await calcProfileVert(fasad, profile))
    spec.set(SpecificationItem.ProfileHorTopStandart, await calcProfileHor(fasad, profile, true))
    spec.set(SpecificationItem.ProfileHorBottomStandart, await calcProfileHor(fasad, profile, false))
    spec.set(SpecificationItem.Streich, await calcStreich(fasad))
    spec.set(SpecificationItem.Roliki, await calcRoliki(fasad, profile))
    spec.set(SpecificationItem.RolikiBavaria, await calcRolikiBavaria(fasad, profile))
    return spec;
}
async function calcArea(fasad: Fasad, materials: FasadMaterial[], material: FASAD_TYPE[], useChar: boolean = true): Promise<FullData[]> {
    const result: FullData[] = []
    if (fasad.Children.length === 0) {
        if (!material.includes(fasad.FasadType)) return result
        const mat = materials.find(m => material.includes(m.type as FASAD_TYPE) && m.id === fasad.MaterialId) || { code: "", name: "" }
        const code = mat.code
        const caption = useChar ? mat.name : ""
        const area = fasad.cutWidth * fasad.cutHeight / 1000000;
        result.push({ data: { amount: area, char: { code, caption } }, verbose: [[`${fasad.cutHeight}`, `${fasad.cutWidth}`, area.toFixed(3), ""]] });
        if (fasad.Parent !== null) return result
    }
    for (let c of fasad.Children) {
        const res = await calcArea(c, materials, material, useChar)
        res.forEach(r => {
            const prev = result.find(p => p.data.char?.caption === r.data.char?.caption)
            if (!prev) result.push(r);
            else {
                prev.data.amount += r.data.amount
                prev.verbose = [...prev.verbose as VerboseData, ...r.verbose as VerboseData]
            }
        })
    }
    return result
}
async function calcDimensions(fasad: Fasad, material: FASAD_TYPE[]): Promise<{height: number, width: number}[]> {
    const result: {height: number, width: number}[] = []
    if (fasad.Children.length === 0) {
        if (!material.includes(fasad.FasadType)) return result
        result.push({ width: fasad.cutWidth, height: fasad.cutHeight});
        if (fasad.Parent !== null) return result
    }
    for (let c of fasad.Children) {
        const res = await calcDimensions(c, material)
        res.forEach(r => {
            result.push(r);
        })
    }
    return result
}

async function calcDSP10(fasad: Fasad, materials: FasadMaterial[]): Promise<FullData[]> {
    const result = await calcArea(fasad, materials, [FASAD_TYPE.DSP])
    const coef = await getCoef(SpecificationItem.DSP10)
    const finalResult = result.map(r => {
        const area = r.data.amount
        r.data.amount = area * coef
        const verbose = [["Высота фасада", "Ширина фасада", "Площадь", ""], ...r.verbose as VerboseData, ["", "Итого", `${area.toFixed(3)}`, (coef !== 1) ? `x ${coef} = ${(area * coef).toFixed(3)}` : ""]]
        return { ...r, verbose: area > 0 ? verbose : undefined  }
    })
    return finalResult
}
async function calcMirror(fasad: Fasad, materials: FasadMaterial[]): Promise<FullData[]> {
    const result = await calcArea(fasad, materials, [FASAD_TYPE.MIRROR, FASAD_TYPE.SAND])
    const coef = await getCoef(SpecificationItem.Mirror)
    const finalResult = result.map(r => {
        const area = r.data.amount
        r.data.amount = area * coef
        const verbose = [["Высота фасада", "Ширина фасада", "Площадь", ""], ...r.verbose as VerboseData, ["", "Итого", `${area.toFixed(3)}`, (coef !== 1) ? `x ${coef} = ${(area * coef).toFixed(3)}` : ""]]
        return { ...r, verbose: area > 0 ? verbose : undefined }
    })
    return finalResult
}
async function calcArakal(fasad: Fasad, materials: FasadMaterial[]): Promise<FullData[]> {
    const result = await calcArea(fasad, materials, [FASAD_TYPE.SAND], false)
    const coef = await getCoef(SpecificationItem.Arakal)
    const finalResult = result.map(r => {
        const area = r.data.amount
        r.data.amount = area * coef
        const verbose = [["Высота фасада", "Ширина фасада", "Площадь", ""], ...r.verbose as VerboseData, ["", "Итого", `${area.toFixed(3)}`, (coef !== 1) ? `x ${coef} = ${(area * coef).toFixed(3)}` : ""]]
        return { ...r, verbose: area > 0 ? verbose : undefined }
    })
    return finalResult
}
async function calcHydro(fasad: Fasad, materials: FasadMaterial[]): Promise<FullData[]> {
    const result = await calcArea(fasad, materials, [FASAD_TYPE.SAND], false)
    const coef = await getCoef(SpecificationItem.Hydro)
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
async function calcLacobel(fasad: Fasad, materials: FasadMaterial[]): Promise<FullData[]> {
    const result = await calcArea(fasad, materials, [FASAD_TYPE.LACOBELGLASS])
    const coef = await getCoef(SpecificationItem.Lacobel)
    const finalResult = result.map(r => {
        const area = r.data.amount
        r.data.amount = area * coef
        const verbose = [["Высота фасада", "Ширина фасада", "Площадь", ""], ...r.verbose as VerboseData, ["", "Итого", `${area.toFixed(3)}`, (coef !== 1) ? `x ${coef} = ${(area * coef).toFixed(3)}` : ""]]
        return { ...r, verbose: area > 0 ? verbose : undefined }
    })
    return finalResult
}

async function calcRitrama(fasad: Fasad): Promise<FullData[]> {
    const dims = await calcDimensions(fasad, [FASAD_TYPE.LACOBEL])
    const verbose: VerboseData = [["Высота фасада", "Ширина фасада", "Ритрама", "Площадь"]]
    let total = 0
    for (let d of dims) {
        let ritrama = ((d.height + 100) * 1200 / 1000000)
        total += ritrama
        verbose.push([d.height, d.width, `(${d.height}+100)x1200`, ritrama.toFixed(3)])
    }
    verbose.push(["", "", `Итого:`, total.toFixed(3)])
    return [{ data: { amount: total }, verbose: total > 0 ? verbose : undefined }]
}

async function calcArmirovka(fasad: Fasad, tolerance = 5): Promise<FullData[]> {
    function getTapes(width: number, tolerance: number): { tape400: number, tape200: number } {
        let tape400 = 0
        let tape200 = 0
        let min = width * 2
        let sum = 100
        for (let t400 = 0; t400 * 400 <= width + 400; t400++) {
            for (let t200 = 0; t200 * 200 <= width + 200; t200++) {
                let m = t400 * 400 + t200 * 200 - width + tolerance
                if (m >= 0 && m <= min) {
                    if (Math.abs(m - min) < 0.001) {
                        if (t400 + t200 > sum) continue
                    }
                    min = m
                    tape400 = t400
                    tape200 = t200
                    sum = tape400 + tape200
                }
            }
        }
        return { tape400, tape200 }
    }
    const dims = await calcDimensions(fasad, [FASAD_TYPE.FMP, FASAD_TYPE.LACOBELGLASS, FASAD_TYPE.MIRROR, FASAD_TYPE.SAND])
    const verbose: VerboseData = [["Высота фасада", "Ширина фасада", "Полоса 400мм", "Полоса 200мм", "", "Площадь"]]
    let total = 0
    for (let d of dims) {
        const { tape200, tape400 } = getTapes(d.width, tolerance)
        let area = (d.height + 100) * (tape400 * 400 + tape200 * 200) / 1000000;
        total += area
        verbose.push([d.height, d.width, `${tape400}шт`, `${tape200}шт`, `(${d.height}+100) x (400x${tape400}+200x${tape200})`, area.toFixed(3)])
    }
    verbose.push(["", "", "", "", `Итого:`, total.toFixed(3)])
    return [{ data: { amount: total }, verbose: total > 0 ? verbose : undefined }]
}


async function calcFMPPaper(fasad: Fasad, widthLimit = 700): Promise<FullData[]> {
    const dims = await calcDimensions(fasad, [FASAD_TYPE.FMP])
    const coef = await getCoef(SpecificationItem.FMPPaper)
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
    return [{ data: { amount: total }, verbose: total > 0 ? verbose : undefined }]
}

async function calcFMPGlass(fasad: Fasad): Promise<FullData[]> {
    const dims = await calcDimensions(fasad, [FASAD_TYPE.FMP, FASAD_TYPE.LACOBEL])
    const verbose: VerboseData = [["Высота фасада", "Ширина фасада", "Площадь",""]]
    let total = 0
    const coef = await getCoef(SpecificationItem.FMPGlass)
    for (let d of dims) {
        let area = (d.height * d.width) / 1000000;
        total += area
        verbose.push([d.height, d.width, area.toFixed(3)])
    }
    const result = total * coef
    const coefString = coef !== 1 ? `x ${coef} =  ${result.toFixed(3)}` : ""
    verbose.push(["", `Итого:`, total.toFixed(3), coefString])
    return [{ data: { amount: result }, verbose: result > 0 ? verbose : undefined }]
}

async function calcPaint(fasad: Fasad): Promise<FullData[]> {
    const dims = await calcDimensions(fasad, [FASAD_TYPE.FMP])
    const coef = await getCoef(SpecificationItem.Paint)
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
    return [{ data: { amount: result }, verbose: result > 0 ? verbose : undefined }]
}
async function calcEva(fasad: Fasad): Promise<FullData[]>  {
    const dims = await calcDimensions(fasad, [FASAD_TYPE.FMP])
    const coef = await getCoef(SpecificationItem.EVA)
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
    return [{ data: { amount: result }, verbose: result > 0 ? verbose : undefined }]
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
    const service = new MaterialExtService(new UplotnitelServiceSQLite(materialsPath))
    const uplotList = (await (service.getExtData())).data
    const { code, name } = (uplotList && uplotList[0]) || { code: "", caption: "" }
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
    const coef = await getCoef(SpecificationItem.Uplot)
    const result = sum * coef
    const coefString = coef !== 1 ? `x ${coef} =  ${result.toFixed(3)}` : ""
    verbose.push(["", "", "", `${sum.toFixed(3)}`, coefString])
    return [{ data: { amount: result, char: { code, caption: name as string } }, verbose: result > 0 ? verbose : undefined }]
}

async function calcUplotnitelSoed(fasad: Fasad, profileType: ProfileType): Promise<FullData[]> {
    if (profileType === ProfileType.STANDART) return [emptyFullData()]
    const service = new MaterialExtService(new UplotnitelServiceSQLite(materialsPath))
    const uplotList = (await (service.getExtData())).data
    const { code, name } = (uplotList && uplotList[0]) || { code: "", caption: "" }
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
    const coef = await getCoef(SpecificationItem.UplotSoedBavaria)
    const result = sum * coef
    const coefString = coef !== 1 ? `x ${coef} =  ${result.toFixed(3)}` : ""
    verbose.push(["", "", "", `${sum.toFixed(3)}`, coefString])
    return [{ data: { amount: result, char: { code: "", caption: "" } }, verbose: result > 0 ? verbose : undefined }]
}

async function calcProfileSoed(fasad: Fasad, profile: Profile): Promise<FullData[]> {
    function getProfiles(fasad: Fasad): number[] {
        let result: number[] = []
        if (fasad.Children.length === 0) return result;
        result = new Array(fasad.Children.length - 1).fill(fasad.Division === Division.HEIGHT ? fasad.Width : fasad.Height);
        fasad.Children.forEach((f: Fasad) => result = [...result, ...getProfiles(f)])
        return result;
    }
    const coef = await getCoef(SpecificationItem.ProfileSoedStandart)
    const prof = getProfiles(fasad)
    const sum = prof.reduce((a, i) => a + i, 0) / 1000
    const result = sum * coef
    const coefString = coef !== 1 ? `x ${coef} =  ${result.toFixed(3)}` : ""
    const verbose = [["Профили", "Итого", ""]]
    verbose.push([prof.join("+"), `${sum.toFixed(3)}`, coefString])
    return [{ data: { amount: result, char: { code: profile.code, caption: profile.name } }, verbose: result > 0 ? verbose : undefined }]
}
async function calcProfileHor(fasad: Fasad, profile: Profile, top: boolean): Promise<FullData[]> {
    const prof = top ? SpecificationItem.ProfileHorTopStandart : SpecificationItem.ProfileHorBottomStandart
    const coef = await getCoef(prof)
    const width = fasad.Width - 13
    const result = (width / 1000) * coef
    const coefString = coef !== 1 ? `x ${coef} =  ${result.toFixed(3)}` : ""
    const verbose = [['Длина', '', '']]
    verbose.push([`(${fasad.Width} - 13) = ${width}`, `${(width / 1000).toFixed(3)}м`, coefString])
    return [{ data: { amount: result, char: { code: profile.code, caption: profile.name } }, verbose: result > 0 ? verbose : undefined }]
}

async function calcProfileVert(fasad: Fasad, profile: Profile): Promise<FullData[]> {
    const count = (fasad.Height > 2300) ? 2 : 1
    const verbose = [['Высота фасада', '', '']]
    verbose.push([`${fasad.Height}`, `${count === 1 ? "меньше-равно" : "больше"} 2300 - ${count}шт`])
    return [{ data: { amount: count, char: { code: profile.code, caption: profile.name } }, verbose: count > 0 ? verbose : undefined }]
}
async function calcStreich(fasad: Fasad): Promise<FullData[]>  {
    return [{ data: { amount: 12 } }]
}
async function calcKarton(fasad: Fasad): Promise<FullData[]>  {
    return [{ data: { amount: 0.25 } }]
}
async function calcRoliki(fasad: Fasad, profile: Profile): Promise<FullData[]>  {
    if (profile.type === ProfileType.BAVARIA) return [emptyFullData()]
    return [{ data: { amount: 1 } }]
}
async function calcRolikiBavaria(fasad: Fasad, profile: Profile): Promise<FullData[]>  {
    if (profile.type === ProfileType.STANDART) return [emptyFullData()]
    return [{ data: { amount: 1 } }]
}


