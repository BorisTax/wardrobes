import messages from './messages.js'

export class MaterialService {
    constructor(provider) {
        this.provider = provider
    }
    async getExtMaterials() {
        return await this.provider.getExtMaterials()
    }
    async addExtMaterial(name, material, imageurl, code1c) {
        return await this.provider.addExtMaterial(name, material, imageurl, code1c)
    }
    async deleteExtMaterial(name, material){
        return await this.provider.deleteExtMaterial(name, material)
    }
    async getProfiles() {
        return await this.provider.getProfiles()
    }
    async registerUser(newUser) {
        let result = await this.isUserNameExist(newUser.name)
        if (!result.success) return result
        result = await this.isUserEmailExist(newUser.email)
        if (!result.success) return result
        return this.provider.registerUser(newUser)
    }

}

