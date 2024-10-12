import { ITemplateService, ITemplateServiceProvider } from "../../types/services"
import { Template } from "../../types/templates"

export class TemplateService implements ITemplateService {
    provider: ITemplateServiceProvider
    constructor(provider: ITemplateServiceProvider) {
        this.provider = provider
    }

    async getFasadTemplates() {
        return await this.provider.getFasadTemplates()
    }
    async addFasadTemplate(template: Omit<Template, "id">) {
        return await this.provider.addFasadTemplate(template)
    }
    async deleteFasadTemplate(id: number) {
        return await this.provider.deleteFasadTemplate(id)
    }
    async updateFasadTemplate(template: Template) {
        return await this.provider.updateFasadTemplate(template)
    }
}

