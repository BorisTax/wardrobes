import { VerboseData } from "../../types/server"
import { SpecificationItem } from "../../types/specification"
import { DETAIL_NAME, WardrobeData } from "../../types/wardrobe"
import { getCoef, getDVP, getDVPData, getDetailNames, getDetails, getEdge05, getEdge2, hasEdge05, hasEdge2 } from "./functions"
import { getWardrobe } from "./specifications/corpus"

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
    const coef = await getCoef(SpecificationItem.DSP)
    result.push(["", "", "", "", totalArea.toFixed(3), `x ${coef} = ${(totalArea * coef).toFixed(3)}`])
    return result
}

export async function getVerboseDVPData(data: WardrobeData): Promise<VerboseData>{
    const dvp = await getDVPData(data.width, data.height, data.depth)
    const coef = await getCoef(SpecificationItem.DVP) 
    const area = dvp.dvpLength * dvp.dvpWidth * dvp.dvpCount / 1000000
    const areaCoef = area * coef
    const result = [["", "", ""]]
    result.push(["Расчетные размеры", `${dvp.dvpRealLength}x${dvp.dvpRealWidth} - ${dvp.dvpCount}шт`, ``])
    result.push(["Распиловочные размеры", `${dvp.dvpLength}x${dvp.dvpWidth} - ${dvp.dvpCount}шт`, `${area.toFixed(3)} x ${coef}= ${areaCoef.toFixed(3)}`])
    return result
}


export async function getVerboseEdge2Data(data: WardrobeData): Promise<VerboseData> {
    const details = (await getDetails(data.wardKind, data.width, data.height, data.depth)).filter(d => hasEdge2(d.name))
    const detailNames = await getDetailNames()
    const result = [["Деталь", "Длина", "Ширина", "Кол-во", "Длина кромки", ""]]
    let totalEdge = 0
    details.forEach(d => {
        const edge = d.length * d.count / 1000
        const caption = detailNames.find(n => n.name === d.name)?.caption || ""
        result.push([caption, `${d.length}`, `${d.width}`, `${d.count}`, edge.toFixed(3), ""])
        totalEdge += edge
    })
    const coef = await getCoef(SpecificationItem.Kromka2)
    result.push(["", "", "", "", totalEdge.toFixed(3), `x ${coef} = ${(totalEdge * coef).toFixed(3)}`])
    return result
}

export async function getVerboseEdge05Data(data: WardrobeData): Promise<VerboseData> {
    const details = (await getDetails(data.wardKind, data.width, data.height, data.depth)).filter(d => hasEdge05(d.name))
    const detailNames = await getDetailNames()
    const result = [["Деталь", "Длина", "Ширина", "Кол-во", "Длина кромки", ""]]
    let totalEdge = 0
    details.forEach(d => {
        const edge = (d.name === DETAIL_NAME.ROOF ? d.width * 2 : d.length) * d.count / 1000
        const caption = detailNames.find(n => n.name === d.name)?.caption || ""
        result.push([caption, `${d.length}`, `${d.width}`, `${d.count}`, edge.toFixed(3), ""])
        totalEdge += edge
    })
    const coef = await getCoef(SpecificationItem.Kromka2)
    result.push(["", "", "", "", totalEdge.toFixed(3), `x ${coef} = ${(totalEdge * coef).toFixed(3)}`])
    return result
}

export async function getVerboseGlueData(data: WardrobeData): Promise<VerboseData>{
    const details = await getDetails(data.wardKind, data.width, data.height, data.depth)
    const edge2=getEdge2(details)
    const edge05=getEdge05(details)
    const glue = (edge2 + edge05) * 0.008
    const result = [["Кромка 2мм", "Кромка 0.45мм", "Итого", "Клей"]]
    result.push([edge2.toFixed(3), edge05.toFixed(3), (edge2 + edge05).toFixed(3), `x 0.008 = ${glue.toFixed(3)}`])
    return result
}