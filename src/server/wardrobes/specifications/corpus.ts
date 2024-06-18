import { getSpecificationPattern } from "./fasades"
import { SpecificationItem } from "../../../types/specification"
import { Detail, FullData, WARDROBE_KIND } from "../../../types/wardrobe"
import { Profile, ProfileType } from "../../../types/materials"
import { IWardrobe, WardrobeData } from "../../../types/wardrobe"
import StandartWardrobe from "../standart"
import { getConfirmat, getDSP, getDVP, getDVPPlanka, getEdge05, getEdge2, getGlue, getKarton, getLegs, getMinifix, getNails } from "../functions"

export async function getCorpusSpecification(wardrobe: IWardrobe, data: WardrobeData, profile: Profile): Promise<Map<SpecificationItem, FullData[]>> {
    const spec = getSpecificationPattern()
    //const { details, dsp, dvpData, legs, karton } = intermediateData
    const truba = wardrobe.getTruba()
    const trempel = wardrobe.getTrempel()
    const confirmat = [await getConfirmat(data)]
    const minifix = [await getMinifix(data)]
    const karton = [await getKarton(data)]
    spec.set(SpecificationItem.DSP, [await getDSP(data)])
    spec.set(SpecificationItem.DVP, [await getDVP(data)])
    spec.set(SpecificationItem.Kromka2, [await getEdge2(data)])
    spec.set(SpecificationItem.Kromka05, [await getEdge05(data)])
    spec.set(SpecificationItem.Confirmat, confirmat)
    spec.set(SpecificationItem.ZagConfirmat, confirmat)
    spec.set(SpecificationItem.Minifix, minifix)
    spec.set(SpecificationItem.ZagMinifix, minifix)
    spec.set(SpecificationItem.Glue, [await getGlue(data)])
    spec.set(SpecificationItem.Planka, [await getDVPPlanka(data)])
    spec.set(SpecificationItem.Leg, [await getLegs(data)])
    spec.set(SpecificationItem.Karton, karton)
    spec.set(SpecificationItem.Skotch, [{ data: { amount: karton[0].data.amount * 20 } }])
    spec.set(SpecificationItem.Nails, [await getNails(data)])
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