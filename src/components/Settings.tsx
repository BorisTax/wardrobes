import { useAtomValue, useSetAtom } from "jotai"
import { setThemeAtom, themesAtom, useCurrentTheme } from "../atoms/themes"
import ComboBox from "./inputs/ComboBox"
import { useEffect, useState } from "react"
import Button from "./inputs/Button"
import { userAtom } from "../atoms/users"
import { RESOURCE } from "../types/user"
import { useNavigate } from "react-router-dom"

export default function Settings(){
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.SETTINGS)
    const themes = useAtomValue(themesAtom)
    const currentTheme = useCurrentTheme()
    const [selectedTheme, setSelectedTheme] = useState(currentTheme )
    const setTheme = useSetAtom(setThemeAtom)
    const navigate = useNavigate()
    useEffect(() => {
            if (!perm?.Update) navigate('/')
        }, [perm])
    return <div>
        <ComboBox title="Тема" items={themes} displayValue={(v) => v?.name || ""} value={selectedTheme} onChange={v => setSelectedTheme(v)} />
        <Button caption="Установить" onClick={() => setTheme(selectedTheme.id)} />
    </div>
}