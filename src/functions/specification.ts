import Fasad from "../classes/Fasad";
import { Division, FasadMaterial, SpecificationItem } from "../types/enums";
import { ProfileType } from "../server/types/materials";

export function getSpecificationPattern(): Map<SpecificationItem, number> {
    const spec = new Map<SpecificationItem, number>()
    Object.keys(SpecificationItem).forEach(k => { spec.set(k as SpecificationItem, 0) })
    return spec
}

export function getTotalSpecification(fasad: Fasad, profileType: ProfileType): Map<SpecificationItem, number> {
    const spec = combineSpecifications(fasad)
    if (profileType === ProfileType.STANDART) {
        const uplot = spec.get(SpecificationItem.Uplot) || 0
        const uplotSoed = spec.get(SpecificationItem.UplotSoed) || 0
        spec.set(SpecificationItem.Uplot, uplot + uplotSoed)
        spec.set(SpecificationItem.UplotSoed, 0)
    }
    spec.set(SpecificationItem.ProfileSoedStandart, profileType === ProfileType.STANDART ? calcProfileSoed(fasad) : 0)
    spec.set(SpecificationItem.ProfileVertStandart, profileType === ProfileType.STANDART ? calcProfileVert(fasad) : 0)
    spec.set(SpecificationItem.ProfileHorTopStandart, profileType === ProfileType.STANDART ? calcProfileHor(fasad) : 0)
    spec.set(SpecificationItem.ProfileHorBottomStandart, profileType === ProfileType.STANDART ? calcProfileHor(fasad) : 0)
    spec.set(SpecificationItem.ProfileSoedBavaria, profileType === ProfileType.BAVARIA ? calcProfileSoed(fasad) : 0)
    spec.set(SpecificationItem.ProfileVertBavaria, profileType === ProfileType.BAVARIA ? calcProfileVert(fasad) : 0)
    spec.set(SpecificationItem.ProfileHorTopBavaria, profileType === ProfileType.BAVARIA ? calcProfileHor(fasad) : 0)
    spec.set(SpecificationItem.ProfileHorBottomBavaria, profileType === ProfileType.BAVARIA ? calcProfileHor(fasad) : 0)
    spec.set(SpecificationItem.Streich, 12)
    spec.set(SpecificationItem.Roliki, profileType === ProfileType.STANDART ? 1 : 0)
    spec.set(SpecificationItem.RolikiBavaria, profileType === ProfileType.BAVARIA ? 1 : 0)
    spec.set(SpecificationItem.Karton, 0.25)
    spec.set(SpecificationItem.Skotch, 5)
    return spec
}

function combineSpecifications(fasad: Fasad): Map<SpecificationItem, number> {
    if (fasad.Children.length > 0) {
        const spec: Map<SpecificationItem, number> = getSpecificationPattern()
        fasad.Children.forEach((f: Fasad) => {
            const s = combineSpecifications(f)
            s.forEach((value, key) => {
                const prev = spec.get(key) || 0
                spec.set(key, prev + value)
            })
        })
        return spec
    }
    return calcSpecification(fasad)
}

function calcSpecification(fasad: Fasad): Map<SpecificationItem, number> {
    const spec = getSpecificationPattern()
    spec.set(SpecificationItem.DSP, calcDSP(fasad))
    spec.set(SpecificationItem.Mirror, calcMirror(fasad))
    spec.set(SpecificationItem.Arakal, calcArakal(fasad))
    spec.set(SpecificationItem.Hydro, calcHydro(fasad))
    spec.set(SpecificationItem.Lacobel, calcLacobel(fasad))
    spec.set(SpecificationItem.Ritrama, calcRitrama(fasad))
    spec.set(SpecificationItem.Armirovka, calcArmirovka(fasad))
    spec.set(SpecificationItem.FMPPaper, calcFMPPaper(fasad))
    spec.set(SpecificationItem.FMPGlass, calcFMPGlass(fasad))
    spec.set(SpecificationItem.Paint, calcPaint(fasad))
    spec.set(SpecificationItem.EVA, calcEva(fasad))
    spec.set(SpecificationItem.Uplot, calcUplotnitel(fasad))
    spec.set(SpecificationItem.UplotSoed, calcUplotnitelSoed(fasad))
    return spec
}


function calcDSP(fasad: Fasad): number {
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

