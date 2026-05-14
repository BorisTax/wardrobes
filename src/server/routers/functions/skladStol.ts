import { SKLAD_STOL_TABLE_NAMES } from "../../../types/schemas/skladSchemas"
import { IncomeStolTableSchema, OutcomeStolTableSchema, StolColorsTableSchema, StolTableSchema } from "../../../types/schemas/skladSchemas"
import { incorrectData, noExistData } from "../../functions/database"
import messages from "../../messages"
import { getDataBaseSkladService } from "../../options"

export async function getStolColors() {
    const service = getDataBaseSkladService<StolColorsTableSchema>()
    return await service.getData(SKLAD_STOL_TABLE_NAMES.STOL_COLORS, ["id", "name"], {})
}
export async function getStol() {
    const service = getDataBaseSkladService<StolTableSchema>()
    return await service.getData(SKLAD_STOL_TABLE_NAMES.STOL_SKLAD, ["id", "amount", "length"], {})
}
export async function getStolIncome() {
    const service = getDataBaseSkladService<IncomeStolTableSchema>()
    return await service.getData(SKLAD_STOL_TABLE_NAMES.STOL_INCOME, ["id", "amount", "length", "date", "user"], {})
}
export async function getStolOutcome() {
    const service = getDataBaseSkladService<OutcomeStolTableSchema>()
    return await service.getData(SKLAD_STOL_TABLE_NAMES.STOL_OUTCOME, ["id", "amount", "length", "date", "user"], {})
}

export async function addStol(data: StolTableSchema, user: string) {
    const service = getDataBaseSkladService<StolTableSchema>()
    const incomeService = getDataBaseSkladService<IncomeStolTableSchema>()
    const stols = (await getStol()).data
    const stol = stols.find(s => s.length === data.length && s.id === data.id)
    if (!stol){
        await service.addData(SKLAD_STOL_TABLE_NAMES.STOL_SKLAD, data)
    }else{
        await service.updateData(SKLAD_STOL_TABLE_NAMES.STOL_SKLAD, { id: data.id, length: data.length }, { id: data.id, length: data.length, amount: data.amount + stol.amount })
    }
    return await incomeService.addData(SKLAD_STOL_TABLE_NAMES.STOL_INCOME, { ...data, date: Date.now(), user })
}

export async function removeStol(data: StolTableSchema, user: string) {
    const service = getDataBaseSkladService<StolTableSchema>()
    const outcomeService = getDataBaseSkladService<OutcomeStolTableSchema>()
    const stols = (await getStol()).data
    const stol = stols.find(s => s.length === data.length && s.id === data.id)
    if (!stol){
        return noExistData(messages.SKLAD_STOL_NOEXIST)
    } else {
        if (stol.amount < data.amount) {
            return incorrectData(messages.SKLAD_STOL_EXCEED_AMOUNT)
        }
        if (stol.amount === data.amount) {
            await service.deleteData(SKLAD_STOL_TABLE_NAMES.STOL_SKLAD, { id: data.id, length: data.length })
        } else await service.updateData(SKLAD_STOL_TABLE_NAMES.STOL_SKLAD, { id: data.id, length: data.length }, { id: data.id, length: data.length, amount: stol.amount - data.amount })
    }
    return await outcomeService.addData(SKLAD_STOL_TABLE_NAMES.STOL_OUTCOME, { ...data, date: Date.now(), user })
}


export async function clearStol() {
    const service = getDataBaseSkladService<StolTableSchema>()
    await service.clearData(SKLAD_STOL_TABLE_NAMES.STOL_SKLAD)
    await service.clearData(SKLAD_STOL_TABLE_NAMES.STOL_INCOME)
    return await service.clearData(SKLAD_STOL_TABLE_NAMES.STOL_OUTCOME)
}