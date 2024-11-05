import { useEffect, useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import ComboBox from "../../inputs/ComboBox"
import { addSpecToCharAtom, deleteSpecToCharAtom } from "../../../atoms/materials/chars"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import TableData, { TableDataRow } from "../../TableData"
import { InputType } from "../../../types/property"
import messages from "../../../server/messages"
import EditContainer from "../../EditContainer"
import { userAtom } from "../../../atoms/users"
import { RESOURCE } from "../../../types/user"
import { specListAtom, specToCharAtom } from "../../../atoms/specification"
import { charAtom } from "../../../atoms/materials/chars"

export default function EditSpecToChars() {
    const { permissions } = useAtomValue(userAtom)
    const addSpecToChar = useSetAtom(addSpecToCharAtom)
    const deleteSpecToChar = useSetAtom(deleteSpecToCharAtom)
    const perm = permissions.get(RESOURCE.MATERIALS_DB)
    const specList = useAtomValue(specListAtom)
    const char = useAtomValue(charAtom)
    const specToChar = useAtomValue(specToCharAtom)
    const initialSpecId = useMemo(() => [...specList.keys()][0] || 0, [specList])
    const [selectedSpecId, setSelectedSpecId] = useState(initialSpecId)
    const charList = useMemo(() => specToChar.filter(s => s.id === selectedSpecId).map(s => s.charId), [specToChar, selectedSpecId])
    const allCharList = [...char.keys()].filter(c => char.get(c)?.char_type_id === specList.get(selectedSpecId)?.charType)
    const initialCharId = useMemo(() => charList[0] || 0, [charList])
    const [selectedCharId, setSelectedCharId] = useState(initialCharId)
    const heads = ['Наименование', 'Код']
    const contents: TableDataRow[] = []
    charList.forEach(ch => (contents.push({ key: ch, data: [char.get(ch)?.name, char.get(ch)?.code] })))
    const editItems: EditDataItem[] = [
        { caption: "Характеристика:", value: selectedCharId, valueCaption: value => char.get(value as number)?.name || "", list: allCharList, message: messages.ENTER_CAPTION, type: InputType.LIST },
    ]
    useEffect(() => {
        setSelectedCharId(charList[0] || 0)
    }, [charList])
    return <EditContainer>
        <div>
            <div className="d-flex flex-nowrap gap-2 align-items-start">
                <ComboBox<number> title="Номенклатура: " value={selectedSpecId} items={[...specList.keys()]} displayValue={(value => specList.get(value)?.name || "")} 
                    onChange={value => { setSelectedSpecId(value) }} />
            </div>
            <hr />
            {contents.length > 0 && <TableData heads={heads} content={contents} onSelectKey={key => { setSelectedCharId(key as number) }} />}
        </div>
        {(perm?.Read && contents.length > 0) ? <EditDataSection name={specList.get(selectedSpecId)?.name + "" + char.get(selectedCharId)?.name} items={editItems}
            onDelete={perm?.Delete ? async () => {
                const result = await deleteSpecToChar({ id: selectedSpecId, charId: selectedCharId })
                setSelectedCharId(charList[0] || 0)
                return result
            } : undefined}
            onAdd={perm?.Create ? async (checked, values) => {
                const charId = values[0] as number
                if (specToChar.find(s => s.charId === charId)) { return { success: false, message: messages.MATERIAL_EXIST } }
                const result = await addSpecToChar({ id: selectedSpecId, charId })
                return result
            } : undefined} /> : <div></div>}
    </EditContainer>
}
