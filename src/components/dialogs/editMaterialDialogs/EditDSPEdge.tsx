import { useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { kromkaListAtom } from "../../../atoms/materials/kromka"
import messages from "../../../server/messages"
import { materialListAtom } from "../../../atoms/materials/materials"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import TableData from "../../TableData"
import { InputType } from "../../../types/property"
import EditContainer from "../../EditContainer"
import { userAtom } from "../../../atoms/users"
import { RESOURCE } from "../../../types/user"
import { addDspEdgeAtom, deleteDspEdgeAtom, dspKromkaZaglListAtom, updateDspEdgeAtom } from "../../../atoms/materials/dsp_kromka_zagl"
import { zaglushkaListAtom } from "../../../atoms/materials/zaglushka"
import { useMapValue } from "../../../custom-hooks/useMaterialMap"
import { FASAD_TYPE } from "../../../types/enums"

export default function EditDSPEdge() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MATERIALS)
    const kromkaList = useAtomValue(kromkaListAtom).toSorted((e1, e2) => e1.name > e2.name ? 1 : -1)
    const zagList = useAtomValue(zaglushkaListAtom).toSorted((e1, e2) => e1.name > e2.name ? 1 : -1)
    const matAllList = useAtomValue(materialListAtom)
    const matList = useMemo(() => matAllList.filter(m => m.type === FASAD_TYPE.DSP).toSorted((e1, e2) => e1.name > e2.name ? 1 : -1), [matAllList])
    const dspMap = useMapValue(matList, value => value.name)
    const zagMap = useMapValue(zagList, value => value.name)
    const edgeMap = useMapValue(kromkaList, value => value.name)
    const dspEdgeZagNotSortedList = useAtomValue(dspKromkaZaglListAtom)
    const dspEdgeZagList = useMemo(() => dspEdgeZagNotSortedList.toSorted((d1, d2) => (dspMap.get(d1.dspId) as string) > (dspMap.get(d2.dspId) as string) ? 1 : -1), [dspEdgeZagNotSortedList])
    const [selectedIndex, setSelectedIndex] = useState(0)
    const dspIdList = matList.map(m => m.id)
    const kromkaIdList = kromkaList.map(d => d.id)
    const zagIdList = zagList.map(d => d.id)
    const { dspId, kromkaId: edgeId, zaglushkaId } = dspEdgeZagList[selectedIndex] 
    const deleteDspEdge = useSetAtom(deleteDspEdgeAtom)
    const addDspEdge = useSetAtom(addDspEdgeAtom)
    const updateDspEdge = useSetAtom(updateDspEdgeAtom)
    const heads = ['ДСП', 'Кромка', 'Заглушка']
    const contents = dspEdgeZagList.map(item => [dspMap.get(item.dspId), edgeMap.get(item.kromkaId), zagMap.get(item.zaglushkaId)])
    const editItems: EditDataItem[] = [
        { caption: "ДСП:", value: dspId, valueCaption: value => dspMap.get(value), message: messages.ENTER_CAPTION, type: InputType.LIST, list: dspIdList },
        { caption: "Кромка:", value: edgeId, valueCaption: value => edgeMap.get(value), message: messages.ENTER_CODE, type: InputType.LIST, list: kromkaIdList },
        { caption: "Заглушка:", value: zaglushkaId, valueCaption: value => zagMap.get(value), message: messages.ENTER_CODE, type: InputType.LIST, list: zagIdList },
    ]
    return <EditContainer>
        <TableData heads={heads} content={contents} onSelectRow={(index) => { setSelectedIndex(index) }} />
        {(perm?.Read) ? <EditDataSection name={dspMap.get(dspId)} items={editItems}
            onUpdate={perm?.Update ? async (checked, values) => {
                const usedKromkaId = checked[1] ? values[1] : 0
                const usedZagId = checked[2] ? values[2] : 0
                const result = await updateDspEdge({ dspId: dspEdgeZagList[selectedIndex].dspId, kromkaId: usedKromkaId, zaglushkaId: usedZagId })
                return result
            } : undefined}
            onAdd={perm?.Create ? async (checked, values) => {
                const usedDspId = values[0]
                const usedKromkaId = values[1] 
                const usedZagId = values[2] 
                const result = await addDspEdge({ dspId: usedDspId, kromkaId: usedKromkaId, zaglushkaId: usedZagId })
                return result
            } : undefined}
            onDelete={perm?.Delete ? async () => {
                const result = await deleteDspEdge(dspEdgeZagList[selectedIndex].dspId || -1)
                setSelectedIndex(0)
                return result
            } : undefined}
        /> : <div></div>}

    </EditContainer>
}


