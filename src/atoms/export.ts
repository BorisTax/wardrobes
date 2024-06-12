import { atom } from "jotai";
import { specificationCombiAtom } from "./specification";
import writeToExcel from 'write-excel-file';
import { priceListAtom } from "./prices";
import { SpecificationItem } from "../types/specification.ts";
import { UnitCaptions } from "../functions/materials";
import { SpecificationData } from "../types/server";
import { appDataAtom } from "./app";

export const saveToExcelAtom = atom(null, async (get, set, index: number) => {
    const specifications = get(specificationCombiAtom)
    const { order } = get(appDataAtom)
    const orderCaption = order.trim() ? order.trim() + " " : ""
    const priceList = get(priceListAtom)
    const spec = specifications[index]
    const schema = [
        { column: "Наименование", type: String, value: (p: SpecificationData) => p.caption, width: 40 },
        { column: "Код", type: String, value: (p: SpecificationData) => p.code, width: 20 },
        { column: "Идентификатор", value: (p: SpecificationData) => p.id, width: 30 },
        { column: "Кол-во", value: (p: SpecificationData) => spec.get(p.name as SpecificationItem), width: 10 },
        { column: "Ед", value: (p: SpecificationData) => UnitCaptions.get(p.units || ""), width: 5 },
    ]

    const data = priceList

    await writeToExcel(data, {
        schema,
        headerStyle: {
            fontWeight: 'bold',
            align: 'center'
        }, fileName: `${orderCaption}Фасад (${index + 1} из ${specifications.length}).xlsx`
    })
})