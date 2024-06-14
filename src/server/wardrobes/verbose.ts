import { VerboseData } from "../../types/server"
import { SpecificationItem } from "../../types/specification"
import { WardrobeData } from "../../types/wardrobe"
import { materialServiceProvider, specServiceProvider } from "../options"
import { SpecificationService } from "../services/specificationService"
import { getDetailNames, getDetails } from "./functions"

export async function getVerboseDSPData(data: WardrobeData): Promise<VerboseData> {
    const details = await getDetails(data.wardKind, data.width, data.height, data.depth)
    const detailNames = await getDetailNames()
    const result = [["Деталь", "Длина", "Ширина", "Кол-во", "Площадь", ""]]
    let totalArea = 0
    details.forEach(d => {
        const area = d.length * d.width * d.count / 1000000
        const caption = detailNames.find(n => n.name === d.name)?.caption || ""
        result.push([caption, `${d.length}`, `${d.width}`, `${d.count}`, area.toFixed(3), ""])
        totalArea += area
    })
    const specService = new SpecificationService(specServiceProvider, materialServiceProvider)
    const list = await specService.getSpecList()
    const coef = list.data?.find(s => s.name === SpecificationItem.DSP)?.coef || 1
    result.push(["", "", "", "", totalArea.toFixed(3), `x ${coef} = ${(totalArea * coef).toFixed(3)}`])
    return result
}