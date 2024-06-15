import { useEffect, useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { Brush } from "../../../types/materials"
import { addBrushAtom, deleteBrushAtom, brushListAtom, updateBrushAtom } from "../../../atoms/materials/brush"
import messages from "../../../server/messages"
import { EditDialogProps } from "../EditMaterialDialog"
import { InputType } from "../../../types/property"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import TableData from "../../TableData"

export default function EditBrush(props: EditDialogProps) {
    const brushNoSortedList = useAtomValue(brushListAtom)
    const brushList = useMemo(() => brushNoSortedList.toSorted((b1, b2) => b1.name > b2.name ? 1 : -1), [brushNoSortedList])
    const [selectedIndex, setSelectedIndex] = useState(0)
    const {name, code} = brushList[selectedIndex]
    const deleteBrush = useSetAtom(deleteBrushAtom)
    const addBrush = useSetAtom(addBrushAtom)
    const updateBrush = useSetAtom(updateBrushAtom)
    const heads = ['Наименование', 'Код']
    const contents = brushList.map((i: Brush) => [i.name, i.code])
    const editItems: EditDataItem[] = [
        { caption: "Наименование:", value: name, message: "Введите наименование", type: InputType.TEXT },
        { caption: "Код:", value: code, message: "Введите код", type: InputType.TEXT },
    ]
    useEffect(() => {
        setSelectedIndex(0)
    }, [brushList])
    return <>
        <TableData heads={heads} content={contents} onSelectRow={(index) => { setSelectedIndex(index) }} />
        <EditDataSection name={name} items={editItems}
            onUpdate={async (checked, values) => {
                const usedName = checked[0] ? values[0] : ""
                const usedCode = checked[1] ? values[1] : ""
                const result = await updateBrush({ name, newName: usedName, code: usedCode })
                return result
            }}
            onDelete={async (name) => {
                const index = brushList.findIndex((p: Brush) => p.name === name)
                const result = await deleteBrush(brushList[index])
                setSelectedIndex(0)
                return result
            }}
            onAdd={async (checked, values) => {
                const name = values[0]
                const code = values[1]
                if (brushList.find((p: Brush) => p.name === name)) { return { success: false, message: messages.BRUSH_EXIST } }
                const result = await addBrush({ name, code })
                return result
            }} />
    </>
}
