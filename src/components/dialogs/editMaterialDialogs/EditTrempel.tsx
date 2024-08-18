import { useEffect, useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { Trempel } from "../../../types/materials"
import { trempelListAtom, updateTrempelAtom } from "../../../atoms/materials/trempel"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import { InputType } from "../../../types/property"
import TableData from "../../TableData"
import EditContainer from "../../EditContainer"
import { userAtom } from "../../../atoms/users"
import { RESOURCE } from "../../../types/user"
import messages from "../../../server/messages"

export default function EditTrempel() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MATERIALS)
    const trempelNoSortedList = useAtomValue(trempelListAtom)
    const trempelList = useMemo(() => trempelNoSortedList.toSorted((b1, b2) => b1.caption > b2.caption ? 1 : -1), [trempelNoSortedList])
    const [selectedIndex, setSelectedIndex] = useState(0)
    const { name, caption, code } = trempelList[selectedIndex] || { name: "", caption: "", code: "" }
    const updateTrempel = useSetAtom(updateTrempelAtom)
    const heads = ['Наименование', 'Код']
    const contents = trempelList.map((i: Trempel) => [i.caption, i.code])
    const editItems: EditDataItem[] = [
        { caption: "Наименование:", value: caption, message: messages.ENTER_CAPTION, type: InputType.TEXT },
        { caption: "Код:", value: code, message: messages.ENTER_CODE, type: InputType.TEXT },
    ]
    useEffect(() => {
        setSelectedIndex(0)
    }, [trempelNoSortedList])
    return <EditContainer>
        <TableData heads={heads} content={contents} onSelectRow={(index) => { setSelectedIndex(index) }} />
        {(perm?.Create || perm?.Update || perm?.Delete) ? <EditDataSection name={name} items={editItems}
            onUpdate={perm?.Update ? async (checked, values) => {
                const usedCaption = checked[0] ? values[0] : ""
                const usedCode = checked[1] ? values[1] : ""
                const result = await updateTrempel({ name, caption: usedCaption, code: usedCode })
                return result
            } : undefined}
        /> : <div></div>}
    </EditContainer>
}
