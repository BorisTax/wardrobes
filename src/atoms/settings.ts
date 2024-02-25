import { atom } from "jotai";
export type AppSettings = {
    showFixIcons: boolean
}

export function getDefaultSettings(): AppSettings {
    return { showFixIcons: true }
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

export const setShowFixIconsAtom = atom(null, (get, set, show: boolean) => {
    const settings = get(settingsAtom)
    const newSettings= { ...settings, showFixIcons: show }
    set(settingsAtom, newSettings)
    localStorage.setItem("settings", JSON.stringify(newSettings))
})