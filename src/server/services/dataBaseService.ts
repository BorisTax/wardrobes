import { OmitId } from "../../types/materials"
import { DATA_TABLE_NAMES, KeySet } from "../../types/schemas"
import { IDataBaseService, IDataBaseServiceProvider } from "../../types/services"

export class DataBaseService<T extends { id: number }> implements IDataBaseService<T> {
    provider: IDataBaseServiceProvider<T>
    constructor(provider: IDataBaseServiceProvider<T>) {
        this.provider = provider
    }
    async getData(table: DATA_TABLE_NAMES, columns: KeySet<T>, values: Partial<T>) {
        return await this.provider.getData(table, columns, values)
    }
    async addData(table: DATA_TABLE_NAMES, data: OmitId<T>) {
        return await this.provider.addData(table, data)
    }
    async deleteData(table: DATA_TABLE_NAMES, id: number ) {
        return await this.provider.deleteData(table, id)
    }
    async updateData(table: DATA_TABLE_NAMES, data: Partial<T>) {
        return await this.provider.updateData(table, data)
    }
}

