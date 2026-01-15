import { useAtomValue, useSetAtom } from "jotai"
import { setThemeAtom, themesAtom, useCurrentTheme } from "../atoms/themes"
import ComboBox from "./inputs/ComboBox"
import { useState } from "react"
import Button from "./inputs/Button"

export default function Settings(){
    const themes = useAtomValue(themesAtom)
    const currentTheme = useCurrentTheme()
    const [selectedTheme, setSelectedTheme] = useState(currentTheme )
    const setTheme = useSetAtom(setThemeAtom)
    return <div>
        <ComboBox title="Тема" items={themes} displayValue={(v) => v?.name || ""} value={selectedTheme} onChange={v => setSelectedTheme(v)} />
        <Button caption="Установить" onClick={() => setTheme(selectedTheme.id)} />
    </div>
}