import { getSettingsProvider } from '../../options.js';
import { SettingsService } from '../../services/settingsService.js';

export async function getThemes() {
  const service = new SettingsService(getSettingsProvider())
  return (await service.getThemes())
}
export async function setTheme(id: number) {
  const service = new SettingsService(getSettingsProvider());
  return await service.setTheme(id);
}


