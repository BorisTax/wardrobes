import { WardrobeDetailSchema } from "../../types/schemas"
import { VerboseData } from "../../types/server"
import { SpecificationItem } from "../../types/specification"
import { DETAIL_NAME, WARDROBE_KIND, WardrobeData } from "../../types/wardrobe"
import { materialServiceProvider, specServiceProvider } from "../options"
import { SpecificationService } from "../services/specificationService"
import { getCoef, getDVPData, getDetailNames, getDetails, getEdge05, getEdge2, getLegs, hasEdge05, hasEdge2 } from "./functions"

export async function getVerboseDSPData(data: WardrobeData): Promise<VerboseData> {
    const details = await getDetails(data.wardKind, data.width, data.height, data.depth)
    const detailNames = await getDetailNames()
    const result = [{data: ["Деталь", "Длина", "Ширина", "Кол-во", "Площадь", ""], active: false}]
    let totalArea = 0
    details.forEach(d => {
        const area = d.length * d.width * d.count / 1000000
        const caption = detailNames.find(n => n.name === d.name)?.caption || ""
        result.push({data: [caption, `${d.length}`, `${d.width}`, `${d.count}`, area.toFixed(3), ""], active: false})
        totalArea += area
    })
    const coef = await getCoef(SpecificationItem.DSP)
    result.push({ data: ["", "", "", "", totalArea.toFixed(3), `x ${coef} = ${(totalArea * coef).toFixed(3)}`], active: false })
    return result
}

export async function getVerboseDVPData(data: WardrobeData): Promise<VerboseData>{
    const dvp = await getDVPData(data.width, data.height, data.depth)
    const coef = await getCoef(SpecificationItem.DVP) 
    const area = dvp.dvpLength * dvp.dvpWidth * dvp.dvpCount / 1000000
    const areaCoef = area * coef
    const result = [{data: ["", "", ""], active: false}]
    result.push({data: ["Расчетные размеры", `${dvp.dvpRealLength}x${dvp.dvpRealWidth} - ${dvp.dvpCount}шт`, ``], active: false})
    result.push({data: ["Распиловочные размеры", `${dvp.dvpLength}x${dvp.dvpWidth} - ${dvp.dvpCount}шт`, `${area.toFixed(3)} x ${coef}= ${areaCoef.toFixed(3)}`], active: false})
    return result
}


export async function getVerboseEdge2Data(data: WardrobeData): Promise<VerboseData> {
    const details = (await getDetails(data.wardKind, data.width, data.height, data.depth)).filter(d => hasEdge2(d.name))
    const detailNames = await getDetailNames()
    const result = [{data: ["Деталь", "Длина", "Ширина", "Кол-во", "Длина кромки", ""], active: false}]
    let totalEdge = 0
    details.forEach(d => {
        const edge = d.length * d.count / 1000
        const caption = detailNames.find(n => n.name === d.name)?.caption || ""
        result.push({data: [caption, `${d.length}`, `${d.width}`, `${d.count}`, edge.toFixed(3), ""], active: false})
        totalEdge += edge
    })
    const coef = await getCoef(SpecificationItem.Kromka2)
    result.push({data: ["", "", "", "", totalEdge.toFixed(3), `x ${coef} = ${(totalEdge * coef).toFixed(3)}`], active: false})
    return result
}

export async function getVerboseEdge05Data(data: WardrobeData): Promise<VerboseData> {
    const details = (await getDetails(data.wardKind, data.width, data.height, data.depth)).filter(d => hasEdge05(d.name))
    const detailNames = await getDetailNames()
    const result = [{data: ["Деталь", "Длина", "Ширина", "Кол-во", "Длина кромки", ""], active: false}]
    let totalEdge = 0
    details.forEach(d => {
        const edge = (d.name === DETAIL_NAME.ROOF ? d.width * 2 : d.length) * d.count / 1000
        const caption = detailNames.find(n => n.name === d.name)?.caption || ""
        result.push({data: [caption, `${d.length}`, `${d.width}`, `${d.count}`, edge.toFixed(3), ""], active: false})
        totalEdge += edge
    })
    const coef = await getCoef(SpecificationItem.Kromka2)
    result.push({data: ["", "", "", "", totalEdge.toFixed(3), `x ${coef} = ${(totalEdge * coef).toFixed(3)}`], active: false})
    return result
}

export async function getVerboseGlueData(data: WardrobeData): Promise<VerboseData> {
    const details = await getDetails(data.wardKind, data.width, data.height, data.depth)
    const coef2 = await getCoef(SpecificationItem.Kromka2)
    const coef05 = await getCoef(SpecificationItem.Kromka05)
    const coefGlue = await getCoef(SpecificationItem.Glue)
    const edge2 = getEdge2(details) * coef2
    const edge05 = getEdge05(details) * coef05
    const glue = (edge2 + edge05) * coefGlue * 0.008
    const result = [{data: ["Кромка 2мм", "Кромка 0.45мм", "Итого", "Клей"], active: false}]
    result.push({data: [edge2.toFixed(3), edge05.toFixed(3), (edge2 + edge05).toFixed(3), `x 0.008 = ${glue.toFixed(3)}`], active: false})
    return result
}

export async function getVerboseLegData(data: WardrobeData): Promise<VerboseData> {
    const service = new SpecificationService(specServiceProvider, materialServiceProvider)
    const legs = (await service.getFurnitureTable({ kind: data.wardKind, item: SpecificationItem.Leg })).data || []
    const caption = await getWardrobeKind(data.wardKind)
    const current = await getLegs(data)
    const result = [{ data: [caption, ""], active: false }]
    result.push({ data: ["Ширина", "Кол-во"], active: false })
    legs.forEach(l => {
        result.push({ data: [`${l.minwidth}-${l.maxwidth}`, `${l.count}`], active: current === l.count })
    })
    return result
}

export async function getWardrobeKind(kind: WARDROBE_KIND): Promise<string>{
    const service = new SpecificationService(specServiceProvider, materialServiceProvider)
    const wardkinds = (await service.getWardobeKinds()).data as WardrobeDetailSchema[]
    const caption = wardkinds.find(w => w.name === kind)?.caption
    return caption || ""
}