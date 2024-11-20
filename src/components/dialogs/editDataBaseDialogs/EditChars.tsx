import { useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { addCharAtom, deleteCharAtom, updateCharAtom } from "../../../atoms/materials/chars"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import TableData, { TableDataRow } from "../../inputs/TableData"
import { InputType } from "../../../types/property"
import messages from "../../../server/messages"
import EditContainer from "../../EditContainer"
import { userAtom } from "../../../atoms/users"
import { RESOURCE } from "../../../types/user"
import { charAtom, charTypesAtom } from "../../../atoms/materials/chars"
import { useImageUrl } from "../../../custom-hooks/useImage"

export default function EditChars() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MATERIALS_DB)
    const updateChar = useSetAtom(updateCharAtom)
    const addChar = useSetAtom(addCharAtom)
    const deleteChar = useSetAtom(deleteCharAtom)

    const chars = useAtomValue(charAtom)
    const charTypes = useAtomValue(charTypesAtom)
    const initialCharId = useMemo(() => [...chars.keys()][0] || 0, [chars])
    const [selectedCharId, setSelectedCharId] = useState(initialCharId)
    const image = useImageUrl(selectedCharId)
    const heads = [{ caption: 'Наименование', sorted: true }, { caption: 'Код', sorted: true }, { caption: 'Тип', sorted: true }]
    const contents: TableDataRow[] = []
    chars.forEach((c, key) => contents.push({key, data: [c.name, c.code, charTypes.get(c.char_type_id)]}))
    const editItems: EditDataItem[] = [
        { caption: "Наименование:", value: chars.get(selectedCharId)?.name || "", message: messages.ENTER_CAPTION, type: InputType.TEXT },
        { caption: "Код:", value: chars.get(selectedCharId)?.code || "", message: messages.ENTER_CODE, type: InputType.TEXT },
        { caption: "Тип:", value: chars.get(selectedCharId)?.char_type_id || 0, valueCaption: (value) => charTypes.get(value as number) || "", list: [...charTypes.keys()], message: "", type: InputType.LIST },
        { caption: "Изображение:", value: image || "", message: messages.ENTER_IMAGE, type: InputType.FILE },
    ]
    return <EditContainer>
        <div>
            <TableData header={heads} content={contents} onSelectRow={value => { setSelectedCharId(value as number) }} />
        </div>
        {(perm?.Read) ? <EditDataSection name={chars.get(selectedCharId)?.name} items={editItems}
            onUpdate={perm?.Update ? async (checked, values) => {
                const name = checked[0] ? values[0] as string : ""
                const code = checked[1] ? values[1] as string : ""
                const char_type_id = checked[2] ? values[2] as number : 0
                const image = checked[3] ? values[3] as string : ""
                const result = await updateChar({ id: selectedCharId, char_type_id, name, code, image })
                return result
            } : undefined}
            onDelete={perm?.Delete ? async () => {
                const result = await deleteChar(selectedCharId)
                setSelectedCharId([...chars.keys()][0] || 0)
                return result
            } : undefined}
            onAdd={perm?.Create ? async (checked, values) => {
                const name = checked[0] ? values[0] as string : ""
                const code = checked[1] ? values[1] as string : ""
                const char_type_id = checked[2] ? values[2] as number : 0
                const image = checked[3] ? values[3] as string : ""
                const result = await addChar({ name, char_type_id, code, image })
                return result
            } : undefined} /> : <div></div>}
    </EditContainer>
}
