import { useEffect, useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { addCharPurposeAtom, charPurposeAtom, deleteCharPurposeAtom, matPurposeAtom, updateCharPurposeAtom } from "../../../atoms/materials/chars"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import TableData, { TableDataRow } from "../../inputs/TableData"
import { InputType } from "../../../types/property"
import messages from "../../../server/messages"
import EditContainer from "../../EditContainer"
import { userAtom } from "../../../atoms/users"
import { RESOURCE } from "../../../types/user"
import { charAtom } from "../../../atoms/materials/chars"
import { CHAR_PURPOSE, CHAR_TYPE } from "../../../types/enums"

export default function EditCharPurpose() {
    const { permissions } = useAtomValue(userAtom)
    const addCharPurpose = useSetAtom(addCharPurposeAtom)
    const updateCharPurpose= useSetAtom(updateCharPurposeAtom)
    const deleteCharPurpose = useSetAtom(deleteCharPurposeAtom)
    const charPurposes = useAtomValue(charPurposeAtom)
    const matPurposes = useAtomValue(matPurposeAtom)
    const perm = permissions.get(RESOURCE.MATERIALS_DB)
    const char = useAtomValue(charAtom)
    const allCharList = [...char.keys()].filter(c => char.get(c)?.char_type_id === CHAR_TYPE.COLOR)
    const [selectedCharId, setSelectedCharId] = useState(charPurposes[0].charId)
    const selectedPurposeId = charPurposes.find(cp => cp.charId === selectedCharId)?.purposeId || CHAR_PURPOSE.BOTH
    //const [selectedPurposeId, setSelectedPurposeId] = useState(charPurposes[initialCharId].purposeId)
    const heads = [{ caption: 'Наименование', sorted: true }, { caption: 'Код', sorted: true }, { caption: 'Назначение', sorted: true }]
    const contents: TableDataRow[] = []
    charPurposes.forEach(ch => (contents.push({ key: ch.charId, data: [char.get(ch.charId)?.name, char.get(ch.charId)?.code, matPurposes.get(ch.purposeId)] })))
    const editItems: EditDataItem[] = [
        { title: "Характеристика:", value: selectedCharId, displayValue: value => char.get(value as number)?.name || "", list: allCharList, message: messages.ENTER_CAPTION, inputType: InputType.LIST },
        { title: "Назначение:", value: selectedPurposeId, displayValue: value => matPurposes.get(value as number) || "", list: [...matPurposes.keys()], message: messages.ENTER_CAPTION, inputType: InputType.LIST },
    ]
    useEffect(() => {
        setSelectedCharId(charPurposes[0].charId)
    }, [charPurposes])
    return <EditContainer>
        <div>
            {contents.length > 0 && <TableData header={heads} content={contents} onSelectRow={key => { setSelectedCharId(key as number) }} />}
        </div>
        {(perm?.Read && contents.length > 0) ? <EditDataSection name={char.get(selectedCharId)?.name} items={editItems}
            onDelete={perm?.Delete ? async () => {
                const result = await deleteCharPurpose(selectedCharId)
                setSelectedCharId(0)
                return result
            } : undefined}
            onAdd={perm?.Create ? async (checked, values) => {
                const charId = values[0] as number
                const purposeId = values[1] as number
                if (charPurposes.find(s => s.charId === charId)) { return { success: false, message: messages.MATERIAL_EXIST } }
                const result = await addCharPurpose({ charId, purposeId })
                return result
            } : undefined} 
            onUpdate={perm?.Update ? async (checked, values) => {
                const charId = values[0] as number
                const purposeId = values[1] as number
                const result = await updateCharPurpose({ charId: selectedCharId, purposeId: selectedPurposeId }, { charId, purposeId })
                return result
            } : undefined} 
            /> : <div></div>}
    </EditContainer>
}
