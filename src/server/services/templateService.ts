import { ITemplateService, ITemplateServiceProvider } from "../../types/services"
import { NewTemplate, Template } from "../../types/templates"

export class TemplateService implements ITemplateService {
    provider: ITemplateServiceProvider
    constructor(provider: ITemplateServiceProvider) {
        this.provider = provider
    }

    async getFasadTemplates() {
        return await this.provider.getFasadTemplates()
    }
    async addFasadTemplate(template: Template) {
        return await this.provider.addFasadTemplate(template)
    }
    async deleteFasadTemplate(name: string) {
        return await this.provider.deleteFasadTemplate(name)
    }
    async updateFasadTemplate(template: NewTemplate) {
        return await this.provider.updateFasadTemplate(template)
    }
}

