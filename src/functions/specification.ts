import { FASAD_TYPE } from "../types/enums";
import { SpecSchema } from "../types/server";
import { CORPUS_SPECS } from "../types/specification";
import { SpecItem } from "../types/specification";
import { FullData, SpecificationMultiResult, SpecResultItem } from "../types/wardrobe";

export function getInitSpecification(): SpecificationMultiResult {
    return [
        { type: CORPUS_SPECS.CORPUS, spec: [] },
        // { type: FASAD_TYPE.DSP, spec: [] },
        // { type: FASAD_TYPE.MIRROR, spec: [] },
        // { type: FASAD_TYPE.FMP, spec: [] },
        // { type: FASAD_TYPE.SAND, spec: [] },
        // { type: FASAD_TYPE.LACOBEL, spec: [] },
        // { type: FASAD_TYPE.LACOBELGLASS, spec: [] },
        // { type: CORPUS_SPECS.EXT_TEL, spec: [] },
        // { type: CORPUS_SPECS.EXT_CONSOLE, spec: [] },
        // { type: CORPUS_SPECS.EXT_BLINDER, spec: [] },
        // { type: CORPUS_SPECS.EXT_SHELF, spec: [] },
        // { type: CORPUS_SPECS.EXT_SHELFPLAT, spec: [] },
        // { type: CORPUS_SPECS.EXT_PILLAR, spec: [] },
        // { type: CORPUS_SPECS.EXT_STAND, spec: [] },
        // { type: CORPUS_SPECS.EXT_TUBE, spec: [] },
        // { type: CORPUS_SPECS.EXT_TREMPEL, spec: [] },
        // { type: CORPUS_SPECS.EXT_LIGHT, spec: [] },
    ]
}

export const SpecGroups: Map<string, string> = new Map()
SpecGroups.set(CORPUS_SPECS.CORPUS, "Корпус")
SpecGroups.set(FASAD_TYPE.DSP, "Фасад ДСП")
SpecGroups.set(FASAD_TYPE.MIRROR, "Фасад зеркало")
SpecGroups.set(FASAD_TYPE.FMP, "Фасад ФМП")
SpecGroups.set(FASAD_TYPE.SAND, "Фасад песок")
SpecGroups.set(FASAD_TYPE.LACOBEL, "Фасад лакобель")
SpecGroups.set(FASAD_TYPE.LACOBELGLASS, "Фасад лакобель(стекло)")
SpecGroups.set(CORPUS_SPECS.EXT_TEL, "Телескоп")
SpecGroups.set(CORPUS_SPECS.EXT_CONSOLE, "Консоль")
SpecGroups.set(CORPUS_SPECS.EXT_BLINDER, "Козырек")
SpecGroups.set(CORPUS_SPECS.EXT_SHELF, "Полка(пол)")
SpecGroups.set(CORPUS_SPECS.EXT_SHELFPLAT, "Полка(плат)")
SpecGroups.set(CORPUS_SPECS.EXT_PILLAR, "Перемычка")
SpecGroups.set(CORPUS_SPECS.EXT_STAND, "Стойка")
SpecGroups.set(CORPUS_SPECS.EXT_TUBE, "Труба")
SpecGroups.set(CORPUS_SPECS.EXT_TREMPEL, "Тремпель")
SpecGroups.set(CORPUS_SPECS.EXT_LIGHT, "Точки света")

export function getSpecification(data: [SpecItem, FullData[]][]): Map<SpecItem, FullData[]>{
    const m = new Map()
    data.forEach(i => m.set(i[0], i[1]))
    return m
} 
export function specificationToArray(specData: SpecSchema[], spec: Map<SpecItem, FullData[]>): (SpecSchema & SpecResultItem)[] {
    const result: (SpecSchema & SpecResultItem)[] = []
    if(!spec) return result
    specData.forEach(sd => {
        const found = spec.get(sd.name)
        if (found) found.forEach(item => {
            result.push({ ...sd, amount: item.data.amount, char: item.data.char })
        })
    })
    return result
}


