import { ExtMaterial, ExtNewMaterial, NewProfile, Profile } from "../types/materials"
import { IMaterialService, IMaterialServiceProvider } from "../types/services"

export class MaterialService implements IMaterialService {
    provider: IMaterialServiceProvider
    constructor(provider: IMaterialServiceProvider) {
        this.provider = provider
    }
    async getExtMaterials() {
        return await this.provider.getExtMaterials()
    }
    async addExtMaterial({ name, material, image, code }: ExtMaterial) {
        return await this.provider.addExtMaterial({ name, material, image, code })
    }
    async updateExtMaterial({ name, material, newName, image, code }: ExtNewMaterial) {
        return await this.provider.updateExtMaterial({ name, material, newName, image, code })
    }
    async deleteExtMaterial(name: string, material: string) {
        return await this.provider.deleteExtMaterial(name, material)
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

