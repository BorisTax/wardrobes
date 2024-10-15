import { useEffect, useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { Zaglushka, FasadMaterial } from "../../../types/materials"
import { addZaglushkaAtom, deleteZaglushkaAtom, zaglushkaListAtom, updateZaglushkaAtom } from "../../../atoms/materials/zaglushka"
import messages from "../../../server/messages"
import { materialListAtom } from "../../../atoms/materials/chars"
import { FASAD_TYPE } from "../../../types/enums"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import { InputType } from "../../../types/property"
import TableData from "../../TableData"
import EditContainer from "../../EditContainer"
import { userAtom } from "../../../atoms/users"
import { RESOURCE } from "../../../types/user"

export default function EditZaglushka() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MATERIALS)
    const zaglushkaNoSortedList = useAtomValue(zaglushkaListAtom)
    const zaglushkaList = useMemo(() => zaglushkaNoSortedList.toSorted((i1, i2) => i1.name > i2.name ? 1 : -1), [zaglushkaNoSortedList])
    const materialList = useAtomValue(materialListAtom)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const mList = useMemo(() => materialList.filter(mat => mat.type === FASAD_TYPE.DSP).map((m: FasadMaterial) => m.name), [materialList])
    const { id, name, code } = zaglushkaList[selectedIndex] || { name: "", code: "" }
    const deleteZaglushka = useSetAtom(deleteZaglushkaAtom)
    const addZaglushka = useSetAtom(addZaglushkaAtom)
    const updateZaglushka = useSetAtom(updateZaglushkaAtom)
    const heads = ['Наименование', 'Код']
    const contents = zaglushkaList.map((i: Zaglushka) => [i.name, i.code])
    const editItems: EditDataItem[] = [
        { caption: "Наименование:", value: name || "", message: messages.ENTER_CAPTION, type: InputType.TEXT },
        { caption: "Код:", value: code, message: messages.ENTER_CODE, type: InputType.TEXT },
    ]
    useEffect(() => {
        setSelectedIndex(0)
    }, [zaglushkaList])
    return <EditContainer>
        <TableData heads={heads} content={contents} onSelectRow={(index) => { setSelectedIndex(index) }} />
        {(perm?.Read) ? <EditDataSection name={name} items={editItems}
            onUpdate={perm?.Update ? async (checked, values) => {
                const usedName = checked[0] ? values[0] : ""
                const usedCode = checked[1] ? values[1] : ""
                const result = await updateZaglushka({ id, name: usedName as string, code: usedCode as string })
                return result
            } : undefined}
            onDelete={perm?.Delete ? async () => {
                const result = await deleteZaglushka(zaglushkaList[selectedIndex])
                setSelectedIndex(0)
                return result
            } : undefined}
            onAdd={perm?.Create ? async (_, values) => {
                const name = values[0] as string
                const code = values[1] as string
                if (zaglushkaList.find((p: Zaglushka) => p.name === name)) { return { success: false, message: messages.MATERIAL_EXIST } }
                const result = await addZaglushka({ name, code })
                return result
            } : undefined} /> : <div></div>}
    </EditContainer>
}
