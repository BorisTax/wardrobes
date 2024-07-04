import { atom } from "jotai";
import { specificationDataAtom } from "./specification";
import writeToExcel, { ColumnSchema } from 'write-excel-file';
import { UnitCaptions } from "../functions/materials";
import { SpecificationData } from "../types/server";
import { appDataAtom } from "./app";
import { SpecificationResult, TotalData } from "../types/wardrobe";

export const saveToExcelAtom = atom(null, async (get, set, specification: SpecificationResult[], fileName: string) => {
    const specData = get(specificationDataAtom)
    const { order } = get(appDataAtom)
    const orderCaption = order.trim() ? order.trim() + " " : ""
    const specList: (SpecificationData & { amount: number, charCode: string })[] = []
    specData.forEach(sd => {
        const spec = specification.filter(s => s[0] === sd.name && s[1].data.amount > 0)
        spec.forEach(sp => {
            const code = sp[1].data.useCharAsCode ? sp[1].data.char?.code : sd.code //для щетки
            const caption = sp[1].data.useCharAsCode ? sp[1].data.char?.caption : sd.caption //для щетки
            const charCode = (!sp[1].data.useCharAsCode && sp[1].data.char?.code) || ""
            specList.push({ ...sd, code, caption, amount: sp[1].data.amount || 0, charCode })
        })
    })
    const schema: ColumnSchema<(SpecificationData & { charCode: string }) | TotalData, String | Number>[] = [
        { column: "Код", type: String, value: (p: SpecificationData) => p.code, width: 20, borderStyle: "thin" },
        { column: "Наименование", type: String, value: (p: SpecificationData) => p.caption, width: 40, borderStyle: "thin" },
        { column: "Характеристика", type: String, value: (p: SpecificationData & { charCode: string }) => p.charCode, width: 40, borderStyle: "thin" },
        { column: "Кол-во", value: (p: TotalData) => Number(p.amount?.toFixed(3)), width: 10, borderStyle: "thin" },
        { column: "Ед", value: (p: SpecificationData) => UnitCaptions.get(p.units || ""), width: 5, borderStyle: "thin" },
        //{ column: "Идентификатор", value: (p: SpecificationData) => p.id, width: 30 },
    ]
    const data = specList
    await writeToExcel(data, {
        schema,
        headerStyle: {
            fontWeight: 'bold',
            align: 'center',
            borderStyle: "thin",
        }, fileName: `${orderCaption}${fileName}.xlsx`
    })
})
