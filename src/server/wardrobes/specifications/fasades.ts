import Fasad from "../../../classes/Fasad";
import { getFasadHeight, getFasadWidth } from "../../../functions/wardrobe";
import { FasadMaterial } from "../../../types/enums";
import { ExtMaterial, ProfileType } from "../../../types/materials";
import { FullData, SpecificationResult, VerboseData } from "../../../types/wardrobe";
import { SpecificationItem } from "../../../types/specification";
import { WardrobeData } from "../../../types/wardrobe";
import { materialServiceProvider } from "../../options";
import { MaterialService } from "../../services/materialService";
import { getCoef } from "../functions";

export function createFasades(data: WardrobeData, profileType: ProfileType): Fasad[]{
    const fasades: Fasad[] = []
    const count = Object.values(data.fasades).reduce((a, f) => f.count + a, 0)
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

export async function getFasadSpecification(fasad: Fasad, profileType: ProfileType, coefList: Map<SpecificationItem, number>): Promise<Map<SpecificationItem, FullData[]>> {
    const spec = await calcSpecification(fasad, coefList);

    //combineSpecifications(fasad, coefList);
    // if (profileType === ProfileType.STANDART) {
    //     const uplot = (spec.get(SpecificationItem.Uplot)?.data.amount || 0) * (coefList.get(SpecificationItem.Uplot) || 1);
    //     const uplotSoed = (spec.get(SpecificationItem.UplotSoed)?.data.amount || 0) * (coefList.get(SpecificationItem.UplotSoed) || 1);
    //     spec.set(SpecificationItem.Uplot, {data: { amount: uplot + uplotSoed }});
    //     spec.set(SpecificationItem.UplotSoed, {data:{ amount: 0 }});
    // }
    // spec.set(SpecificationItem.ProfileSoedStandart, profileType === ProfileType.STANDART ? { amount: calcProfileSoed(fasad) * (coefList.get(SpecificationItem.ProfileSoedStandart) || 1) } : { amount: 0 });
    // spec.set(SpecificationItem.ProfileVertStandart, profileType === ProfileType.STANDART ? { amount: calcProfileVert(fasad) * (coefList.get(SpecificationItem.ProfileVertStandart) || 1) } : { amount: 0 });
    // spec.set(SpecificationItem.ProfileHorTopStandart, profileType === ProfileType.STANDART ? { amount: calcProfileHor(fasad) * (coefList.get(SpecificationItem.ProfileHorTopStandart) || 1) } : { amount: 0 });
    // spec.set(SpecificationItem.ProfileHorBottomStandart, profileType === ProfileType.STANDART ? { amount: calcProfileHor(fasad) * (coefList.get(SpecificationItem.ProfileHorBottomStandart) || 1) } : { amount: 0 });
    // spec.set(SpecificationItem.ProfileSoedBavaria, profileType === ProfileType.BAVARIA ? { amount: calcProfileSoed(fasad) * (coefList.get(SpecificationItem.ProfileSoedBavaria) || 1) } : { amount: 0 });
    // spec.set(SpecificationItem.ProfileVertBavaria, profileType === ProfileType.BAVARIA ? { amount: calcProfileVert(fasad) * (coefList.get(SpecificationItem.ProfileVertBavaria) || 1) } : { amount: 0 });
    // spec.set(SpecificationItem.ProfileHorTopBavaria, profileType === ProfileType.BAVARIA ? { amount: calcProfileHor(fasad) * (coefList.get(SpecificationItem.ProfileHorTopBavaria) || 1) } : { amount: 0 });
    // spec.set(SpecificationItem.ProfileHorBottomBavaria, profileType === ProfileType.BAVARIA ? { amount: calcProfileHor(fasad) * (coefList.get(SpecificationItem.ProfileHorBottomBavaria) || 1) } : { amount: 0 });
    // spec.set(SpecificationItem.Streich, { amount: 12 });
    // spec.set(SpecificationItem.Roliki, profileType === ProfileType.STANDART ? { amount: 1 } : { amount: 0 });
    // spec.set(SpecificationItem.RolikiBavaria, profileType === ProfileType.BAVARIA ? { amount: 1 } : { amount: 0 });
    // spec.set(SpecificationItem.Karton, { amount: 0.25 });
    // spec.set(SpecificationItem.Skotch, { amount: 5 });
    return spec;
}


// function combineSpecifications(fasad: Fasad, coefList: Map<SpecificationItem, number>): Map<SpecificationItem, FullData> {
//     if (fasad.Children.length > 0) {
//         const spec: Map<SpecificationItem, FullData> = getSpecificationPattern();
//         fasad.Children.forEach((f: Fasad) => {
//             const s = combineSpecifications(f, coefList);
//             s.forEach((value, key) => {
//                 const prev = spec.get(key) || { amount: 0, code_char: "" };
//                 spec.set(key, { ...prev, data: {amount: prev.data.amount + value.data.amount} });
//             });
//         });
//         return spec;
//     }
//     return calcSpecification(fasad, coefList);
// }

async function calcSpecification(fasad: Fasad, coefList: Map<SpecificationItem, number>): Promise<Map<SpecificationItem, FullData[]>> {
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
    spec.set(SpecificationItem.Uplot, await calcUplotnitel(fasad));
    spec.set(SpecificationItem.UplotSoed, await calcUplotnitelSoed(fasad));
    return spec;
}
async function calcArea(fasad: Fasad, materials: ExtMaterial[], material: FasadMaterial, useChar: boolean = true): Promise<FullData[]> {
    const result: FullData[] = []
    if (fasad.Children.length === 0) {
        if (fasad.Material !== material) return result
        const mat = materials.find(m => m.material === material && m.name === fasad.ExtMaterial) || { code: "", name: "" }
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

async function calcDSP10(fasad: Fasad, materials: ExtMaterial[]): Promise<FullData[]> {
    const result = await calcArea(fasad, materials, FasadMaterial.DSP)
    const coef = await getCoef(SpecificationItem.DSP10)
    const finalResult = result.map(r => {
        const area = r.data.amount
        r.data.amount = area * coef
        return { ...r, verbose: [["Длина", "Ширина", "Площадь", ""], ...r.verbose as VerboseData, ["", "Итого", `${area.toFixed(3)}`, (coef !== 1) ? `x ${coef} = ${(area * coef).toFixed(3)}` : ""]] }
    })
    return finalResult
}
async function calcMirror(fasad: Fasad, materials: ExtMaterial[]): Promise<FullData[]> {
    const result = await calcArea(fasad, materials, FasadMaterial.MIRROR)
    const coef = await getCoef(SpecificationItem.Mirror)
    const finalResult = result.map(r => {
        const area = r.data.amount
        r.data.amount = area * coef
        return { ...r, verbose: [["Длина", "Ширина", "Площадь", ""], ...r.verbose as VerboseData, ["", "Итого", `${area.toFixed(3)}`, (coef !== 1) ? `x ${coef} = ${(area * coef).toFixed(3)}` : ""]] }
    })
    return finalResult
}
async function calcArakal(fasad: Fasad, materials: ExtMaterial[]): Promise<FullData[]> {
    const result = await calcArea(fasad, materials, FasadMaterial.SAND, false)
    const coef = await getCoef(SpecificationItem.Arakal)
    const finalResult = result.map(r => {
        const area = r.data.amount
        r.data.amount = area * coef
        return { ...r, verbose: [["Длина", "Ширина", "Площадь", ""], ...r.verbose as VerboseData, ["", "Итого", `${area.toFixed(3)}`, (coef !== 1) ? `x ${coef} = ${(area * coef).toFixed(3)}` : ""]] }
    })
    return finalResult
}
async function calcHydro(fasad: Fasad, materials: ExtMaterial[]): Promise<FullData[]> {
    const result = await calcArea(fasad, materials, FasadMaterial.SAND, false)
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
    const result = await calcArea(fasad, materials, FasadMaterial.LACOBELGLASS)
    const coef = await getCoef(SpecificationItem.Lacobel)
    const finalResult = result.map(r => {
        const area = r.data.amount
        r.data.amount = area * coef
        return { ...r, verbose: [["Длина", "Ширина", "Площадь", ""], ...r.verbose as VerboseData, ["", "Итого", `${area.toFixed(3)}`, (coef !== 1) ? `x ${coef} = ${(area * coef).toFixed(3)}` : ""]] }
    })
    return finalResult
}

async function calcRitrama(fasad: Fasad): Promise<FullData[]> {
    return [{data: {amount: 0}}]
    //return fasad.Material === FasadMaterial.LACOBEL ? (fasad.cutHeight + 100) * 1200 / 1000000 : 0;
}
async function calcArmirovka(fasad: Fasad, tolerance = 5): Promise<FullData[]> {
    return [{data: {amount: 0}}]
    //if (fasad.Material === FasadMaterial.LACOBEL || fasad.Material === FasadMaterial.DSP) return 0;
    // let f = Math.floor(fasad.cutWidth / 400);
    // const tape400 = f + (fasad.cutWidth - f) * 400 > 205 ? 1 : 0;
    // f = fasad.cutWidth - tape400 * 400;
    // f = Math.ceil(f / 200) * 200 < tolerance ? 0 : Math.ceil((f - tolerance) / 200);
    // const tape200 = f < 0 ? 0 : f;
    //return (fasad.cutHeight + 100) * (tape400 * 400 + tape200 * 200) / 1000000;
}
async function calcFMPPaper(fasad: Fasad, widthLimit = 700): Promise<FullData[]> {
    return [{data: {amount: 0}}]
    //if (fasad.Material !== FasadMaterial.FMP) return 0;
    // const sizes = [610, 914, 1067];
    // const offset = fasad.cutWidth < widthLimit ? 40 : 50;
    // const size = sizes.find(s => fasad.cutWidth + offset < s) || sizes[2];
    //return (fasad.cutHeight + 100) * size / 1000000;
}
async function calcFMPGlass(fasad: Fasad): Promise<FullData[]> {
    return [{data: {amount: 0}}]
    //return (fasad.Material === FasadMaterial.FMP || fasad.Material === FasadMaterial.LACOBEL) ? fasad.cutWidth * fasad.cutHeight / 1000000 : 0;
}
async function calcPaint(fasad: Fasad): Promise<FullData[]> {
    return [{data: {amount: 0}}]
    //return fasad.Material === FasadMaterial.FMP ? fasad.cutWidth * fasad.cutHeight / 1000000 * 13.8 * 0.001 : 0;
}
async function calcEva(fasad: Fasad): Promise<FullData[]>  {
    return [{data: {amount: 0}}]
    //return fasad.Material === FasadMaterial.FMP ? fasad.cutWidth * fasad.cutHeight / 1000000 : 0;
}
async function calcUplotnitel(fasad: Fasad): Promise<FullData[]>  {
    return [{data: {amount: 0}}]
    //if (fasad.Material === FasadMaterial.DSP) return 0;
    // const { top, bottom, left, right } = fasad.OuterEdges;
    // let res = left ? fasad.Height : 0;
    // res = (right ? fasad.Height : 0) + res;
    // res = (top ? fasad.Width : 0) + res;
    // res = (bottom ? fasad.Width : 0) + res;
    //return res / 1000;
}
async function calcUplotnitelSoed(fasad: Fasad): Promise<FullData[]> {
    return [{data: {amount: 0}}]
    //if (fasad.Material === FasadMaterial.DSP) return 0;
    // const { top, bottom, left, right } = fasad.OuterEdges;
    // let res = !left ? fasad.Height : 0;
    // res = (!right ? fasad.Height : 0) + res;
    // res = (!top ? fasad.Width : 0) + res;
    // res = (!bottom ? fasad.Width : 0) + res;
    //return res / 1000;
}
async function calcProfileSoed(fasad: Fasad): Promise<FullData[]> {
    return [{data: {amount: 0}}]
    //if (fasad.Children.length === 0) return 0;
    //let res = (fasad.Children.length - 1) * (fasad.Division === Division.HEIGHT ? fasad.Width : fasad.Height) / 1000;
    //fasad.Children.forEach((f: Fasad) => res = res + calcProfileSoed(f));
    //return res;
}
async function calcProfileHor(fasad: Fasad): Promise<FullData[]> {
    return [{data: {amount: 0}}]
    //return (fasad.Width - 13) / 1000;
}
async function calcProfileVert(fasad: Fasad): Promise<FullData[]>  {
    return [{data: {amount: 0}}]
    //return fasad.Height > 2293 ? 2 : 1;
}
async function calcStreich(fasad: Fasad): Promise<FullData[]>  {
    return [{data: {amount: 0}}]
    //return 12;
}

export function emptyFullData(): FullData[]{
    return [{ data: { amount: 0 } }]
}