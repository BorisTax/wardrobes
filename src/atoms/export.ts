import { atom } from "jotai";
import writeToExcel, { ColumnSchema } from 'write-excel-file';
import { combiStateAtom } from "./app";
import { SpecificationResult } from "../types/wardrobe";
import { unitsAtom } from "./storage";
import { charAtom } from "./materials/chars";
import { specListAtom } from "./specification";
import { OutputSpecSchema } from "./specification";

export const saveToExcelAtom = atom(null, async (get, set, specification: SpecificationResult[], fileName: string) => {
    const spec = get(specListAtom)
    const chars = get(charAtom)
    const unitsData = get(unitsAtom)
    const specList: OutputSpecSchema[] = []
    specification.filter(s => s[1].data.amount > 0).forEach(sp => {
            const specCode = spec.get(sp[0])?.code || ""
            const specName = spec.get(sp[0])?.name || ""
            const charCode = chars.get(sp[1].data.charId || 0)?.code || ""
            const charName = chars.get(sp[1].data.charId || 0)?.name || ""
            const units = unitsData.get(spec.get(sp[0])?.units || 0) || ""
            specList.push({ specCode, specName, charCode, charName,  amount: sp[1].data.amount || 0, units })
        })
    const schema: ColumnSchema<OutputSpecSchema, String | Number>[] = [
        { column: "Код", type: String, value: (p: OutputSpecSchema) => p.specCode, width: 20, borderStyle: "thin" },
        { column: "Наименование", type: String, value: (p: OutputSpecSchema) => p.specName, width: 40, borderStyle: "thin" },
        { column: "Характеристика", type: String, value: (p: OutputSpecSchema) => p.charName, width: 40, borderStyle: "thin" },
        { column: "Код характеристики", type: String, value: (p: OutputSpecSchema) => p.charCode, width: 40, borderStyle: "thin" },
        { column: "Кол-во", value: (p: OutputSpecSchema) => p.amount.toFixed(3), width: 10, borderStyle: "thin" },
        { column: "Ед", value: (p: OutputSpecSchema) => p.units, width: 5, borderStyle: "thin" },
        //{ column: "Идентификатор", value: (p: SpecificationData) => p.id, width: 30 },
    ]
    const data = specList
    await writeToExcel(data, {
        schema,
        headerStyle: {
            fontWeight: 'bold',
            align: 'center',
            borderStyle: "thin",
        }, fileName: `${fileName}.xlsx`
    })
})
