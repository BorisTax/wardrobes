import { IMaterialExtService } from "../../types/services"

export class MaterialExtService<T> {
    provider: IMaterialExtService<T>
    constructor(provider: IMaterialExtService<T>) {
        this.provider = provider
    }
    async getExtData() {
        return await this.provider.getExtData()
    }
    async addExtData(data: Omit<T, "id">) {
        return await this.provider.addExtData(data)
    }
    async deleteExtData(id: number) {
        return await this.provider.deleteExtData(id)
    }
    async updateExtData(data: T) {
        return await this.provider.updateExtData(data)
    }
}

