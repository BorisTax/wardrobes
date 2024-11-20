import {  useEffect, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import messages from "../../../server/messages"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import TableData, { TableDataRow } from "../../inputs/TableData"
import { InputType } from "../../../types/property"
import EditContainer from "../../EditContainer"
import { userAtom } from "../../../atoms/users"
import { RESOURCE } from "../../../types/user"
import { addDspEdgeAtom, deleteDspEdgeAtom, dspKromkaZaglListAtom, loadDspKromkaZagListAtom, updateDspEdgeAtom } from "../../../atoms/materials/dsp_kromka_zagl"
import { charArrayAtom, charAtom } from "../../../atoms/materials/chars"
import { specToCharAtom } from "../../../atoms/specification"
import { SpecItem } from "../../../types/specification"
import { CHAR_TYPE } from "../../../types/enums"

export default function EditDSPKromkaZagl() {
    const { permissions } = useAtomValue(userAtom)
    const loadDspEdge = useSetAtom(loadDspKromkaZagListAtom)
    const perm = permissions.get(RESOURCE.MATERIALS)
    const dspEdgeZag = useAtomValue(dspKromkaZaglListAtom)
    const char = useAtomValue(charAtom)
    const charArray = useAtomValue(charArrayAtom)
    const specToChar = useAtomValue(specToCharAtom)
    const dspList = specToChar.filter(s => s.id === SpecItem.DSP16).map(s => s.charId)
    const colors = charArray.filter(s => s.char_type_id === CHAR_TYPE.COLOR).map(s => s.id)
    const initialId = () => (dspEdgeZag.keys()).next().value || 0
    const [dspId, setDspId] = useState(initialId())
    const { kromkaId, zaglushkaId } = dspEdgeZag.get(dspId) || { kromkaId: 0, zaglushkaId: 0 }
    const deleteDspEdge = useSetAtom(deleteDspEdgeAtom)
    const addDspEdge = useSetAtom(addDspEdgeAtom)
    const updateDspEdge = useSetAtom(updateDspEdgeAtom)
    const heads = [{ caption: 'ДСП', sorted: true }, { caption: 'Кромка', sorted: true }, { caption: 'Заглушка', sorted: true }]
    const contents: TableDataRow[] = []
    dspEdgeZag.forEach((d, key) => contents.push({key, data: [char.get(key)?.name, char.get(d.kromkaId)?.name, char.get(d.zaglushkaId)?.name]}))
    const editItems: EditDataItem[] = [
        { caption: "ДСП:", value: dspId, valueCaption: value => char.get(value as number)?.name || "", message: messages.ENTER_CAPTION, type: InputType.LIST, list: dspList },
        { caption: "Кромка:", value: kromkaId, valueCaption: value => char.get(value as number)?.name || "", message: messages.ENTER_CODE, type: InputType.LIST, list: colors },
        { caption: "Заглушка:", value: zaglushkaId, valueCaption: value => char.get(value as number)?.name || "", message: messages.ENTER_CODE, type: InputType.LIST, list: colors },
    ]
    useEffect(()=>{
        loadDspEdge()
    }, [perm?.Read])
    return <EditContainer>
        <TableData header={heads} content={contents} onSelectRow={key => { setDspId(key as number) }} />
        {(perm?.Read) ? <EditDataSection name={char.get(dspId)?.name} items={editItems}
            onUpdate={perm?.Update ? async (checked, values) => {
                const usedKromkaId = checked[1] ? values[1] as number : 0
                const usedZagId = checked[2] ? values[2] as number : 0
                const result = await updateDspEdge({ id: dspId,kromkaId: usedKromkaId, zaglushkaId: usedZagId })
                return result
            } : undefined}
            onAdd={perm?.Create ? async (checked, values) => {
                const usedDspId = values[0]  as  number
                const usedKromkaId = values[1]  as  number
                const usedZagId = values[2]  as  number
                const result = await addDspEdge({ id: usedDspId, kromkaId: usedKromkaId, zaglushkaId: usedZagId })
                return result
            } : undefined}
            onDelete={perm?.Delete ? async () => {
                const result = await deleteDspEdge(dspId)
                setDspId(initialId())
                return result
            } : undefined}
        /> : <div></div>}

    </EditContainer>
}


