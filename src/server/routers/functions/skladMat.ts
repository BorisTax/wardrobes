import { IncomeMatTableSchema, IncomeStolTableSchema, MatSkladColorsTableSchema, MatSkladTableSchema, MatSkladThicknessTableSchema, OutcomeMatTableSchema, OutcomeStolTableSchema, SKLAD_TABLE_NAMES, StolColorsTableSchema, StolTableSchema } from "../../../types/schemas"
import { incorrectData, noExistData } from "../../functions/database"
import messages from "../../messages"
import { getDataBaseSkladService } from "../../options"

export async function getMatColorsSklad() {
    const service = getDataBaseSkladService<MatSkladColorsTableSchema>()
    return await service.getData(SKLAD_TABLE_NAMES.MAT_COLORS, ["id", "thickId", "name"], {})
}
export async function getMatThickSklad() {
    const service = getDataBaseSkladService<MatSkladThicknessTableSchema>()
    return await service.getData(SKLAD_TABLE_NAMES.MAT_THICK, ["id", "name"], {})
}
export async function getMatSklad() {
    const service = getDataBaseSkladService<MatSkladTableSchema>()
    return await service.getData(SKLAD_TABLE_NAMES.MAT_SKLAD, ["id", "length", "width", "count"], {})
}
export async function getMatSkladIncome() {
    const service = getDataBaseSkladService<IncomeMatTableSchema>()
    return await service.getData(SKLAD_TABLE_NAMES.MAT_INCOME, ["id", "length", "width", "date", "count", "user"], {})
}
export async function getMatSkladOutcome() {
    const service = getDataBaseSkladService<OutcomeMatTableSchema>()
    return await service.getData(SKLAD_TABLE_NAMES.MAT_OUTCOME, ["id", "length", "width", "date", "count", "user"], {})
}

export async function addMatSklad(data: MatSkladTableSchema, user: string) {
    const service = getDataBaseSkladService<MatSkladTableSchema>()
    const incomeService = getDataBaseSkladService<IncomeMatTableSchema>()
    const stols = (await getMatSklad()).data
    const stol = stols.find(s => s.length === data.length && s.width === data.width && s.id === data.id)
    if (!stol){
        await service.addData(SKLAD_TABLE_NAMES.MAT_SKLAD, data)
    }else{
        await service.updateData(SKLAD_TABLE_NAMES.MAT_SKLAD, { id: data.id, length: data.length }, { id: data.id, length: data.length, count: data.count + stol.count })
    }
    return await incomeService.addData(SKLAD_TABLE_NAMES.MAT_INCOME, { ...data, date: Date.now(), user })
}

export async function removeMatSklad(data: MatSkladTableSchema, user: string) {
    const service = getDataBaseSkladService<MatSkladTableSchema>()
    const outcomeService = getDataBaseSkladService<OutcomeMatTableSchema>()
    const stols = (await getMatSklad()).data
    const stol = stols.find(s => s.length === data.length && s.width === data.width && s.id === data.id)
    if (!stol){
        return noExistData(messages.SKLAD_MAT_NOEXIST)
    } else {
        if (stol.count < data.count) {
            return incorrectData(messages.SKLAD_MAT_EXCEED_AMOUNT)
        }
        if (stol.count === data.count) {
            await service.deleteData(SKLAD_TABLE_NAMES.MAT_SKLAD, { id: data.id, length: data.length, width: data.width })
        } else await service.updateData(SKLAD_TABLE_NAMES.MAT_SKLAD, { id: data.id, length: data.length, width: data.width }, { id: data.id, length: data.length, width: data.width, count: stol.count - data.count })
    }
    return await outcomeService.addData(SKLAD_TABLE_NAMES.MAT_OUTCOME, { ...data, date: Date.now(), user })
}


export async function clearMatSklad() {
    const service = getDataBaseSkladService<StolTableSchema>()
    await service.clearData(SKLAD_TABLE_NAMES.MAT_SKLAD)
    await service.clearData(SKLAD_TABLE_NAMES.MAT_INCOME)
    return await service.clearData(SKLAD_TABLE_NAMES.MAT_OUTCOME)
}