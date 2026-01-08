import { Result } from "../../types/server"
import { ISettingsService, ISettingsServiceProvider } from "../../types/services"
import { SettingsThemeSchema } from "../../types/themes"

export class SettingsService implements ISettingsService {
    provider: ISettingsServiceProvider
    constructor(provider: ISettingsServiceProvider) {
        this.provider = provider
    }

    async getThemes(): Promise<Result<SettingsThemeSchema>> {
        return this.provider.getThemes()
    }
    async setTheme(id: number): Promise<Result<null>> {
        return this.provider.setTheme(id)
    }

}

