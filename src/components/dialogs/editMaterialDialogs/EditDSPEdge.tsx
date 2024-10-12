import { useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { DSP_EDGE_ZAGL, FasadMaterial } from "../../../types/materials"
import { edgeListAtom } from "../../../atoms/materials/edges"
import messages from "../../../server/messages"
import { materialListAtom } from "../../../atoms/materials/materials"
import { FASAD_TYPE } from "../../../types/enums"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import TableData from "../../TableData"
import { InputType } from "../../../types/property"
import EditContainer from "../../EditContainer"
import { userAtom } from "../../../atoms/users"
import { RESOURCE } from "../../../types/user"
import { addDspEdgeAtom, deleteDspEdgeAtom, dspEdgeListAtom, updateDspEdgeAtom } from "../../../atoms/materials/dsp_edge"
import { zaglushkaListAtom } from "../../../atoms/materials/zaglushka"

export default function EditDSPEdge() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MATERIALS)
    const edgeNotSortedList = useAtomValue(edgeListAtom)
    const zagNotSortedList = useAtomValue(zaglushkaListAtom)
    const dspEdgeNotSortedList = useAtomValue(dspEdgeListAtom)
    const materialList = useAtomValue(materialListAtom)
    const dspList = useMemo(() => materialList.filter(mat => mat.type === FASAD_TYPE.DSP), [materialList])
    const dspEdgeList = useMemo(() => dspEdgeNotSortedList.map(m =>
        ({
            dsp: materialList.find(mat => mat.id === m.matId),
            edge: edgeNotSortedList.find(e => e.id === m.edgeId),
            zaglushka: zagNotSortedList.find(z => z.id === m.zaglushkaId)
        })).toSorted((m1, m2) => (m1.dsp && m2.dsp) && (m1.dsp?.name > m2.dsp.name) ? 1 : -1),
        [dspEdgeNotSortedList, edgeNotSortedList, zagNotSortedList])
    const mList = useMemo(() => dspList.map((m: FasadMaterial) => m.name), [materialList])
    const edgeList = useMemo(() => edgeNotSortedList.toSorted((e1, e2) => e1?.name > e2?.name ? 1 : -1).map(e => e.name), [edgeNotSortedList])
    const zagList = useMemo(() => zagNotSortedList.toSorted((e1, e2) => e1?.name > e2?.name ? 1 : -1).map(e => e.name), [zagNotSortedList])
    const [selectedIndex, setSelectedIndex] = useState(0)
    const { dsp, edge, zaglushka } = dspEdgeList[selectedIndex] 
    const deleteDspEdge = useSetAtom(deleteDspEdgeAtom)
    const addDspEdge = useSetAtom(addDspEdgeAtom)
    const updateDspEdge = useSetAtom(updateDspEdgeAtom)
    const heads = ['ДСП', 'Кромка', 'Заглушка']
    const contents = dspEdgeList.map(item => [item.dsp?.name, item.edge?.name, item.zaglushka?.name])
    const editItems: EditDataItem[] = [
        { caption: "ДСП:", value: dsp?.name || "", message: messages.ENTER_CAPTION, type: InputType.LIST, list: mList },
        { caption: "Кромка:", value: edge?.name || "", message: messages.ENTER_CODE, type: InputType.LIST, list: edgeList },
        { caption: "Заглушка:", value: zaglushka?.name || "", message: messages.ENTER_CODE, type: InputType.LIST, list: zagList },
    ]
    return <EditContainer>
        <TableData heads={heads} content={contents} onSelectRow={(index) => { setSelectedIndex(index) }} />
        {(perm?.Read) ? <EditDataSection items={editItems}
            onUpdate={perm?.Update ? async (checked, values) => {
                const usedEdgeId = checked[1] ? edgeNotSortedList.find(e => e.name === values[1])?.id : -1
                const usedZagId = checked[2] ? zagNotSortedList.find(z => z.name === values[2]) : -1
                const result = await updateDspEdge({ matId: dspEdgeList[selectedIndex].dsp?.id, edgeId: usedEdgeId, zaglushkaId: usedZagId })
                return result
            } : undefined}
            onAdd={perm?.Create ? async (checked, values) => {
                const usedMatId = checked[0] ? dspList.find(d=>d.name===values[0])?.id : -1
                const usedEdgeId = checked[1] ? edgeNotSortedList.find(e => e.name === values[1])?.id : -1
                const usedZagId = checked[2] ? zagNotSortedList.find(z => z.name === values[2])?.id : -1
                const result = await addDspEdge({ matId: usedMatId||-1, edgeId: usedEdgeId || -1, zaglushkaId: usedZagId || -1 })
                return result
            } : undefined}
            onDelete={perm?.Delete ? async () => {
                const result = await deleteDspEdge(dspEdgeList[selectedIndex].dsp?.id || -1)
                setSelectedIndex(0)
                return result
            } : undefined}
        /> : <div></div>}

    </EditContainer>
}


