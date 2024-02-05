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

export function getMaterialList(materials: ExtMaterial[]): Map<string, string>{
    const list = new Map()
    materials.forEach((m: ExtMaterial) => {
            if(!list.has(m.material)) list.set(m.material, []); 
            list.get(m.material).push({name: m.name, imageurl: m.imageurl, code1c: m.code1c}) 
        })
    return list
}
