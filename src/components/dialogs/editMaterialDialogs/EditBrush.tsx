import { useEffect, useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { Brush } from "../../../types/materials"
import { addBrushAtom, deleteBrushAtom, brushListAtom, updateBrushAtom } from "../../../atoms/materials/brush"
import messages from "../../../server/messages"
import { InputType } from "../../../types/property"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import TableData from "../../TableData"
import EditContainer from "../../EditContainer"
import { userAtom } from "../../../atoms/users"
import { RESOURCE } from "../../../types/user"

export default function EditBrush() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MATERIALS)
    const brushNoSortedList = useAtomValue(brushListAtom)
    const brushList = useMemo(() => brushNoSortedList.toSorted((b1, b2) => b1.name > b2.name ? 1 : -1), [brushNoSortedList])
    const [selectedIndex, setSelectedIndex] = useState(0)
    const { name, code } = brushList[selectedIndex] || { name: "", code: "" }
    const deleteBrush = useSetAtom(deleteBrushAtom)
    const addBrush = useSetAtom(addBrushAtom)
    const updateBrush = useSetAtom(updateBrushAtom)
    const heads = ['Наименование', 'Код']
    const contents = brushList.map((i: Brush) => [i.name, i.code])
    const editItems: EditDataItem[] = [
        { caption: "Наименование:", value: name, message: messages.ENTER_CAPTION, type: InputType.TEXT },
        { caption: "Код:", value: code, message: messages.ENTER_CODE, type: InputType.TEXT },
    ]
    useEffect(() => {
        setSelectedIndex(0)
    }, [brushList])
    return <EditContainer>
        <TableData heads={heads} content={contents} onSelectRow={(index) => { setSelectedIndex(index) }} />
        {(perm?.Create || perm?.Update || perm?.Delete) ? <EditDataSection name={name} items={editItems}
            onUpdate={perm?.Update ? async (checked, values) => {
                const usedName = checked[0] ? values[0] : ""
                const usedCode = checked[1] ? values[1] : ""
                const result = await updateBrush({ name, newName: usedName, code: usedCode })
                return result
            } : undefined}
            onDelete={perm?.Delete ? async (name) => {
                const index = brushList.findIndex((p: Brush) => p.name === name)
                const result = await deleteBrush(brushList[index])
                setSelectedIndex(0)
                return result
            } : undefined}
            onAdd={perm?.Create ? async (checked, values) => {
                const name = values[0] as string
                const code = values[1] as string
                if (brushList.find((p: Brush) => p.name === name)) { return { success: false, message: messages.MATERIAL_EXIST } }
                const result = await addBrush({ name, code })
                return result
            } : undefined} /> : <div></div>}
    </EditContainer>
}
