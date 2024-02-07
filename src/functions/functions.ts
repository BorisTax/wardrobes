import { MaterialList } from "../atoms/materials"
import { usedUrl } from "../options"
import { Division, FasadMaterial } from "../types/enums"
import { ExtMaterial } from "../types/materials"

export function isMobile(): boolean {
    return (navigator.maxTouchPoints > 1)
}

export function createToolTip() {
    const toolTip = document.createElement("span")
    toolTip.id = "tooltip"
    toolTip.style.position = "absolute"
    toolTip.style.border = "1px solid black"
    toolTip.style.padding = "0.5em"
    toolTip.style.backgroundColor = "white"
    toolTip.style.display = "none"
    return toolTip
}

export function getMaterialList(materials: ExtMaterial[]): MaterialList {
    const list = new Map()
    materials.forEach((m: ExtMaterial) => {
        if (!list.has(m.material)) list.set(m.material, []);
        list.get(m.material).push({ name: m.name, imageurl: m.imageurl, code1c: m.code1c })
    })
    return list
}

export function getInitialMaterialList(): ExtMaterial[] {

    const list: ExtMaterial[] = []
    list.push({name: "белый", material: "DSP", imageurl:"", code1c:""})

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

export function fetchData(url: string, body: string) {
    return fetch(usedUrl + url, { method: "POST", headers: { "Content-Type": "application/json" }, body }).then(r => r.json())
}