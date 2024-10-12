import { useEffect, useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { Uplotnitel } from "../../../types/materials"
import messages from "../../../server/messages"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import { InputType } from "../../../types/property"
import TableData from "../../TableData"
import { addUplotnitelAtom, deleteUplotnitelAtom, updateUplotnitelAtom, uplotnitelListAtom } from "../../../atoms/materials/uplotnitel"
import EditContainer from "../../EditContainer"
import { userAtom } from "../../../atoms/users"
import { RESOURCE } from "../../../types/user"

export default function EditUplotnitel() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MATERIALS)
    const noSortedList = useAtomValue(uplotnitelListAtom)
    const list = useMemo(() => noSortedList.toSorted((i1, i2) => i1.name > i2.name ? 1 : -1), [noSortedList])
    const [selectedIndex, setSelectedIndex] = useState(0)
    const { id, name, code } = list[selectedIndex] 
    const deleteUplotnitel = useSetAtom(deleteUplotnitelAtom)
    const addUplotnitel = useSetAtom(addUplotnitelAtom)
    const updateUplotnitel = useSetAtom(updateUplotnitelAtom)
    const heads = ['Наименование', 'Код']
    const contents = list.map((i: Uplotnitel) => [i.name, i.code])
    const editItems: EditDataItem[] = [
        { caption: "Наименование:", value: name || "", message: messages.ENTER_CAPTION, type: InputType.TEXT },
        { caption: "Код:", value: code, message: messages.ENTER_CODE, type: InputType.TEXT },
    ]
    useEffect(() => {
        setSelectedIndex(0)
    }, [noSortedList])
    return <EditContainer>
        <TableData heads={heads} content={contents} onSelectRow={(index) => { setSelectedIndex(index) }} />
        {(perm?.Read) ? <EditDataSection name={name} items={editItems}
            onUpdate={perm?.Update ? async (checked, values) => {
                const name = values[0]
                const code = values[1]
                const result = await updateUplotnitel({ id, name, code })
                return result
            } : undefined}
            onDelete={perm?.Delete ? async () => {
                const result = await deleteUplotnitel(id)
                setSelectedIndex(0)
                return result
            } : undefined}
            onAdd={async (checked, values) => {
                const name = values[0] as string
                const code = values[1] as string
                const result = await addUplotnitel({ name, code })
                return result
            }} /> : <div></div>}
    </EditContainer>
}
