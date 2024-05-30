import { Brush, Edge, ExtMaterial, ExtNewMaterial, NewBrush, NewEdge, NewProfile, NewZaglushka, Profile, Zaglushka } from "../types/materials"
import { IMaterialService, IMaterialServiceProvider } from "../types/services"

export class MaterialService implements IMaterialService {
    provider: IMaterialServiceProvider
    constructor(provider: IMaterialServiceProvider) {
        this.provider = provider
    }
    async getExtMaterials() {
        return await this.provider.getExtMaterials()
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
    async getEdges() {
        return await this.provider.getEdges()
    }
    async addEdge(edge: Edge) {
        return await this.provider.addEdge(edge)
    }
    async deleteEdge(name: string) {
        return await this.provider.deleteEdge(name)
    }
    async updateEdge(edge: NewEdge) {
        return await this.provider.updateEdge(edge)
    }
    async getZaglushkas() {
        return await this.provider.getZaglushkas()
    }
    async addZaglushka(edge: Zaglushka) {
        return await this.provider.addZaglushka(edge)
    }
    async deleteZaglushka(name: string) {
        return await this.provider.deleteZaglushka(name)
    }
    async updateZaglushka(edge: NewZaglushka) {
        return await this.provider.updateZaglushka(edge)
    }
    async getBrushes() {
        return await this.provider.getBrushes()
    }
    async addBrush(edge: Brush) {
        return await this.provider.addBrush(edge)
    }
    async deleteBrush(name: string) {
        return await this.provider.deleteBrush(name)
    }
    async updateBrush(edge: NewBrush) {
        return await this.provider.updateBrush(edge)
    }
}

