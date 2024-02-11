import { ExtMaterial, ExtNewMaterial } from "../../types/materials"
import { IMaterialService, IMaterialServiceProvider } from "../../types/services"

export class MaterialService implements IMaterialService{
    provider: IMaterialServiceProvider
    constructor(provider: IMaterialServiceProvider) {
        this.provider = provider
    }
    async getExtMaterials() {
        return await this.provider.getExtMaterials()
    }
    async addExtMaterial({name, material, imageurl, code} :ExtMaterial) {
        return await this.provider.addExtMaterial({name, material, imageurl, code})
    }
    async updateExtMaterial({name, material, newName, imageurl, code}: ExtNewMaterial) {
        return await this.provider.updateExtMaterial({name, material, newName,  imageurl, code})
    }
    async deleteExtMaterial(name: string, material: string){
        return await this.provider.deleteExtMaterial(name, material)
    }
    async getProfiles() {
        return await this.provider.getProfiles()
    }
}

