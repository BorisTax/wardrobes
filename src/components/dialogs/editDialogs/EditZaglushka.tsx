import { useEffect, useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { Zaglushka, ExtMaterial } from "../../../types/materials"
import { addZaglushkaAtom, deleteZaglushkaAtom, zaglushkaListAtom, updateZaglushkaAtom } from "../../../atoms/materials/zaglushka"
import messages from "../../../server/messages"
import { materialListAtom } from "../../../atoms/materials/materials"
import { FasadMaterial } from "../../../types/enums"
import { EditDialogProps } from "../EditMaterialDialog"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import { InputType } from "../../../types/property"
import TableData from "../../TableData"

export default function EditZaglushka(props: EditDialogProps) {
    const zaglushkaNoSortedList = useAtomValue(zaglushkaListAtom)
    const zaglushkaList = useMemo(() => zaglushkaNoSortedList.toSorted((i1, i2) => i1.name > i2.name ? 1 : -1), [zaglushkaNoSortedList])
    const materialList = useAtomValue(materialListAtom)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const mList = useMemo(() => materialList.filter(mat => mat.material === FasadMaterial.DSP).map((m: ExtMaterial) => m.name), [materialList])
    const { name, dsp, code } = zaglushkaList[selectedIndex]
    const deleteZaglushka = useSetAtom(deleteZaglushkaAtom)
    const addZaglushka = useSetAtom(addZaglushkaAtom)
    const updateZaglushka = useSetAtom(updateZaglushkaAtom)
    const heads = ['Наименование', 'Код', 'Соответствие ДСП']
    const contents = zaglushkaList.map((i: Zaglushka) => [i.name, i.code, i.dsp])
    const editItems: EditDataItem[] = [
        { caption: "Наименование:", value: name || "", message: "Введите наименование", type: InputType.TEXT },
        { caption: "Код:", value: code, message: "Введите код", type: InputType.TEXT },
        { caption: "Соответствие ДСП:", value: dsp, list: mList, message: "Выберите ДСП", type: InputType.LIST },
    ]
    useEffect(() => {
        setSelectedIndex(0)
    }, [zaglushkaList])
    return <>
        <TableData heads={heads} content={contents} onSelectRow={(index) => { setSelectedIndex(index) }} />
        <EditDataSection name={name} items={editItems}
            onUpdate={async (checked, values) => {
                const usedName = checked[0] ? values[0] : ""
                const usedCode = checked[1] ? values[1] : ""
                const usedDSP = checked[2] ? values[2] : ""
                const result = await updateZaglushka({ name, newName: usedName, code: usedCode, dsp: usedDSP })
                return result
            }}
            onDelete={async (name) => {
                const result = await deleteZaglushka(zaglushkaList[selectedIndex])
                setSelectedIndex(0)
                return result
            }}
            onAdd={async (checked, values) => {
                const name = values[0]
                const code = values[1]
                const dsp = values[2]
                if (zaglushkaList.find((p: Zaglushka) => p.name === name)) { return { success: false, message: messages.ZAGLUSHKA_EXIST } }
                const result = await addZaglushka({ name, dsp, code })
                return result
            }} />
    </>
}
