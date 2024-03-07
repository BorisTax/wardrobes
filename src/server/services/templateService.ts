import { ITemplateService, ITemplateServiceProvider } from "../types/services"
import { NewTemplate, Template } from "../types/templates"

export class TemplateService implements ITemplateService {
    provider: ITemplateServiceProvider
    constructor(provider: ITemplateServiceProvider) {
        this.provider = provider
    }

    async getTemplates() {
        return await this.provider.getTemplates()
    }
    async addTemplate(template: Template) {
        return await this.provider.addTemplate(template)
    }
    async deleteTemplate(name: string) {
        return await this.provider.deleteTemplate(name)
    }
    async updateTemplate(template: NewTemplate) {
        return await this.provider.updateTemplate(template)
    }
}

