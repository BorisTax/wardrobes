import { MAT_PURPOSE, Division, FasadMaterial, MaterialGroup } from "../types/enums";
import { ExtMaterial, Profile, ProfileType } from "../types/materials";

export const colors = {
    [FasadMaterial.EMPTY]: "#ff7b00",
    [FasadMaterial.DSP]: "#ff7b00",
    [FasadMaterial.FMP]: "#ff00f2",
    [FasadMaterial.MIRROR]: "#00e1ff",
    [FasadMaterial.LACOBEL]: "#ffc400",
    [FasadMaterial.LACOBELGLASS]: "#fffb00",
    [FasadMaterial.SAND]: "#15ff00"
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

export const Materials: Map<string, string> = new Map()
Materials.set(FasadMaterial.DSP, "ДСП")
Materials.set(FasadMaterial.MIRROR, "ЗЕРКАЛО")
Materials.set(FasadMaterial.LACOBEL, "ЛАКОБЕЛЬ")
Materials.set(FasadMaterial.LACOBELGLASS, "ЛАКОБЕЛЬ(СТЕКЛО)")
Materials.set(FasadMaterial.FMP, "ФМП")
Materials.set(FasadMaterial.SAND, "ПЕСКОСТРУЙ")

export const Profiles: Map<string, string> = new Map()
Profiles.set(ProfileType.STANDART, "СТАНДАРТ")
Profiles.set(ProfileType.BAVARIA, "БАВАРИЯ")

export type MaterialList = Map<string, ExtMaterial[]>
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

export function getMaterialList(materials: ExtMaterial[]): MaterialList {
    const list = new Map<string, ExtMaterial[]>()
    if (!materials) return list
    materials.forEach((m: ExtMaterial) => {
        if (!list.has(m.material)) list.set(m.material, []);
        list.get(m.material)?.push({ name: m.name, material: m.material, image: m.image, code: m.code, purpose: m.purpose })
    })
    return list
}

export function getProfileList(profiles: Profile[]): ProfileList {
    const list = new Map()
    if (!profiles) return list
    profiles.forEach((m: Profile) => {
        if (!list.has(m.name)) list.set(m.name, []);
        list.get(m.name).push({ name: m.name, type: m.type, code: m.code })
    })
    return list
}

export function getInitialMaterialList(): ExtMaterial[] {
    const list: ExtMaterial[] = []
    list.push({ name: "белый110", material: "DSP", image: "", code: "", purpose: MAT_PURPOSE.BOTH })
    return list
}

export function getFasadMaterial(material: string): FasadMaterial {
    switch (material) {
        case FasadMaterial.DSP: return FasadMaterial.DSP
        case FasadMaterial.MIRROR: return FasadMaterial[material]
        case FasadMaterial.LACOBEL: return FasadMaterial[material]
        case FasadMaterial.LACOBELGLASS: return FasadMaterial[material]
        case FasadMaterial.FMP: return FasadMaterial[material]
        case FasadMaterial.SAND: return FasadMaterial[material]
        default: return FasadMaterial.DSP
    }
}
export function getProfileDirection(direction: string): Division {
    switch (direction) {
        case Division.HEIGHT: return Division.HEIGHT
        case Division.WIDTH: return Division.WIDTH
        default: return Division.WIDTH
    }
}

export function existMaterial(name: string, material: string, materialList: ExtMaterial[]): boolean {
    const f = materialList.find((m: ExtMaterial) => m.name === name && m.material === material)
    return !!f
}