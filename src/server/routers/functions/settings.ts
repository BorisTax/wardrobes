import { getSettingsService } from "../../options";

export async function getThemes() {
  const service = getSettingsService()
  return (await service.getThemes())
}
export async function setTheme(id: number) {
  const service = getSettingsService()
  return await service.setTheme(id);
}


