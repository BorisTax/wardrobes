import { atom } from "jotai";
import { specificationDataAtom } from "./specification";
import writeToExcel from 'write-excel-file';
import { SpecificationItem } from "../types/specification";
import { UnitCaptions } from "../functions/materials";
import { SpecificationData } from "../types/server";
import { appDataAtom } from "./app";

export const saveToExcelAtom = atom(null, async (get, set, specification: Map<SpecificationItem, number>, fileName: string) => {
    const { order } = get(appDataAtom)
    const orderCaption = order.trim() ? order.trim() + " " : ""
    const specList = get(specificationDataAtom).filter(s => (specification.has(s.name) && specification.get(s.name as SpecificationItem) !== 0))
    const schema = [
        { column: "Наименование", type: String, value: (p: SpecificationData) => p.caption, width: 40 },
        { column: "Код", type: String, value: (p: SpecificationData) => p.code, width: 20 },
        { column: "Идентификатор", value: (p: SpecificationData) => p.id, width: 30 },
        { column: "Кол-во", value: (p: SpecificationData) => Number((specification.get(p.name as SpecificationItem))?.toFixed(3)), width: 10 },
        { column: "Ед", value: (p: SpecificationData) => UnitCaptions.get(p.units || ""), width: 5 },
    ]

    const data = specList

    await writeToExcel(data, {
        schema,
        headerStyle: {
            fontWeight: 'bold',
            align: 'center'
        }, fileName: `${orderCaption}${fileName}.xlsx`
    })
})
