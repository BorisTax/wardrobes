import { atom } from "jotai";
import { specificationDataAtom } from "./specification";
import writeToExcel from 'write-excel-file';
import { SpecificationItem } from "../types/specification";
import { UnitCaptions } from "../functions/materials";
import { SpecificationData } from "../types/server";
import { appDataAtom } from "./app";
import { FullData, SpecificationResult, SpecificationResultItem, TotalData } from "../types/wardrobe";
import { specificationToArray } from "../functions/specification";

export const saveToExcelAtom = atom(null, async (get, set, specification: SpecificationResult[], fileName: string) => {
    const specData = get(specificationDataAtom)
    //const spec = specificationToArray(specData, specification)
    const { order } = get(appDataAtom)
    const orderCaption = order.trim() ? order.trim() + " " : ""
    const specList = specification.map(s => {
        const sp = specData.find(sd => sd.name === s[0]) as SpecificationData
        return { ...sp, charCode: s[1].data.char?.code || "", amount: s[1].data.amount }})
    //const specList = spec.map(s=>({code: s.item.char}))
    const schema = [
        { column: "Код", type: String, value: (p: SpecificationData) => p.code, width: 20 },
        { column: "Наименование", type: String, value: (p: SpecificationData) => p.caption, width: 40 },
        { column: "Характеристика", type: String, value: (p: SpecificationData & { charCode: string }) => p.charCode, width: 40 },
        { column: "Кол-во", value: (p: TotalData) => Number(p.amount?.toFixed(3)), width: 10 },
        { column: "Ед", value: (p: SpecificationData) => UnitCaptions.get(p.units || ""), width: 5 },
        { column: "Идентификатор", value: (p: SpecificationData) => p.id, width: 30 },
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
