import Fasad from "../../../classes/Fasad";
import { getFasadHeight, getFasadWidth } from "../../../functions/wardrobe";
import { FasadMaterial } from "../../../types/enums";
import { ProfileType } from "../../../types/materials";
import { WardrobeData } from "../../../types/wardrobe";

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

