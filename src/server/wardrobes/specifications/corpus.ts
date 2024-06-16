import { getSpecificationPattern } from "../../../functions/specification"
import { SpecificationItem } from "../../../types/specification"
import { Detail, SpecificationResultItem, WARDROBE_KIND, WardrobeIntermediateData } from "../../../types/wardrobe"
import { ProfileType } from "../../../types/materials"
import { IWardrobe, WardrobeData } from "../../../types/wardrobe"
import StandartWardrobe from "../standart"
import { getConfirmat, getDSP, getDVP, getDVPPlanka, getEdge05, getEdge2, getGlue, getKarton, getLegs, getMinifix, getNails } from "../functions"

export async function getCorpusSpecification(wardrobe: IWardrobe, data: WardrobeData, profileType: ProfileType, coefList: Map<SpecificationItem, number>): Promise<Map<SpecificationItem, SpecificationResultItem>> {
    const spec = getSpecificationPattern()
    //const { details, dsp, dvpData, legs, karton } = intermediateData
    const truba = wardrobe.getTruba()
    const trempel = wardrobe.getTrempel()
    const confirmat = (await getConfirmat(data)).amount
    const minifix = (await getMinifix(data)).amount
    const karton = (await getKarton(data)).amount
    spec.set(SpecificationItem.DSP, { amount: (await getDSP(data)).amount })
    spec.set(SpecificationItem.DVP, { amount: (await getDVP(data)).amount })
    spec.set(SpecificationItem.Kromka2, { amount: (await getEdge2(data)).amount })
    spec.set(SpecificationItem.Kromka05, { amount: (await getEdge05(data)).amount })
    spec.set(SpecificationItem.Confirmat, { amount: confirmat })
    spec.set(SpecificationItem.ZagConfirmat, { amount: confirmat })
    spec.set(SpecificationItem.Minifix, { amount: minifix })
    spec.set(SpecificationItem.ZagMinifix, { amount: minifix })
    spec.set(SpecificationItem.Glue, { amount: (await getGlue(data)).amount })
    spec.set(SpecificationItem.Planka, { amount: (await getDVPPlanka(data)).amount })
    spec.set(SpecificationItem.Leg, { amount: (await getLegs(data)).amount })
    spec.set(SpecificationItem.Karton, { amount: karton })
    spec.set(SpecificationItem.Skotch, { amount: karton * 20 * (coefList.get(SpecificationItem.Skotch) || 1) })
    spec.set(SpecificationItem.Nails, { amount: (await getNails(data)).amount })
    spec.set(SpecificationItem.NapravTop, { amount: wardrobe.getNaprav() * (coefList.get(SpecificationItem.NapravTop) || 1) })
    spec.set(SpecificationItem.NapravBottom, { amount: wardrobe.getNaprav() * (coefList.get(SpecificationItem.NapravBottom) || 1) })
    spec.set(SpecificationItem.Samorez16, { amount: wardrobe.getSamorez16() * (coefList.get(SpecificationItem.Samorez16) || 1) })
    spec.set(SpecificationItem.StyagkaM6, { amount: wardrobe.getStyagka() * (coefList.get(SpecificationItem.StyagkaM6) || 1) })
    spec.set(SpecificationItem.NapravTop, { amount: truba.length * truba.count * (coefList.get(SpecificationItem.Truba) || 1) })
    if (trempel.length === 250)
        spec.set(SpecificationItem.Trempel250, { amount: trempel.count * (coefList.get(SpecificationItem.Trempel250) || 1) });
    else
        spec.set(SpecificationItem.Trempel300, { amount: trempel.count * (coefList.get(SpecificationItem.Trempel300) || 1) })

    spec.set(SpecificationItem.Streich, { amount: 12 })
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