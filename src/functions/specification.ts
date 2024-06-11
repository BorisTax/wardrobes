import Fasad from "../classes/Fasad";
import { Division, FasadMaterial } from "../types/enums";
import { CORPUS_SPECS } from "../types/specification";
import { SpecificationItem } from "../types/specification";
import { ProfileType } from "../types/materials";
import { SpecificationResult } from "../types/wardrobe";

export function getInitSpecification(): SpecificationResult {
    return [
        { type: CORPUS_SPECS.CORPUS, spec: [] },
        { type: FasadMaterial.DSP, spec: [] },
        { type: FasadMaterial.MIRROR, spec: [] },
        { type: FasadMaterial.FMP, spec: [] },
        { type: FasadMaterial.SAND, spec: [] },
        { type: FasadMaterial.LACOBEL, spec: [] },
        { type: FasadMaterial.LACOBELGLASS, spec: [] },
        { type: CORPUS_SPECS.EXT_TEL, spec: [] },
        { type: CORPUS_SPECS.EXT_CONSOLE, spec: [] },
        { type: CORPUS_SPECS.EXT_BLINDER, spec: [] },
        { type: CORPUS_SPECS.EXT_SHELF, spec: [] },
        { type: CORPUS_SPECS.EXT_SHELFPLAT, spec: [] },
        { type: CORPUS_SPECS.EXT_PILLAR, spec: [] },
        { type: CORPUS_SPECS.EXT_STAND, spec: [] },
        { type: CORPUS_SPECS.EXT_TUBE, spec: [] },
        { type: CORPUS_SPECS.EXT_TREMPEL, spec: [] },
        { type: CORPUS_SPECS.EXT_LIGHT, spec: [] },
    ]
};

export const SpecGroups: Map<string, string> = new Map()
SpecGroups.set(CORPUS_SPECS.CORPUS, "Корпус")
SpecGroups.set(FasadMaterial.DSP, "Фасад ДСП")
SpecGroups.set(FasadMaterial.MIRROR, "Фасад зеркало")
SpecGroups.set(FasadMaterial.FMP, "Фасад ФМП")
SpecGroups.set(FasadMaterial.SAND, "Фасад песок")
SpecGroups.set(FasadMaterial.LACOBEL, "Фасад лакобель")
SpecGroups.set(FasadMaterial.LACOBELGLASS, "Фасад лакобель(стекло)")
SpecGroups.set(CORPUS_SPECS.EXT_TEL, "Телескоп")
SpecGroups.set(CORPUS_SPECS.EXT_CONSOLE, "Консоль")
SpecGroups.set(CORPUS_SPECS.EXT_BLINDER, "Козырек")
SpecGroups.set(CORPUS_SPECS.EXT_SHELF, "Полка(пол)")
SpecGroups.set(CORPUS_SPECS.EXT_SHELFPLAT, "Полка(плат)")
SpecGroups.set(CORPUS_SPECS.EXT_PILLAR, "Перемычка")
SpecGroups.set(CORPUS_SPECS.EXT_STAND, "Стойка")
SpecGroups.set(CORPUS_SPECS.EXT_TUBE, "Труба")
SpecGroups.set(CORPUS_SPECS.EXT_TREMPEL, "Тремпель")
SpecGroups.set(CORPUS_SPECS.EXT_LIGHT, "Точки света")

export function getSpecification(data: [SpecificationItem, number][]): Map<SpecificationItem, number>{
    const m = new Map()
    data.forEach(i => m.set(i[0], i[1]))
    return m
} 

export function filterEmptySpecification(spec: Map<SpecificationItem, number>): Map<SpecificationItem, number>{
    const newSpec = new Map<SpecificationItem, number>()
    spec.forEach((v, k) => { if (v !== 0) newSpec.set(k, v) })
    return newSpec
}

export function getSpecificationPattern(): Map<SpecificationItem, number> {
    const spec = new Map<SpecificationItem, number>()
    Object.keys(SpecificationItem).forEach(k => { spec.set(k as SpecificationItem, 0) })
    return spec
}

export function getFasadSpecification(fasad: Fasad, profileType: ProfileType, coefList: Map<SpecificationItem, number>): Map<SpecificationItem, number> {
    const spec = combineSpecifications(fasad, coefList)
    if (profileType === ProfileType.STANDART) {
        const uplot = (spec.get(SpecificationItem.Uplot) || 0) * (coefList.get(SpecificationItem.Uplot) || 1)
        const uplotSoed = (spec.get(SpecificationItem.UplotSoed) || 0) * (coefList.get(SpecificationItem.UplotSoed) || 1)
        spec.set(SpecificationItem.Uplot, uplot + uplotSoed)
        spec.set(SpecificationItem.UplotSoed, 0)
    }
    spec.set(SpecificationItem.ProfileSoedStandart, profileType === ProfileType.STANDART ? calcProfileSoed(fasad) * (coefList.get(SpecificationItem.ProfileSoedStandart) || 1) : 0)
    spec.set(SpecificationItem.ProfileVertStandart, profileType === ProfileType.STANDART ? calcProfileVert(fasad) * (coefList.get(SpecificationItem.ProfileVertStandart) || 1) : 0)
    spec.set(SpecificationItem.ProfileHorTopStandart, profileType === ProfileType.STANDART ? calcProfileHor(fasad) * (coefList.get(SpecificationItem.ProfileHorTopStandart) || 1) : 0)
    spec.set(SpecificationItem.ProfileHorBottomStandart, profileType === ProfileType.STANDART ? calcProfileHor(fasad) * (coefList.get(SpecificationItem.ProfileHorBottomStandart) || 0) : 0)
    spec.set(SpecificationItem.ProfileSoedBavaria, profileType === ProfileType.BAVARIA ? calcProfileSoed(fasad) * (coefList.get(SpecificationItem.ProfileSoedBavaria) || 1) : 0)
    spec.set(SpecificationItem.ProfileVertBavaria, profileType === ProfileType.BAVARIA ? calcProfileVert(fasad) * (coefList.get(SpecificationItem.ProfileVertBavaria) || 1) : 0)
    spec.set(SpecificationItem.ProfileHorTopBavaria, profileType === ProfileType.BAVARIA ? calcProfileHor(fasad) * (coefList.get(SpecificationItem.ProfileHorTopBavaria) || 1) : 0)
    spec.set(SpecificationItem.ProfileHorBottomBavaria, profileType === ProfileType.BAVARIA ? calcProfileHor(fasad) * (coefList.get(SpecificationItem.ProfileHorBottomBavaria) || 1) : 0)
    spec.set(SpecificationItem.Streich, 12)
    spec.set(SpecificationItem.Roliki, profileType === ProfileType.STANDART ? 1 : 0)
    spec.set(SpecificationItem.RolikiBavaria, profileType === ProfileType.BAVARIA ? 1 : 0)
    spec.set(SpecificationItem.Karton, 0.25)
    spec.set(SpecificationItem.Skotch, 5)
    return spec
}

function combineSpecifications(fasad: Fasad, coefList: Map<SpecificationItem, number>): Map<SpecificationItem, number> {
    if (fasad.Children.length > 0) {
        const spec: Map<SpecificationItem, number> = getSpecificationPattern()
        fasad.Children.forEach((f: Fasad) => {
            const s = combineSpecifications(f, coefList)
            s.forEach((value, key) => {
                const prev = spec.get(key) || 0
                spec.set(key, prev + value)
            })
        })
        return spec
    }
    return calcSpecification(fasad, coefList)
}

function calcSpecification(fasad: Fasad, coefList: Map<SpecificationItem, number>): Map<SpecificationItem, number> {
    const spec = getSpecificationPattern()
    spec.set(SpecificationItem.DSP10, calcDSP10(fasad) * (coefList.get(SpecificationItem.DSP10) || 1))
    spec.set(SpecificationItem.Mirror, calcMirror(fasad) * (coefList.get(SpecificationItem.Mirror) || 1))
    spec.set(SpecificationItem.Arakal, calcArakal(fasad) * (coefList.get(SpecificationItem.Arakal) || 1))
    spec.set(SpecificationItem.Hydro, calcHydro(fasad) * (coefList.get(SpecificationItem.Hydro) || 1))
    spec.set(SpecificationItem.Lacobel, calcLacobel(fasad) * (coefList.get(SpecificationItem.Lacobel) || 1))
    spec.set(SpecificationItem.Ritrama, calcRitrama(fasad) * (coefList.get(SpecificationItem.Ritrama) || 1))
    spec.set(SpecificationItem.Armirovka, calcArmirovka(fasad) * (coefList.get(SpecificationItem.Armirovka) || 1))
    spec.set(SpecificationItem.FMPPaper, calcFMPPaper(fasad) * (coefList.get(SpecificationItem.FMPPaper) || 1))
    spec.set(SpecificationItem.FMPGlass, calcFMPGlass(fasad) * (coefList.get(SpecificationItem.FMPGlass) || 1))
    spec.set(SpecificationItem.Paint, calcPaint(fasad) * (coefList.get(SpecificationItem.Paint) || 1))
    spec.set(SpecificationItem.EVA, calcEva(fasad) * (coefList.get(SpecificationItem.EVA) || 1))
    spec.set(SpecificationItem.Uplot, calcUplotnitel(fasad) * (coefList.get(SpecificationItem.Uplot) || 1))
    spec.set(SpecificationItem.UplotSoed, calcUplotnitelSoed(fasad) * (coefList.get(SpecificationItem.UplotSoed) || 1))
    return spec
}


function calcDSP10(fasad: Fasad): number {
    return fasad.Material === FasadMaterial.DSP ? fasad.cutWidth * fasad.cutHeight / 1000000 : 0
}
function calcMirror(fasad: Fasad): number {
    return fasad.Material === FasadMaterial.MIRROR ? fasad.cutWidth * fasad.cutHeight / 1000000 : 0
}
function calcArakal(fasad: Fasad): number {
    return fasad.Material === FasadMaterial.SAND ? fasad.cutWidth * fasad.cutHeight / 1000000 : 0
}
function calcHydro(fasad: Fasad): number {
    return fasad.Material === FasadMaterial.SAND ? 0.035 * fasad.cutWidth * fasad.cutHeight / 1000000 : 0
}
function calcLacobel(fasad: Fasad): number {
    return fasad.Material === FasadMaterial.LACOBELGLASS ? fasad.cutWidth * fasad.cutHeight / 1000000 : 0
}
function calcRitrama(fasad: Fasad): number {
    return fasad.Material === FasadMaterial.LACOBEL ? (fasad.cutHeight + 100) * 1200 / 1000000 : 0
}
function calcArmirovka(fasad: Fasad, tolerance = 5): number {
    if (fasad.Material === FasadMaterial.LACOBEL || fasad.Material === FasadMaterial.DSP) return 0
    let f = Math.floor(fasad.cutWidth / 400)
    const tape400 = f + (fasad.cutWidth - f) * 400 > 205 ? 1 : 0
    f = fasad.cutWidth - tape400 * 400
    f = Math.ceil(f / 200) * 200 < tolerance ? 0 : Math.ceil((f - tolerance) / 200)
    const tape200 = f < 0 ? 0 : f
    return (fasad.cutHeight + 100) * (tape400 * 400 + tape200 * 200) / 1000000
}
function calcFMPPaper(fasad: Fasad, widthLimit = 700): number {
    if (fasad.Material !== FasadMaterial.FMP) return 0
    const sizes = [610, 914, 1067]
    const offset = fasad.cutWidth < widthLimit ? 40 : 50
    const size = sizes.find(s => fasad.cutWidth + offset < s) || sizes[2]
    return (fasad.cutHeight + 100) * size / 1000000
}

function calcFMPGlass(fasad: Fasad): number {
    return (fasad.Material === FasadMaterial.FMP || fasad.Material === FasadMaterial.LACOBEL) ? fasad.cutWidth * fasad.cutHeight / 1000000 : 0
}

function calcPaint(fasad: Fasad): number {
    return fasad.Material === FasadMaterial.FMP ? fasad.cutWidth * fasad.cutHeight / 1000000 * 13.8 * 0.001 : 0
}

function calcEva(fasad: Fasad): number {
    return fasad.Material === FasadMaterial.FMP ? fasad.cutWidth * fasad.cutHeight / 1000000 : 0
}

function calcUplotnitel(fasad: Fasad): number {
    if (fasad.Material === FasadMaterial.DSP) return 0
    const { top, bottom, left, right } = fasad.OuterEdges
    let res = left ? fasad.Height : 0
    res = (right ? fasad.Height : 0) + res
    res = (top ? fasad.Width : 0) + res
    res = (bottom ? fasad.Width : 0) + res
    return res / 1000
}

function calcUplotnitelSoed(fasad: Fasad): number {
    if (fasad.Material === FasadMaterial.DSP) return 0
    const { top, bottom, left, right } = fasad.OuterEdges
    let res = !left ? fasad.Height : 0
    res = (!right ? fasad.Height : 0) + res
    res = (!top ? fasad.Width : 0) + res
    res = (!bottom ? fasad.Width : 0) + res
    return res / 1000
}
function calcProfileSoed(fasad: Fasad): number {
    if (fasad.Children.length === 0) return 0
    let res = (fasad.Children.length - 1) * (fasad.Division === Division.HEIGHT ? fasad.Width : fasad.Height) / 1000
    fasad.Children.forEach((f: Fasad) => res = res + calcProfileSoed(f))
    return res
}
function calcProfileHor(fasad: Fasad): number {
    return (fasad.Width - 13) / 1000
}

function calcProfileVert(fasad: Fasad): number {
    return fasad.Height > 2293 ? 2 : 1
}
function calcStreich(fasad: Fasad): number {
    return 12
}


