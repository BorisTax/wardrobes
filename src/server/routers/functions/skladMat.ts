import { OmitId } from "../../../types/materials"
import { SKLAD_TABLE_NAMES } from "../../../types/schemas/skladSchemas"
import { IncomeMatTableSchema, MatSkladColorsTableSchema, MatSkladDepartmentTableSchema, MatSkladTableSchema, MatSkladThicknessTableSchema, OutcomeMatTableSchema, OutcomeStolTableSchema, StolColorsTableSchema, StolTableSchema } from "../../../types/schemas/skladSchemas"
import { incorrectData, noExistData } from "../../functions/database"
import messages from "../../messages"
import { getDataBaseSkladService } from "../../options"


export async function getMatThickSklad() {
    const service = getDataBaseSkladService<MatSkladThicknessTableSchema>()
    return await service.getData(SKLAD_TABLE_NAMES.MAT_THICK, ["id", "name"], {})
}

export async function addMatThickSklad(data: OmitId<MatSkladThicknessTableSchema>) {
    const service = getDataBaseSkladService<MatSkladThicknessTableSchema>()
    return await service.addData(SKLAD_TABLE_NAMES.MAT_THICK, data)
}
export async function updateMatThickSklad(data: MatSkladThicknessTableSchema) {
    const service = getDataBaseSkladService<MatSkladThicknessTableSchema>()
    return await service.updateData(SKLAD_TABLE_NAMES.MAT_THICK, { id: data.id }, data)
}
export async function deleteMatThickSklad(id: number) {
    const service = getDataBaseSkladService<MatSkladThicknessTableSchema>()
    return await service.deleteData(SKLAD_TABLE_NAMES.MAT_THICK, { id })
}


export async function getMatColorsSklad() {
    const service = getDataBaseSkladService<MatSkladColorsTableSchema>()
    return await service.getData(SKLAD_TABLE_NAMES.MAT_COLORS, ["id", "thickId", "name"], {})
}
export async function addMatColorSklad(data: OmitId<MatSkladColorsTableSchema>) {
    const service = getDataBaseSkladService<MatSkladColorsTableSchema>()
    return await service.addData(SKLAD_TABLE_NAMES.MAT_COLORS, data)
}

export async function updateMatColorSklad(data: MatSkladColorsTableSchema) {
    const service = getDataBaseSkladService<MatSkladColorsTableSchema>()
    return await service.updateData(SKLAD_TABLE_NAMES.MAT_COLORS, { id: data.id }, data)
}

export async function deleteMatColorSklad(id: number) {
    const service = getDataBaseSkladService<MatSkladColorsTableSchema>()
    return await service.deleteData(SKLAD_TABLE_NAMES.MAT_COLORS, { id })
}



export async function getMatDepartmentSklad() {
    const service = getDataBaseSkladService<MatSkladDepartmentTableSchema>()
    return await service.getData(SKLAD_TABLE_NAMES.MAT_DEPART, ["id", "name"], {})
}
export async function getMatSklad() {
    const service = getDataBaseSkladService<MatSkladTableSchema>()
    return await service.getData(SKLAD_TABLE_NAMES.MAT_SKLAD, ["id", "length", "width", "count", "department"], {})
}
export async function getMatSkladIncome() {
    const service = getDataBaseSkladService<IncomeMatTableSchema>()
    return await service.getData(SKLAD_TABLE_NAMES.MAT_INCOME, ["id", "length", "width", "date", "count", "user", "department"], {})
}
export async function getMatSkladOutcome() {
    const service = getDataBaseSkladService<OutcomeMatTableSchema>()
    return await service.getData(SKLAD_TABLE_NAMES.MAT_OUTCOME, ["id", "length", "width", "date", "count", "user", "department"], {})
}

export async function addMatSklad(data: MatSkladTableSchema, user: string) {
    const service = getDataBaseSkladService<MatSkladTableSchema>()
    const incomeService = getDataBaseSkladService<IncomeMatTableSchema>()
    const stols = (await getMatSklad()).data
    const stol = stols.find(s => s.length === data.length && s.width === data.width && s.id === data.id && s.department === data.department)
    if (!stol){
        await service.addData(SKLAD_TABLE_NAMES.MAT_SKLAD, data)
    }else{
        await service.updateData(SKLAD_TABLE_NAMES.MAT_SKLAD, { id: data.id, length: data.length, width: data.width, department: data.department }, { id: data.id, length: data.length, width: data.width, department:data.department, count: data.count + stol.count })
    }
    return await incomeService.addData(SKLAD_TABLE_NAMES.MAT_INCOME, { ...data, date: Date.now(), user })
}

export async function removeMatSklad(data: MatSkladTableSchema, user: string) {
    const service = getDataBaseSkladService<MatSkladTableSchema>()
    const outcomeService = getDataBaseSkladService<OutcomeMatTableSchema>()
    const stols = (await getMatSklad()).data
    const stol = stols.find(s => s.length === data.length && s.width === data.width && s.id === data.id && s.department === data.department)
    if (!stol){
        return noExistData(messages.SKLAD_MAT_NOEXIST)
    } else {
        if (stol.count < data.count) {
            return incorrectData(messages.SKLAD_MAT_EXCEED_AMOUNT)
        }
        if (stol.count === data.count) {
            await service.deleteData(SKLAD_TABLE_NAMES.MAT_SKLAD, { id: data.id, length: data.length, width: data.width, department: data.department })
        } else await service.updateData(SKLAD_TABLE_NAMES.MAT_SKLAD, { id: data.id, length: data.length, width: data.width, department: data.department }, { id: data.id, length: data.length, width: data.width, department: data.department, count: stol.count - data.count })
    }
    return await outcomeService.addData(SKLAD_TABLE_NAMES.MAT_OUTCOME, { ...data, date: Date.now(), user })
}


export async function clearMatSklad() {
    const service = getDataBaseSkladService<StolTableSchema>()
    //await service.clearData(SKLAD_TABLE_NAMES.MAT_SKLAD)
    await service.clearData(SKLAD_TABLE_NAMES.MAT_INCOME)
    return await service.clearData(SKLAD_TABLE_NAMES.MAT_OUTCOME)
}