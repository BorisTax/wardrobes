import { OmitId } from "../../types/materials"
import { KeySet, TABLE_NAMES } from "../../types/schemas"
import { IDataBaseService, IDataBaseServiceProvider } from "../../types/services"

export class DataBaseService<T extends { id: number }> implements IDataBaseService<T> {
    provider: IDataBaseServiceProvider<T>
    constructor(provider: IDataBaseServiceProvider<T>) {
        this.provider = provider
    }
    async getData(table: TABLE_NAMES, columns: KeySet<T>, values: Partial<T>) {
        return await this.provider.getData(table, columns, values)
    }
    async addData(table: TABLE_NAMES, data: Partial<T>) {
        return await this.provider.addData(table, data)
    }
    async deleteData(table: TABLE_NAMES, lookIn: Partial<T> ) {
        return await this.provider.deleteData(table, lookIn)
    }
    async updateData(table: TABLE_NAMES, lookIn: Partial<T>, update: Partial<T>) {
        return await this.provider.updateData(table, lookIn, update)
    }
}

