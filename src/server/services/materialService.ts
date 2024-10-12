import { FASAD_TYPE } from "../../types/enums"
import { FasadMaterial, Profile } from "../../types/materials"
import { ExtMaterialQuery } from "../../types/server"
import { IMaterialService, IMaterialServiceProvider } from "../../types/services"

export class MaterialService implements IMaterialService {
    provider: IMaterialServiceProvider
    constructor(provider: IMaterialServiceProvider) {
        this.provider = provider
    }
    async getMaterialTypes() { 
        return await this.provider.getMaterialTypes()
    }
    async getExtMaterials(matQuery: ExtMaterialQuery) { 
        return await this.provider.getExtMaterials(matQuery)
    }
    async addExtMaterial({ name, type: material, image, code, purpose }: Omit<FasadMaterial, "id">) {
        return await this.provider.addExtMaterial({ name, type: material, image, code, purpose })
    }
    async updateExtMaterial({ id, name, type: material, image, code, purpose }: FasadMaterial) {
        return await this.provider.updateExtMaterial({ id, name, type: material, image, code, purpose })
    }
    async deleteExtMaterial(id: number) {
        return await this.provider.deleteExtMaterial(id)
    }
    async getImage(id: number){
        return await this.provider.getImage(id)
    }
    async getProfiles() {
        return await this.provider.getProfiles()
    }
    async addProfile(profile: Omit<Profile, "id">) {
        return await this.provider.addProfile(profile)
    }
    async deleteProfile(id: number) {
        return await this.provider.deleteProfile(id)
    }
    async updateProfile(profile: Profile) {
        return await this.provider.updateProfile(profile)
    }
}

