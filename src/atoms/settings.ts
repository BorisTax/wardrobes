import { atom } from "jotai";
export type AppSettings = {
    showFixIcons: boolean
    minSize: number
}

export function getDefaultSettings(): AppSettings {
    return { showFixIcons: true, minSize: 50 }
}
export function getStoredSettings(): AppSettings {
    const settings = localStorage.getItem("settings")
    if (!settings) return getDefaultSettings()
    try {
        return JSON.parse(settings)
    } catch (e) {
        return getDefaultSettings()
    }
}

export const settingsAtom = atom<AppSettings>(getStoredSettings())

export const setSettingsAtom = atom(null, (get, set, settings: AppSettings) => {
    const newSettings = { ...settings }
    set(settingsAtom, newSettings)
    localStorage.setItem("settings", JSON.stringify(newSettings))
})