import Fasad from "../../../classes/Fasad";
import { getFasadHeight, getFasadWidth } from "../../../functions/wardrobe";
import { Division, FasadMaterial } from "../../../types/enums";
import { ExtMaterial, Profile, ProfileType } from "../../../types/materials";
import { FullData, SpecificationResult, VerboseData, WARDROBE_TYPE } from "../../../types/wardrobe";
import { SpecificationItem } from "../../../types/specification";
import { WardrobeData } from "../../../types/wardrobe";
import { materialServiceProvider, materialsPath } from "../../options";
import { MaterialService } from "../../services/materialService";
import { getCoef } from "./corpus";
import { MaterialExtService } from "../../services/materialExtService";
import UplotnitelServiceSQLite from "../../services/extServices/uplotnitelServiceSQLite";

export function getFasadCount(data: WardrobeData): number{
    return Object.values(data.fasades).reduce((a, f) => f.count + a, 0)
}
export function correctFasadCount(count: number): boolean{
    return count > 1 && count < 7
}
export function createFasades(data: WardrobeData, profileType: ProfileType): Fasad[]{
    const fasades: Fasad[] = []
    const count = getFasadCount(data)
    if (!correctFasadCount(count)) return fasades
    if (data.wardType === WARDROBE_TYPE.CORPUS) return fasades
    const width = getFasadWidth(data.width, count, data.wardType, profileType)
    const height = getFasadHeight(data.height, data.wardType, profileType)
    data.fasades.dsp.names.forEach(n => {
        const fasad = new Fasad({ width, height, material: FasadMaterial.DSP, extMaterial: n })
        fasades.push(fasad)
    })
    data.fasades.mirror.names.forEach(n => {
        const fasad = new Fasad({ width, height, material: FasadMaterial.MIRROR, extMaterial: n })
        fasades.push(fasad)
    })
    data.fasades.fmp.names.forEach(n => {
        const fasad = new Fasad({ width, height, material: FasadMaterial.FMP, extMaterial: n })
        fasades.push(fasad)
    })
    data.fasades.sand.names.forEach(n => {
        const fasad = new Fasad({ width, height, material: FasadMaterial.SAND, extMaterial: n })
        fasades.push(fasad)
    })
    data.fasades.lacobel.names.forEach(n => {
        const fasad = new Fasad({ width, height, material: FasadMaterial.LACOBEL, extMaterial: n })
        fasades.push(fasad)
    })
    data.fasades.lacobelGlass.names.forEach(n => {
        const fasad = new Fasad({ width, height, material: FasadMaterial.LACOBELGLASS, extMaterial: n })
        fasades.push(fasad)
    })
    return fasades
}
export function filterEmptySpecification(spec: Map<SpecificationItem, FullData[]>): Map<SpecificationItem, FullData[]> {
    const newSpec = new Map<SpecificationItem, FullData[]>();
    spec.forEach((v, k) => { if (v.every(d => d.data.amount !== 0)) newSpec.set(k, v); });
    return newSpec;
}

export function getSpecificationPattern(): Map<SpecificationItem, FullData[]> {
    const spec = new Map<SpecificationItem, FullData[]>();
    Object.keys(SpecificationItem).forEach(k => {
        spec.set(k as SpecificationItem, [{ data: { amount: 0, char: { code: "", caption: "" } }, verbose: [] }])
    });
    return spec;
}

export function flattenSpecification(spec: Map<SpecificationItem, FullData[]>): SpecificationResult[] {
    const result: [SpecificationItem, FullData][] = []
    spec.forEach((v, k) => {
        v.forEach(item => {
            result.push([k, item])
        })
    })
    return result
}

export async function getFasadSpecification(fasad: Fasad, profile: Profile): Promise<Map<SpecificationItem, FullData[]>> {
    const spec = await calcSpecification(fasad, profile);
    return spec;
}

async function calcSpecification(fasad: Fasad, profile: Profile): Promise<Map<SpecificationItem, FullData[]>> {
    const spec = getSpecificationPattern();
    const matService = new MaterialService(materialServiceProvider)
    const materials = (await matService.getExtMaterials({})).data as ExtMaterial[]
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
    spec.set(SpecificationItem.ProfileSoedStandart, profile.type === ProfileType.STANDART ? await calcProfileSoed(fasad, profile) : emptyFullData())
    spec.set(SpecificationItem.ProfileVertStandart, profile.type === ProfileType.STANDART ? await calcProfileVert(fasad, profile) : emptyFullData())
    spec.set(SpecificationItem.ProfileHorTopStandart, profile.type === ProfileType.STANDART ? await calcProfileHor(fasad, profile, true) : emptyFullData())
    spec.set(SpecificationItem.ProfileHorBottomStandart, profile.type === ProfileType.STANDART ? await calcProfileHor(fasad, profile, false) : emptyFullData())
    spec.set(SpecificationItem.ProfileSoedBavaria, profile.type === ProfileType.BAVARIA ? await calcProfileSoed(fasad, profile) : emptyFullData())
    spec.set(SpecificationItem.ProfileVertBavaria, profile.type === ProfileType.BAVARIA ? await calcProfileVert(fasad, profile) : emptyFullData())
    spec.set(SpecificationItem.ProfileHorTopBavaria, profile.type === ProfileType.BAVARIA ? await calcProfileHor(fasad, profile, true) : emptyFullData())
    spec.set(SpecificationItem.ProfileHorBottomBavaria, profile.type === ProfileType.BAVARIA ? await calcProfileHor(fasad, profile, false) : emptyFullData())
    spec.set(SpecificationItem.Streich, await calcStreich(fasad))
    spec.set(SpecificationItem.Karton, await calcKarton(fasad))
    spec.set(SpecificationItem.Roliki, await calcRoliki(fasad, profile))
    spec.set(SpecificationItem.RolikiBavaria, await calcRolikiBavaria(fasad, profile))
    return spec;
}
async function calcArea(fasad: Fasad, materials: ExtMaterial[], material: FasadMaterial[], useChar: boolean = true): Promise<FullData[]> {
    const result: FullData[] = []
    if (fasad.Children.length === 0) {
        if (!material.includes(fasad.Material)) return result
        const mat = materials.find(m => material.includes(m.material as FasadMaterial) && m.name === fasad.ExtMaterial) || { code: "", name: "" }
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
async function calcDimensions(fasad: Fasad, material: FasadMaterial[]): Promise<{height: number, width: number}[]> {
    const result: {height: number, width: number}[] = []
    if (fasad.Children.length === 0) {
        if (!material.includes(fasad.Material)) return result
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

async function calcDSP10(fasad: Fasad, materials: ExtMaterial[]): Promise<FullData[]> {
    const result = await calcArea(fasad, materials, [FasadMaterial.DSP])
    const coef = await getCoef(SpecificationItem.DSP10)
    const finalResult = result.map(r => {
        const area = r.data.amount
        r.data.amount = area * coef
        return { ...r, verbose: [["Высота фасада", "Ширина фасада", "Площадь", ""], ...r.verbose as VerboseData, ["", "Итого", `${area.toFixed(3)}`, (coef !== 1) ? `x ${coef} = ${(area * coef).toFixed(3)}` : ""]] }
    })
    return finalResult
}
async function calcMirror(fasad: Fasad, materials: ExtMaterial[]): Promise<FullData[]> {
    const result = await calcArea(fasad, materials, [FasadMaterial.MIRROR])
    const coef = await getCoef(SpecificationItem.Mirror)
    const finalResult = result.map(r => {
        const area = r.data.amount
        r.data.amount = area * coef
        return { ...r, verbose: [["Высота фасада", "Ширина фасада", "Площадь", ""], ...r.verbose as VerboseData, ["", "Итого", `${area.toFixed(3)}`, (coef !== 1) ? `x ${coef} = ${(area * coef).toFixed(3)}` : ""]] }
    })
    return finalResult
}
async function calcArakal(fasad: Fasad, materials: ExtMaterial[]): Promise<FullData[]> {
    const result = await calcArea(fasad, materials, [FasadMaterial.SAND], false)
    const coef = await getCoef(SpecificationItem.Arakal)
    const finalResult = result.map(r => {
        const area = r.data.amount
        r.data.amount = area * coef
        return { ...r, verbose: [["Высота фасада", "Ширина фасада", "Площадь", ""], ...r.verbose as VerboseData, ["", "Итого", `${area.toFixed(3)}`, (coef !== 1) ? `x ${coef} = ${(area * coef).toFixed(3)}` : ""]] }
    })
    return finalResult
}
async function calcHydro(fasad: Fasad, materials: ExtMaterial[]): Promise<FullData[]> {
    const result = await calcArea(fasad, materials, [FasadMaterial.SAND], false)
    const coef = await getCoef(SpecificationItem.Hydro)
    const mult = 0.035
    if (result.length > 0) {
        const total = result[0].data.amount * 0.035 * coef
        const data = `x ${mult} ${coef !== 1 ? "x " + coef : ""} = ${total.toFixed(3)}`
        result[0].verbose?.push(["", "", "", data])
        result[0].data.amount = total
    }
    return result
}
async function calcLacobel(fasad: Fasad, materials: ExtMaterial[]): Promise<FullData[]> {
    const result = await calcArea(fasad, materials, [FasadMaterial.LACOBELGLASS])
    const coef = await getCoef(SpecificationItem.Lacobel)
    const finalResult = result.map(r => {
        const area = r.data.amount
        r.data.amount = area * coef
        return { ...r, verbose: [["Высота фасада", "Ширина фасада", "Площадь", ""], ...r.verbose as VerboseData, ["", "Итого", `${area.toFixed(3)}`, (coef !== 1) ? `x ${coef} = ${(area * coef).toFixed(3)}` : ""]] }
    })
    return finalResult
}

async function calcRitrama(fasad: Fasad): Promise<FullData[]> {
    const dims = await calcDimensions(fasad, [FasadMaterial.LACOBEL])
    const verbose: VerboseData = [["Высота фасада", "Ширина фасада", "Ритрама", "Площадь"]]
    let total = 0
    for (let d of dims) {
        let ritrama = ((d.height + 100) * 1200 / 1000000)
        total += ritrama
        verbose.push([d.height, d.width, `(${d.height}+100)x1200`, ritrama.toFixed(3)])
    }
    verbose.push(["", "", `Итого:`, total.toFixed(3)])
    return [{ data: { amount: total }, verbose }]
}

async function calcArmirovka(fasad: Fasad, tolerance = 5): Promise<FullData[]> {
    const dims = await calcDimensions(fasad, [FasadMaterial.FMP, FasadMaterial.LACOBELGLASS, FasadMaterial.MIRROR, FasadMaterial.SAND])
    const verbose: VerboseData = [["Высота фасада", "Ширина фасада", "Полоса 200мм", "Полоса 400мм", "", "Площадь"]]
    let total = 0
    for (let d of dims) {
        let f = Math.floor(d.width / 400);
        const tape400 = f + (d.width - f) * 400 > 205 ? 1 : 0;
        f = d.width - tape400 * 400;
        f = Math.ceil(f / 200) * 200 < tolerance ? 0 : Math.ceil((f - tolerance) / 200);
        const tape200 = f < 0 ? 0 : f;
        let area = (d.height + 100) * (tape400 * 400 + tape200 * 200) / 1000000;
        total += area
        verbose.push([d.height, d.width, tape200, tape400, `(${d.height}+100) x (400x${tape400}+200x${tape200})`, area.toFixed(3)])
    }
    verbose.push(["", "", "", "", `Итого:`, total.toFixed(3)])
    return [{ data: { amount: total }, verbose }]
}
async function calcFMPPaper(fasad: Fasad, widthLimit = 700): Promise<FullData[]> {
    const dims = await calcDimensions(fasad, [FasadMaterial.FMP])
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
    return [{ data: { amount: total }, verbose }]
}

async function calcFMPGlass(fasad: Fasad): Promise<FullData[]> {
    const dims = await calcDimensions(fasad, [FasadMaterial.FMP, FasadMaterial.LACOBEL])
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
    return [{ data: { amount: result }, verbose }]
}

async function calcPaint(fasad: Fasad): Promise<FullData[]> {
    const dims = await calcDimensions(fasad, [FasadMaterial.FMP])
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
    return [{ data: { amount: result }, verbose }]
}
async function calcEva(fasad: Fasad): Promise<FullData[]>  {
    const dims = await calcDimensions(fasad, [FasadMaterial.FMP])
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
    return [{ data: { amount: result }, verbose }]
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
        if (fasad.Material === FasadMaterial.DSP) return result
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
    return [{ data: { amount: result, char: { code, caption: name as string } }, verbose }]
}

async function calcUplotnitelSoed(fasad: Fasad, profileType: ProfileType): Promise<FullData[]> {
    if (profileType === ProfileType.STANDART) return emptyFullData()
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
    return [{ data: { amount: result, char: { code, caption: name as string } }, verbose }]
}

async function calcProfileSoed(fasad: Fasad, profile: Profile): Promise<FullData[]> {
    function getProfiles(fasad: Fasad): number[] {
        let result: number[] = []
        if (fasad.Children.length === 0) return result;
        result = new Array(fasad.Children.length - 1).fill(fasad.Division === Division.HEIGHT ? fasad.Width : fasad.Height);
        fasad.Children.forEach((f: Fasad) => result = [...result, ...getProfiles(f)])
        return result;
    }
    const coef = await getCoef(profile.type === ProfileType.STANDART ? SpecificationItem.ProfileSoedStandart : SpecificationItem.ProfileSoedBavaria)
    const prof = getProfiles(fasad)
    const sum = prof.reduce((a, i) => a + i, 0) / 1000
    const result = sum * coef
    const coefString = coef !== 1 ? `x ${coef} =  ${result.toFixed(3)}` : ""
    const verbose = [["Профили", "Итого", ""]]
    verbose.push([prof.join("+"), `${sum.toFixed(3)}`, coefString])
    return [{ data: { amount: result, char: { code: profile.code, caption: profile.name } }, verbose }]
}
async function calcProfileHor(fasad: Fasad, profile: Profile, top: boolean): Promise<FullData[]> {
    const itemStandart = top ? SpecificationItem.ProfileHorTopStandart : SpecificationItem.ProfileHorBottomStandart
    const itemBavaria = top ? SpecificationItem.ProfileHorTopBavaria : SpecificationItem.ProfileHorBottomBavaria
    const coef = await getCoef(profile.type === ProfileType.STANDART ? itemStandart : itemBavaria)
    const width = fasad.Width - 13
    const result = (width / 1000) * coef
    const coefString = coef !== 1 ? `x ${coef} =  ${result.toFixed(3)}` : ""
    const verbose = [['Длина', '', '']]
    verbose.push([`(${fasad.Width} - 13) = ${width}`, `${(width / 1000).toFixed(3)}м`, coefString])
    return [{ data: { amount: result, char: { code: profile.code, caption: profile.name } }, verbose }]
}

async function calcProfileVert(fasad: Fasad, profile: Profile): Promise<FullData[]> {
    const count = (fasad.Height > 2293) ? 2 : 1
    const verbose = [['Высота фасада', '', '']]
    verbose.push([`${fasad.Height}`, `${count === 1 ? "<=" : ">"}2293 = ${count}шт`])
    return [{ data: { amount: count, char: { code: profile.code, caption: profile.name } }, verbose }]
}
async function calcStreich(fasad: Fasad): Promise<FullData[]>  {
    return [{ data: { amount: 12 } }]
}
async function calcKarton(fasad: Fasad): Promise<FullData[]>  {
    return [{ data: { amount: 0.25 } }]
}
async function calcRoliki(fasad: Fasad, profile: Profile): Promise<FullData[]>  {
    if (profile.type === ProfileType.BAVARIA) return emptyFullData()
    return [{ data: { amount: 1 } }]
}
async function calcRolikiBavaria(fasad: Fasad, profile: Profile): Promise<FullData[]>  {
    if (profile.type === ProfileType.STANDART) return emptyFullData()
    return [{ data: { amount: 1 } }]
}
export function emptyFullData(): FullData[]{
    return [{ data: { amount: 0 } }]
}