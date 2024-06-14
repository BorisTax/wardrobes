import { useEffect, useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { Brush } from "../../../types/materials"
import useMessage from "../../../custom-hooks/useMessage"
import useConfirm from "../../../custom-hooks/useConfirm"
import { addBrushAtom, deleteBrushAtom, brushListAtom, updateBrushAtom } from "../../../atoms/materials/brush"
import { rusMessages } from "../../../functions/messages"
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
    const showMessage = useMessage()
    const showConfirm = useConfirm()
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
            onUpdate={(checked, values, message) => {
                const usedName = checked[0] ? values[0] : ""
                const usedCode = checked[1] ? values[1] : ""
                showConfirm(message, () => {
                    props.setLoading(true)
                    updateBrush({ name, newName: usedName, code: usedCode }, (result) => {
                        props.setLoading(false)
                        showMessage(rusMessages[result.message])
                    })
                })
            }}
            onDelete={(name, message) => {
                const index = brushList.findIndex((p: Brush) => p.name === name)
                showConfirm(message, () => {
                    props.setLoading(true)
                    deleteBrush(brushList[index], (result) => {
                        props.setLoading(false)
                        showMessage(rusMessages[result.message])
                    });
                    setSelectedIndex(0)
                })
            }}
            onAdd={(checked, values, message) => {
                const name = values[0]
                const code = values[1]
                if (brushList.find((p: Brush) => p.name === name)) { showMessage(rusMessages[messages.BRUSH_EXIST]); return }
                showConfirm(message, () => {
                    props.setLoading(true)
                    addBrush({ name, code }, (result) => {
                        props.setLoading(false)
                        showMessage(rusMessages[result.message])
                    });
                })
            }} />
    </>
}
