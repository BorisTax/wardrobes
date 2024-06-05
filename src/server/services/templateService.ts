import { ITemplateService, ITemplateServiceProvider } from "../../types/services"
import { NewTemplate, Template } from "../../types/templates"

export class TemplateService implements ITemplateService {
    provider: ITemplateServiceProvider
    constructor(provider: ITemplateServiceProvider) {
        this.provider = provider
    }

    async getTemplates(table: string) {
        return await this.provider.getTemplates(table)
    }
    async addTemplate(table: string, template: Template) {
        return await this.provider.addTemplate(table, template)
    }
    async deleteTemplate(table: string, name: string) {
        return await this.provider.deleteTemplate(table, name)
    }
    async updateTemplate(table: string, template: NewTemplate) {
        return await this.provider.updateTemplate(table, template)
    }
}

