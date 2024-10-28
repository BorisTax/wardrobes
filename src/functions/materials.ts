import { CHAR_PURPOSE, Division } from "../types/enums";





export function getPurpose(fasad: boolean, corpus: boolean): CHAR_PURPOSE {
    if (fasad && corpus) return CHAR_PURPOSE.BOTH
    if (corpus) return CHAR_PURPOSE.CORPUS
    return CHAR_PURPOSE.FASAD
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

// export function existMaterial(name: string, material: string, materialList: FasadMaterial[]): boolean {
//     const f = materialList.find((m: FasadMaterial) => m.name === name && m.type === material)
//     return !!f
// }