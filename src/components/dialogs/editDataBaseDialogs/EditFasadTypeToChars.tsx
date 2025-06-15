import { useEffect, useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import ComboBox from "../../inputs/ComboBox"
import { addFasadTypeToCharAtom, addSpecToCharAtom, deleteFasadTypeToCharAtom, deleteSpecToCharAtom, fasadTypesToCharAtom, updateFasadTypeToCharAtom } from "../../../atoms/materials/chars"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import TableData, { TableDataRow } from "../../inputs/TableData"
import { InputType } from "../../../types/property"
import messages from "../../../server/messages"
import EditContainer from "../../EditContainer"
import { userAtom } from "../../../atoms/users"
import { RESOURCE } from "../../../types/user"
import { specListAtom, specToCharAtom } from "../../../atoms/specification"
import { charAtom } from "../../../atoms/materials/chars"
import { fasadTypesAtom } from "../../../atoms/storage"

export default function EditFasadTypeToChars() {
    const { permissions } = useAtomValue(userAtom)
    const addFasadTypeToChar = useSetAtom(addFasadTypeToCharAtom)
    const updateFasadTypeToChar = useSetAtom(updateFasadTypeToCharAtom)
    const deleteFasadTypeToChar = useSetAtom(deleteFasadTypeToCharAtom)
    const allFasadTypeToChar = useAtomValue(fasadTypesToCharAtom)
    const fasadTypes = useAtomValue(fasadTypesAtom)
    const perm = permissions.get(RESOURCE.MATERIALS_DB)
    const char = useAtomValue(charAtom)
    const specList = useAtomValue(specListAtom)
    const initialFasadTypeId = useMemo(() => [...fasadTypes.keys()][0] || 0, [fasadTypes])
    const [selectedId, setSelectedId] = useState(initialFasadTypeId)
    const fasadTypeToChar = useMemo(() => allFasadTypeToChar.filter(s => s.id === selectedId), [allFasadTypeToChar, selectedId])
    const charList = useMemo(() => fasadTypeToChar.filter(s => s.id === selectedId).map(s => s.charId), [fasadTypeToChar, selectedId])
    const allCharList = [...char.keys()].filter(c => char.get(c)?.char_type_id === specList.get(selectedId)?.charType)
    const initialCharId = useMemo(() => charList[0] || 0, [charList])
    const [selectedCharId, setSelectedCharId] = useState(initialCharId)
    const heads = [{ caption: 'Наименование', sorted: true }, { caption: 'Код', sorted: true }]
    const contents: TableDataRow[] = []
    charList.forEach(ch => (contents.push({ key: ch, data: [char.get(ch)?.name, char.get(ch)?.code] })))
    const editItems: EditDataItem[] = [
        { title: "Характеристика:", value: selectedCharId, displayValue: value => char.get(value as number)?.name || "", list: allCharList, message: messages.ENTER_CAPTION, inputType: InputType.LIST },
    ]
    useEffect(() => {
        setSelectedId(initialFasadTypeId)
    }, [fasadTypes])
    return <EditContainer>
        <div>
            <div className="d-flex flex-nowrap gap-2 align-items-start">
                <ComboBox<number> title="Тип фасада: " value={selectedId} items={[...fasadTypes.keys()]} displayValue={(value => fasadTypes.get(value) || "")} 
                    onChange={value => { setSelectedId(value) }} />
            </div>
            <hr />
            {contents.length > 0 && <TableData header={heads} content={contents} onSelectRow={key => { setSelectedCharId(key as number) }} />}
        </div>
        {(perm?.Read && contents.length > 0) ? <EditDataSection name={specList.get(selectedId)?.name + "" + char.get(selectedCharId)?.name} items={editItems}
            onDelete={perm?.Delete ? async () => {
                const result = await deleteFasadTypeToChar({ id: selectedId, charId: selectedCharId })
                setSelectedCharId(charList[0] || 0)
                return result
            } : undefined}
            onAdd={perm?.Create ? async (checked, values) => {
                const charId = values[0] as number
                if (fasadTypeToChar.find(s => s.charId === charId)) { return { success: false, message: messages.MATERIAL_EXIST } }
                const result = await addFasadTypeToChar({ id: selectedId, charId })
                return result
            } : undefined} /> : <div></div>}
    </EditContainer>
}
