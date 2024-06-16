import { FasadMaterial } from "../types/enums";
import { SpecificationData } from "../types/server";
import { CORPUS_SPECS } from "../types/specification";
import { SpecificationItem } from "../types/specification";
import { FullData, SpecificationMultiResult, SpecificationResultItem } from "../types/wardrobe";

export function getInitSpecification(): SpecificationMultiResult {
    return [
        { type: CORPUS_SPECS.CORPUS, spec: [] },
        { type: FasadMaterial.DSP, spec: [] },
        { type: FasadMaterial.MIRROR, spec: [] },
        { type: FasadMaterial.FMP, spec: [] },
        { type: FasadMaterial.SAND, spec: [] },
        { type: FasadMaterial.LACOBEL, spec: [] },
        { type: FasadMaterial.LACOBELGLASS, spec: [] },
        { type: CORPUS_SPECS.EXT_TEL, spec: [] },
        { type: CORPUS_SPECS.EXT_CONSOLE, spec: [] },
        { type: CORPUS_SPECS.EXT_BLINDER, spec: [] },
        { type: CORPUS_SPECS.EXT_SHELF, spec: [] },
        { type: CORPUS_SPECS.EXT_SHELFPLAT, spec: [] },
        { type: CORPUS_SPECS.EXT_PILLAR, spec: [] },
        { type: CORPUS_SPECS.EXT_STAND, spec: [] },
        { type: CORPUS_SPECS.EXT_TUBE, spec: [] },
        { type: CORPUS_SPECS.EXT_TREMPEL, spec: [] },
        { type: CORPUS_SPECS.EXT_LIGHT, spec: [] },
    ]
};

export const SpecGroups: Map<string, string> = new Map()
SpecGroups.set(CORPUS_SPECS.CORPUS, "Корпус")
SpecGroups.set(FasadMaterial.DSP, "Фасад ДСП")
SpecGroups.set(FasadMaterial.MIRROR, "Фасад зеркало")
SpecGroups.set(FasadMaterial.FMP, "Фасад ФМП")
SpecGroups.set(FasadMaterial.SAND, "Фасад песок")
SpecGroups.set(FasadMaterial.LACOBEL, "Фасад лакобель")
SpecGroups.set(FasadMaterial.LACOBELGLASS, "Фасад лакобель(стекло)")
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

export function getSpecification(data: [SpecificationItem, FullData[]][]): Map<SpecificationItem, FullData[]>{
    const m = new Map()
    data.forEach(i => m.set(i[0], i[1]))
    return m
} 
export function specificationToArray(specData: SpecificationData[], spec: Map<SpecificationItem, FullData[]>): (SpecificationData & SpecificationResultItem)[] {
    const result: (SpecificationData & SpecificationResultItem)[] = []
    if(!spec) return result
    specData.forEach(sd => {
        const found = spec.get(sd.name)
        if (found) found.forEach(item => {
            result.push({ ...sd, amount: item.data.amount, char: item.data.char })
        })
    })
    return result
}


