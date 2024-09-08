import { useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { DSP_EDGE_ZAGL, ExtMaterial } from "../../../types/materials"
import { edgeListAtom } from "../../../atoms/materials/edges"
import messages from "../../../server/messages"
import { materialListAtom } from "../../../atoms/materials/materials"
import { FasadMaterial } from "../../../types/enums"
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
    const edgeList = useMemo(() => edgeNotSortedList.toSorted((e1, e2) => e1?.name > e2?.name ? 1 : -1).map(e => e.name), [edgeNotSortedList])
    const zagList = useMemo(() => zagNotSortedList.toSorted((e1, e2) => e1?.name > e2?.name ? 1 : -1).map(e => e.name), [zagNotSortedList])
    const dspEdgeList = useMemo(() => dspEdgeNotSortedList.toSorted((e1, e2) => e1?.name > e2?.name ? 1 : -1), [dspEdgeNotSortedList])
    const materialList = useAtomValue(materialListAtom)
    const mList = useMemo(() => materialList.filter(mat => mat.material === FasadMaterial.DSP).map((m: ExtMaterial) => m.name), [materialList])
    const [selectedIndex, setSelectedIndex] = useState(0)
    const { name, edge, zaglushka } = dspEdgeList[selectedIndex] || { name: "", edge: "", zaglushka: "" } 
    const deleteDspEdge = useSetAtom(deleteDspEdgeAtom)
    const addDspEdge = useSetAtom(addDspEdgeAtom)
    const updateDspEdge = useSetAtom(updateDspEdgeAtom)
    const heads = ['ДСП', 'Кромка', 'Заглушка']
    const contents = dspEdgeList.map((i: DSP_EDGE_ZAGL) => [i.name, i.edge, i.zaglushka])
    const editItems: EditDataItem[] = [
        { caption: "ДСП:", value: name || "", message: messages.ENTER_CAPTION, type: InputType.TEXT, readonly: true },
        { caption: "Кромка:", value: edge, message: messages.ENTER_CODE, type: InputType.LIST, list: edgeList, listWithoutEmptyRow: true },
        { caption: "Заглушка:", value: zaglushka, message: messages.ENTER_CODE, type: InputType.LIST, list: zagList, listWithoutEmptyRow: true },
    ]
    return <EditContainer>
        <TableData heads={heads} content={contents} onSelectRow={(index) => { setSelectedIndex(index) }} />
        {(perm?.Read) ? <EditDataSection name={name} items={editItems}
            onUpdate={perm?.Update ? async (checked, values) => {
                const usedEdge = checked[1] ? values[1] : ""
                const usedZag = checked[2] ? values[2] : ""
                const result = await updateDspEdge({ name: dspEdgeList[selectedIndex].name, edge: usedEdge, zaglushka: usedZag })
                return result
            } : undefined}
        /> : <div></div>}

    </EditContainer>
}


