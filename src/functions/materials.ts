import { Division, FasadMaterial } from "../types/enums";
import { ExtMaterial, Profile } from "../types/materials";

export const colors = {
    [FasadMaterial.DSP]: "#ff7b00",
    [FasadMaterial.FMP]: "#ff00f2",
    [FasadMaterial.MIRROR]: "#00e1ff",
    [FasadMaterial.LACOBEL]: "#ffc400",
    [FasadMaterial.LACOBELGLASS]: "#fffb00",
    [FasadMaterial.SAND]: "#15ff00"
}

export const Materials: Map<string, string> = new Map()
Materials.set("ДСП", FasadMaterial.DSP)
Materials.set("ЗЕРКАЛО", FasadMaterial.MIRROR)
Materials.set("ЛАКОБЕЛЬ", FasadMaterial.LACOBEL)
Materials.set("ЛАКОБЕЛЬ(СТЕКЛО)", FasadMaterial.LACOBELGLASS)
Materials.set("ФМП", FasadMaterial.FMP)
Materials.set("ПЕСКОСТРУЙ", FasadMaterial.SAND)

export const MaterialCaptions: Map<string, string> = new Map()
MaterialCaptions.set(FasadMaterial.DSP, "ДСП")
MaterialCaptions.set(FasadMaterial.MIRROR, "ЗЕРКАЛО")
MaterialCaptions.set(FasadMaterial.LACOBEL, "ЛАКОБЕЛЬ")
MaterialCaptions.set(FasadMaterial.LACOBELGLASS, "ЛАКОБЕЛЬ(СТЕКЛО)")
MaterialCaptions.set(FasadMaterial.FMP, "ФМП")
MaterialCaptions.set(FasadMaterial.SAND, "ПЕСКОСТРУЙ")

export type MaterialList = Map<string, ExtMaterial[]>
export type ProfileList = Map<string, Profile[]>

export function getMaterialList(materials: ExtMaterial[]): MaterialList {
    const list = new Map()
    if (!materials) return list
    materials.forEach((m: ExtMaterial) => {
        if (!list.has(m.material)) list.set(m.material, []);
        list.get(m.material).push({ name: m.name, material: m.material, imageurl: m.imageurl, code1c: m.code })
    })
    return list
}

export function getProfileList(profiles: Profile[]): ProfileList {
    const list = new Map()
    if (!profiles) return list
    profiles.forEach((m: Profile) => {
        if (!list.has(m.profile)) list.set(m.profile, []);
        list.get(m.profile).push({ name: m.name, profile: m.profile, code: m.code })
    })
    return list
}

export function getInitialMaterialList(): ExtMaterial[] {

    const list: ExtMaterial[] = []
    list.push({ name: "белый", material: "DSP", imageurl: "", code: "" })

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

export function existMaterial(name: string, material: string, materialList: MaterialList): boolean {
    const mat: ExtMaterial[] | undefined = materialList.get(material)
    if (!mat) return false
    const f = mat.find((m: ExtMaterial) => m.name === name)
    return !!f
}