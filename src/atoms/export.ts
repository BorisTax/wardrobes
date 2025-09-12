import { atom } from "jotai";
import writeToExcel, { ColumnSchema } from 'write-excel-file';
import { SpecificationResult } from "../types/wardrobe";
import { unitsAtom } from "./storage";
import { charAtom } from "./materials/chars";
import { specListAtom } from "./specification";
import { OutputSpecSchema } from "./specification";
import { IncomeTableSchema, OutcomeTableSchema, StolTableSchema } from "../types/schemas";
import { stolColorsAtom, stolIncomeAtom, stolOutcomeAtom, stolSkladAtom } from "./sklad";
import { getDateFormat } from "../functions/date";
import Excel from "exceljs"
import {saveAs} from "file-saver";

export const saveToExcelAtom = atom(null, async (get, _, specification: SpecificationResult[], fileName: string) => {
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
    const schema: ColumnSchema<OutputSpecSchema, string | number>[] = [
        { column: "Код", type: String, value: (p: OutputSpecSchema) => p.specCode, width: 20, borderStyle: "thin" },
        { column: "Наименование", type: String, value: (p: OutputSpecSchema) => p.specName, width: 40, borderStyle: "thin" },
        { column: "Характеристика", type: String, value: (p: OutputSpecSchema) => p.charName, width: 40, borderStyle: "thin" },
        { column: "Код характеристики", type: String, value: (p: OutputSpecSchema) => p.charCode, width: 40, borderStyle: "thin" },
        { column: "Кол-во", value: (p: OutputSpecSchema) => p.amount.toFixed(3), width: 10, borderStyle: "thin" },
        { column: "Ед", value: (p: OutputSpecSchema) => p.units, width: 5, borderStyle: "thin" },
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


export const saveStolToExcelAtom = atom(null, async (get, _) => {
    const colors = get(stolColorsAtom)
    const stolSklad = get(stolSkladAtom)
    const stolIncome = get(stolIncomeAtom)
    const stolOutCome = get(stolOutcomeAtom)
    const workbook = new Excel.Workbook();
    const skladSheet = workbook.addWorksheet('Склад');
    const incomeSheet = workbook.addWorksheet('Приход');
    const outcomeSheet = workbook.addWorksheet('Расход');
    skladSheet.columns = [
        { header: 'Столешница', key: 'name', width: 40, alignment: { vertical: 'middle', horizontal: 'center' } },
        { header: 'Длина', key: 'length', width: 10, alignment: { vertical: 'middle', horizontal: 'center' }  },
        { header: 'Кол-во', key: 'amount', width: 8, alignment: { vertical: 'middle', horizontal: 'center' }  }
    ];
    incomeSheet.columns = [
        { header: 'Дата', key: 'date', width: 20, alignment: { vertical: 'middle', horizontal: 'center' }  },
        { header: 'Столешница', key: 'name', width: 40, alignment: { vertical: 'middle', horizontal: 'center' }  },
        { header: 'Длина', key: 'length', width: 10, alignment: { vertical: 'middle', horizontal: 'center' }  },
        { header: 'Кол-во', key: 'amount', width: 8, alignment: { vertical: 'middle', horizontal: 'center' }  }
    ];
    outcomeSheet.columns = incomeSheet.columns
    const skladRows = stolSklad.map(s => [colors.get(s.id), s.length, s.amount])
    const incomeRows = stolIncome.map(s => [getDateFormat(s.date), colors.get(s.id), s.length, s.amount])
    const outcomeRows = stolOutCome.map(s => [getDateFormat(s.date), colors.get(s.id), s.length, s.amount])
    skladSheet.addRows(skladRows)
    incomeSheet.addRows(incomeRows)
    outcomeSheet.addRows(outcomeRows)
    const buffer = await workbook.xlsx.writeBuffer();
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const blob = new Blob([buffer], {type: fileType});
    saveAs(blob, `Столешницы ${getDateFormat(Date.now())}.xlsx`);
})