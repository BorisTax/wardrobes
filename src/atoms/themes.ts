import { atom, useAtomValue } from "jotai";
import { SettingsThemeSchema, THEME_STANDART } from "../types/themes";
import { userAtom } from "./users";
import { RESOURCE } from "../types/user";
import { fetchData, fetchGetData, FetchResult } from "../functions/fetch";
import { API_ROUTE, SETTINGS_ROUTE } from "../types/routes";
import messages from "../server/messages";

export const themesAtom = atom<SettingsThemeSchema[]>([{ id: THEME_STANDART, name: "", in_use: false }])
export const useCurrentTheme = () => {
    const themes = useAtomValue(themesAtom)
    return themes.find(t => t.in_use === true) || { id: 0, name: "", in_use: false }
}

export const loadThemesAtom = atom(null, async (get, set) => {
    const {token, permissions} = get(userAtom)
    if(!permissions.get(RESOURCE.SETTINGS)?.Read) return { success: false, message: "" }
    try {
        const fetchData: FetchResult<SettingsThemeSchema> = await (await fetchGetData(`${API_ROUTE}${SETTINGS_ROUTE}/themes?token=${token}`))
        const data = fetchData.data.map(d => ({ ...d, in_use: !!d.in_use }))
        set(themesAtom, data)
    } catch (e) { console.error(e) }
})

export const setThemeAtom = atom(null, async (get, set, id: number) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.SETTINGS)?.Update) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${SETTINGS_ROUTE}/theme`, "PUT", JSON.stringify({ id, token }))
        set(loadThemesAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})