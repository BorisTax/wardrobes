import { CORPUS_SPECS, FASAD_SPECS } from "../types/specification";
import {  SpecificationMultiResult } from "../types/wardrobe";

export function getInitSpecification(): SpecificationMultiResult {
    return [
        { type: CORPUS_SPECS.CORPUS, spec: [] },
    ]
}

export const SpecGroups: Map<string, string> = new Map()
SpecGroups.set(CORPUS_SPECS.CORPUS, "Корпус")
SpecGroups.set(FASAD_SPECS.DSP, "Фасад ДСП")
SpecGroups.set(FASAD_SPECS.MIRROR, "Фасад зеркало")
SpecGroups.set(FASAD_SPECS.FMP, "Фасад ФМП")
SpecGroups.set(FASAD_SPECS.SAND, "Фасад песок")
SpecGroups.set(FASAD_SPECS.LACOBEL, "Фасад лакобель")
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



