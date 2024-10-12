import { MAT_PURPOSE, Division, FASAD_TYPE, MaterialGroup } from "../types/enums";
import { FasadMaterial, Profile, ProfileType } from "../types/materials";

export const colors = {
    [FASAD_TYPE.EMPTY]: "#ff7b00",
    [FASAD_TYPE.DSP]: "#ff7b00",
    [FASAD_TYPE.FMP]: "#ff00f2",
    [FASAD_TYPE.MIRROR]: "#00e1ff",
    [FASAD_TYPE.LACOBEL]: "#ffc400",
    [FASAD_TYPE.LACOBELGLASS]: "#fffb00",
    [FASAD_TYPE.SAND]: "#15ff00"
}

export const MaterialGroupCaptions: Map<string, string> = new Map()
MaterialGroupCaptions.set(MaterialGroup.PLATE, "Площадные")
MaterialGroupCaptions.set(MaterialGroup.EDGE, "Кромка")
MaterialGroupCaptions.set(MaterialGroup.ZAGLUSHKI, "Заглушки")
MaterialGroupCaptions.set(MaterialGroup.DSP_EDGE_ZAGL, "Соответствие с ДСП")
MaterialGroupCaptions.set(MaterialGroup.PROFILE, "Профиля")
MaterialGroupCaptions.set(MaterialGroup.BRUSH, "Щетки")
MaterialGroupCaptions.set(MaterialGroup.TREMPEL, "Тремпеля")
MaterialGroupCaptions.set(MaterialGroup.UPLOTNITEL, "Уплотнители")

export const MATPurpose: Map<MAT_PURPOSE, string> = new Map()
MATPurpose.set(MAT_PURPOSE.FASAD, "Фасад")
MATPurpose.set(MAT_PURPOSE.CORPUS, "Корпус")
MATPurpose.set(MAT_PURPOSE.BOTH, "Фасад и корпус")

// export const Materials: Map<string, string> = new Map()
// Materials.set(FASAD_TYPE.DSP, "ДСП")
// Materials.set(FASAD_TYPE.MIRROR, "ЗЕРКАЛО")
// Materials.set(FASAD_TYPE.LACOBEL, "ЛАКОБЕЛЬ")
// Materials.set(FASAD_TYPE.LACOBELGLASS, "ЛАКОБЕЛЬ(СТЕКЛО)")
// Materials.set(FASAD_TYPE.FMP, "ФМП")
// Materials.set(FASAD_TYPE.SAND, "ПЕСКОСТРУЙ")

export const Profiles: Map<ProfileType, string> = new Map()
Profiles.set(ProfileType.STANDART, "СТАНДАРТ")
Profiles.set(ProfileType.BAVARIA, "БАВАРИЯ")

// export type MaterialList = Map<string, FasadMaterial[]>
export type ProfileList = Map<string, Profile[]>

export const UnitCaptions: Map<string, string> = new Map()
UnitCaptions.set("meters", "м")
UnitCaptions.set("meters2", "м2")
UnitCaptions.set("litres", "литр")
UnitCaptions.set("sheets", "лист")
UnitCaptions.set("piece", "шт")
UnitCaptions.set("kg", "кг")
UnitCaptions.set("comp", "компл")

export function getMATPurpose(purpose: string): MAT_PURPOSE {
    let result: MAT_PURPOSE = MAT_PURPOSE.BOTH
    MATPurpose.forEach((v, k) => {
        if (v === purpose) result = k
    })
    return result
}

export function getPurpose(fasad: boolean, corpus: boolean): MAT_PURPOSE {
    if (fasad && corpus) return MAT_PURPOSE.BOTH
    if (corpus) return MAT_PURPOSE.CORPUS
    return MAT_PURPOSE.FASAD
}

// export function getMaterialList(materials: FasadMaterial[]): MaterialList {
//     const list = new Map<string, FasadMaterial[]>()
//     if (!materials) return list
//     materials.forEach((m: FasadMaterial) => {
//         if (!list.has(m.type)) list.set(m.type, []);
//         list.get(m.type)?.push({ name: m.name, type: m.type, image: m.image, code: m.code, purpose: m.purpose })
//     })
//     return list
// }

// export function getProfileList(profiles: Profile[]): ProfileList {
//     const list = new Map()
//     if (!profiles) return list
//     profiles.forEach((m: Profile) => {
//         if (!list.has(m.name)) list.set(m.name, []);
//         list.get(m.name).push({ name: m.name, type: m.type, code: m.code })
//     })
//     return list
// }

// export function getInitialMaterialList(): FasadMaterial[] {
//     const list: FasadMaterial[] = []
//     list.push({ name: "белый110", type: "DSP", image: "", code: "", purpose: MAT_PURPOSE.BOTH })
//     return list
// }

// export function getFasadMaterial(material: string): FASAD_TYPE {
//     switch (material) {
//         case FASAD_TYPE.DSP: return FASAD_TYPE.DSP
//         case FASAD_TYPE.MIRROR: return FASAD_TYPE[material]
//         case FASAD_TYPE.LACOBEL: return FASAD_TYPE[material]
//         case FASAD_TYPE.LACOBELGLASS: return FASAD_TYPE[material]
//         case FASAD_TYPE.FMP: return FASAD_TYPE[material]
//         case FASAD_TYPE.SAND: return FASAD_TYPE[material]
//         default: return FASAD_TYPE.DSP
//     }
// }

export function getProfileDirection(direction: string): Division {
    switch (direction) {
        case Division.HEIGHT: return Division.HEIGHT
        case Division.WIDTH: return Division.WIDTH
        default: return Division.WIDTH
    }
}

export function existMaterial(name: string, material: string, materialList: FasadMaterial[]): boolean {
    const f = materialList.find((m: FasadMaterial) => m.name === name && m.type === material)
    return !!f
}