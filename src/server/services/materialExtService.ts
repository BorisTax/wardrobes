import { IMaterialExtService } from "../../types/services"

export class MaterialExtService<T> {
    provider: IMaterialExtService<T>
    constructor(provider: IMaterialExtService<T>) {
        this.provider = provider
    }
    async getExtData() {
        return await this.provider.getExtData()
    }
    async addExtData(data: T) {
        return await this.provider.addExtData(data)
    }
    async deleteExtData(name: string) {
        return await this.provider.deleteExtData(name)
    }
    async updateExtData(data: T & {newName: string}) {
        return await this.provider.updateExtData(data)
    }
}

