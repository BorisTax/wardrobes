import { getSpecificationPattern } from "../../../functions/specification"
import { SpecificationItem } from "../../../types/specification"
import { Detail, WARDROBE_KIND, WardrobeIntermediateData } from "../../../types/wardrobe"
import { ProfileType } from "../../../types/materials"
import { IWardrobe, WardrobeData } from "../../../types/wardrobe"
import StandartWardrobe from "../standart"
import { getConfirmat, getDVPPlanka, getEdge05, getEdge2, getGlue, getLegs, getMinifix } from "../functions"

export function getCorpusSpecification(wardrobe: IWardrobe, intermediteData: WardrobeIntermediateData, profileType: ProfileType, coefList: Map<SpecificationItem, number>): Map<SpecificationItem, number> {
    const spec = getSpecificationPattern()
    const { details, dvpData, legs } = intermediteData
      const truba = wardrobe.getTruba()
    const trempel = wardrobe.getTrempel()
    spec.set(SpecificationItem.DSP, wardrobe.getDSP() * (coefList.get(SpecificationItem.DSP) || 1))
    spec.set(SpecificationItem.DVP, (dvpData.dvpLength * dvpData.dvpWidth * dvpData.dvpCount / 1000000) * (coefList.get(SpecificationItem.DVP) || 1))
    spec.set(SpecificationItem.Kromka2, getEdge2(details) * (coefList.get(SpecificationItem.Kromka2) || 1))
    spec.set(SpecificationItem.Kromka05, getEdge05(details) * (coefList.get(SpecificationItem.Kromka05) || 1))
    spec.set(SpecificationItem.Confirmat, getConfirmat(details) * (coefList.get(SpecificationItem.Confirmat) || 1))
    spec.set(SpecificationItem.ZagConfirmat, getConfirmat(details) * (coefList.get(SpecificationItem.ZagConfirmat) || 1))
    spec.set(SpecificationItem.Minifix, getMinifix(details) * (coefList.get(SpecificationItem.Minifix) || 1))
    spec.set(SpecificationItem.ZagMinifix, getMinifix(details) * (coefList.get(SpecificationItem.ZagMinifix) || 1))
    spec.set(SpecificationItem.Glue, getGlue(details, coefList.get(SpecificationItem.Kromka2) || 1, coefList.get(SpecificationItem.Kromka05) || 1) * (coefList.get(SpecificationItem.Glue) || 1))
    spec.set(SpecificationItem.Planka, getDVPPlanka(dvpData) * (coefList.get(SpecificationItem.Planka) || 1))
    spec.set(SpecificationItem.Leg, legs * (coefList.get(SpecificationItem.Leg) || 1))
    spec.set(SpecificationItem.Karton, wardrobe.getKarton() * (coefList.get(SpecificationItem.Karton) || 1))
    spec.set(SpecificationItem.Skotch, wardrobe.getKarton() * 20 * (coefList.get(SpecificationItem.Skotch) || 1))
    spec.set(SpecificationItem.NapravTop, wardrobe.getNaprav() * (coefList.get(SpecificationItem.NapravTop) || 1))
    spec.set(SpecificationItem.NapravBottom, wardrobe.getNaprav() * (coefList.get(SpecificationItem.NapravBottom) || 1))
    spec.set(SpecificationItem.Samorez16, wardrobe.getSamorez16() * (coefList.get(SpecificationItem.Samorez16) || 1))
    spec.set(SpecificationItem.StyagkaM6, wardrobe.getStyagka() * (coefList.get(SpecificationItem.StyagkaM6) || 1))
    spec.set(SpecificationItem.NapravTop, truba.length * truba.count * (coefList.get(SpecificationItem.Truba) || 1))
    if (trempel.length === 250)
        spec.set(SpecificationItem.Trempel250, trempel.count * (coefList.get(SpecificationItem.Trempel250) || 1));
    else
        spec.set(SpecificationItem.Trempel300, trempel.count * (coefList.get(SpecificationItem.Trempel300) || 1))

    spec.set(SpecificationItem.Streich, 12)
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