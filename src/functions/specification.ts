import FasadState from "../classes/FasadState";
import { Division, FasadMaterial, SpecificationItem } from "../types/enums";
import { ProfileType } from "../types/materials";

export function getSpecificationPattern(): Map<SpecificationItem, number> {
    const spec = new Map<SpecificationItem, number>()
    Object.keys(SpecificationItem).forEach(k => { spec.set(k as SpecificationItem, 0) })
    return spec
}

export function getTotalSpecification(fasad: FasadState, profileType: ProfileType): Map<SpecificationItem, number> {
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

function combineSpecifications(fasad: FasadState): Map<SpecificationItem, number> {
    if (fasad.children.length > 0) {
        const spec: Map<SpecificationItem, number> = getSpecificationPattern()
        fasad.children.forEach((f: FasadState) => {
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

function calcSpecification(fasad: FasadState): Map<SpecificationItem, number> {
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


function calcDSP(fasad: FasadState): number {
    return fasad.material === FasadMaterial.DSP ? fasad.width * fasad.height / 1000000 : 0
}
function calcMirror(fasad: FasadState): number {
    return fasad.material === FasadMaterial.MIRROR ? (fasad.width - 3) * (fasad.height - 3) / 1000000 : 0
}
function calcArakal(fasad: FasadState): number {
    return fasad.material === FasadMaterial.SAND ? (fasad.width - 3) * (fasad.height - 3) / 1000000 : 0
}
function calcHydro(fasad: FasadState): number {
    return fasad.material === FasadMaterial.SAND ? 0.035 * (fasad.width - 3) * (fasad.height - 3) / 1000000 : 0
}
function calcLacobel(fasad: FasadState): number {
    return fasad.material === FasadMaterial.LACOBELGLASS ? (fasad.width - 3) * (fasad.height - 3) / 1000000 : 0
}
function calcRitrama(fasad: FasadState): number {
    return fasad.material === FasadMaterial.LACOBEL ? ((fasad.height - 3) + 100) * 1200 / 1000000 : 0
}
function calcArmirovka(fasad: FasadState, tolerance = 5): number {
    if (fasad.material === FasadMaterial.LACOBEL || fasad.material === FasadMaterial.DSP) return 0
    let f = Math.floor((fasad.width - 3) / 400)
    const tape400 = f + ((fasad.width - 3) - f) * 400 > 205 ? 1 : 0
    f = fasad.width - tape400 * 400
    f = Math.ceil(f / 200) * 200 < tolerance ? 0 : Math.ceil((f - tolerance) / 200)
    const tape200 = f < 0 ? 0 : f
    return ((fasad.height - 3) + 100) * (tape400 * 400 + tape200 * 200) / 1000000
}
function calcFMPPaper(fasad: FasadState, widthLimit = 700): number {
    if (fasad.material !== FasadMaterial.FMP) return 0
    const sizes = [610, 914, 1067]
    const offset = (fasad.width - 3) < widthLimit ? 40 : 50
    const size = sizes.find(s => (fasad.width - 3) + offset < s) || sizes[2]
    return ((fasad.height - 3) + 100) * size / 1000000
}

function calcFMPGlass(fasad: FasadState): number {
    return (fasad.material === FasadMaterial.FMP || fasad.material === FasadMaterial.LACOBEL) ? (fasad.width - 3) * (fasad.height - 3) / 1000000 : 0
}

function calcPaint(fasad: FasadState): number {
    return fasad.material === FasadMaterial.FMP ? (fasad.width - 3) * (fasad.height - 3) / 1000000 * 13.8 * 0.001 : 0
}

function calcEva(fasad: FasadState): number {
    return fasad.material === FasadMaterial.FMP ? (fasad.width - 3) * (fasad.height - 3) / 1000000 : 0
}

function calcUplotnitel(fasad: FasadState): number {
    if (fasad.material === FasadMaterial.DSP) return 0
    const { top, bottom, left, right } = fasad.outerEdges
    let res = left ? fasad.height : 0
    res = (right ? fasad.height : 0) + res
    res = (top ? fasad.width : 0) + res
    res = (bottom ? fasad.width : 0) + res
    return res / 1000
}

function calcUplotnitelSoed(fasad: FasadState): number {
    if (fasad.material === FasadMaterial.DSP) return 0
    const { top, bottom, left, right } = fasad.outerEdges
    let res = !left ? fasad.height : 0
    res = (!right ? fasad.height : 0) + res
    res = (!top ? fasad.width : 0) + res
    res = (!bottom ? fasad.width : 0) + res
    return res / 1000
}
function calcProfileSoed(fasad: FasadState): number {
    if (fasad.children.length === 0) return 0
    let res = (fasad.children.length - 1) * (fasad.division === Division.HEIGHT ? fasad.width : fasad.height) / 1000
    fasad.children.forEach((f: FasadState) => res = res + calcProfileSoed(f))
    return res
}
function calcProfileHor(fasad: FasadState): number {
    return (fasad.width - 13) / 1000
}

function calcProfileVert(fasad: FasadState): number {
    return fasad.height > 2293 ? 2 : 1
}
function calcStreich(fasad: FasadState): number {
    return 12
}

