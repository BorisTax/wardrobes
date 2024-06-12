import { getSpecificationPattern } from "../../../functions/specification"
import { SpecificationItem } from "../../../types/specification"
import { DVPData, Detail, WARDROBE_KIND } from "../../../types/wardrobe"
import { ProfileType } from "../../../types/materials"
import { IWardrobe, WardrobeData } from "../../../types/wardrobe"
import StandartWardrobe from "../standart"

export function getCorpusSpecification(wardrobe: IWardrobe, dvpData: DVPData, profileType: ProfileType, coefList: Map<SpecificationItem, number>): Map<SpecificationItem, number> {
    const spec = getSpecificationPattern()
    const truba = wardrobe.getTruba()
    const trempel = wardrobe.getTrempel()
    spec.set(SpecificationItem.DSP, wardrobe.getDSP() * (coefList.get(SpecificationItem.DSP) || 1))
    spec.set(SpecificationItem.DVP, (dvpData.dvpLength * dvpData.dvpWidth * dvpData.dvpCount / 1000000) * (coefList.get(SpecificationItem.DVP) || 1))
    spec.set(SpecificationItem.Kromka2, wardrobe.getEdge2() * (coefList.get(SpecificationItem.Kromka2) || 1))
    spec.set(SpecificationItem.Kromka05, wardrobe.getEdge05() * (coefList.get(SpecificationItem.Kromka05) || 1))
    spec.set(SpecificationItem.Confirmat, wardrobe.getConfirmat() * (coefList.get(SpecificationItem.Confirmat) || 1))
    spec.set(SpecificationItem.ZagConfirmat, wardrobe.getConfirmat() * (coefList.get(SpecificationItem.ZagConfirmat) || 1))
    spec.set(SpecificationItem.Minifix, wardrobe.getMinifix() * (coefList.get(SpecificationItem.Minifix) || 1))
    spec.set(SpecificationItem.ZagMinifix, wardrobe.getMinifix() * (coefList.get(SpecificationItem.ZagMinifix) || 1))
    spec.set(SpecificationItem.Glue, wardrobe.getGlue() * (coefList.get(SpecificationItem.Glue) || 1))
    spec.set(SpecificationItem.Planka, wardrobe.getDVPPlanka() * (coefList.get(SpecificationItem.Planka) || 1))
    spec.set(SpecificationItem.Leg, wardrobe.getLegs() * (coefList.get(SpecificationItem.Leg) || 1))
    spec.set(SpecificationItem.Karton, wardrobe.getKarton() * (coefList.get(SpecificationItem.Karton) || 1))
    spec.set(SpecificationItem.Skotch, wardrobe.getKarton() *20* (coefList.get(SpecificationItem.Skotch) || 1))
    spec.set(SpecificationItem.NapravTop, wardrobe.getNaprav()* (coefList.get(SpecificationItem.NapravTop) || 1))
    spec.set(SpecificationItem.NapravBottom, wardrobe.getNaprav()* (coefList.get(SpecificationItem.NapravBottom) || 1))
    spec.set(SpecificationItem.Samorez16, wardrobe.getSamorez16()* (coefList.get(SpecificationItem.Samorez16) || 1))
    spec.set(SpecificationItem.StyagkaM6, wardrobe.getStyagka()* (coefList.get(SpecificationItem.StyagkaM6) || 1))
    spec.set(SpecificationItem.NapravTop, truba.length * truba.count* (coefList.get(SpecificationItem.Truba) || 1))
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