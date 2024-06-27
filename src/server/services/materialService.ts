import { FasadMaterial } from "../../types/enums"
import { ExtMaterial, ExtNewMaterial, NewProfile, Profile } from "../../types/materials"
import { ExtMaterialQuery } from "../../types/server"
import { IMaterialService, IMaterialServiceProvider } from "../../types/services"

export class MaterialService implements IMaterialService {
    provider: IMaterialServiceProvider
    constructor(provider: IMaterialServiceProvider) {
        this.provider = provider
    }
    async getExtMaterials(matQuery: ExtMaterialQuery) { 
        return await this.provider.getExtMaterials(matQuery)
    }
    async addExtMaterial({ name, material, image, code, purpose }: ExtMaterial) {
        return await this.provider.addExtMaterial({ name, material, image, code, purpose })
    }
    async updateExtMaterial({ name, material, newName, image, code, purpose }: ExtNewMaterial) {
        return await this.provider.updateExtMaterial({ name, material, newName, image, code, purpose })
    }
    async deleteExtMaterial(name: string, material: string) {
        return await this.provider.deleteExtMaterial(name, material)
    }
    async getImage(material: FasadMaterial, name: string){
        return await this.provider.getImage(material, name)
    }
    async getProfiles() {
        return await this.provider.getProfiles()
    }
    async addProfile(profile: Profile) {
        return await this.provider.addProfile(profile)
    }
    async deleteProfile(name: string, type: string) {
        return await this.provider.deleteProfile(name, type)
    }
    async updateProfile(profile: NewProfile) {
        return await this.provider.updateProfile(profile)
    }
}

