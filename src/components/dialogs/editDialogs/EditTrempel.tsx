import { useEffect, useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { Trempel } from "../../../types/materials"
import useMessage from "../../../custom-hooks/useMessage"
import useConfirm from "../../../custom-hooks/useConfirm"
import { trempelListAtom, updateTrempelAtom } from "../../../atoms/materials/trempel"
import { rusMessages } from "../../../functions/messages"
import { EditDialogProps } from "../EditMaterialDialog"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import { InputType } from "../../../types/property"
import TableData from "../../TableData"

export default function EditTrempel(props: EditDialogProps) {
    const trempelNoSortedList = useAtomValue(trempelListAtom)
    const trempelList = useMemo(() => trempelNoSortedList.toSorted((b1, b2) => b1.name > b2.name ? 1 : -1), [trempelNoSortedList])
    const [selectedIndex, setSelectedIndex] = useState(0)
    const { name, code } = trempelList[selectedIndex]
    const updateTrempel = useSetAtom(updateTrempelAtom)
    const showMessage = useMessage()
    const showConfirm = useConfirm()
    const heads = ['Наименование', 'Код']
    const contents = trempelList.map((i: Trempel) => [i.name, i.code])
    const editItems: EditDataItem[] = [
        { caption: "Наименование:", value: name, message: "Введите наименование", type: InputType.TEXT },
        { caption: "Код:", value: code, message: "Введите код", type: InputType.TEXT },
    ]
    useEffect(() => {
        setSelectedIndex(0)
    }, [trempelNoSortedList])
    return <>
        <TableData heads={heads} content={contents} onSelectRow={(index) => { setSelectedIndex(index) }} />
        <EditDataSection name={name} items={editItems}
            onUpdate={(checked, values, message) => {
                showConfirm(message, () => {
                    props.setLoading(true)
                    const usedName = checked[0] ? values[0] : ""
                    const usedCode = checked[1] ? values[1] : ""
                    updateTrempel({ name, newName: usedName, code: usedCode }, (result) => {
                        props.setLoading(false)
                        showMessage(rusMessages[result.message])
                    })
                })
            }}
        />
    </>
}
