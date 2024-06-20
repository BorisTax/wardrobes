import { useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { Edge, ExtMaterial } from "../../../types/materials"
import { addEdgeAtom, deleteEdgeAtom, edgeListAtom, updateEdgeAtom } from "../../../atoms/materials/edges"
import messages from "../../../server/messages"
import { materialListAtom } from "../../../atoms/materials/materials"
import { FasadMaterial } from "../../../types/enums"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import TableData from "../../TableData"
import { InputType } from "../../../types/property"
import EditContainer from "../../EditContainer"
import { userAtom } from "../../../atoms/users"
import { RESOURCE } from "../../../types/user"

export default function EditEdge() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MATERIALS)
    const edgeNotSortedList = useAtomValue(edgeListAtom)
    const edgeList = useMemo(() => edgeNotSortedList.toSorted((e1, e2) => e1?.name > e2?.name ? 1 : -1), [edgeNotSortedList])
    const materialList = useAtomValue(materialListAtom)
    const mList = useMemo(() => materialList.filter(mat => mat.material === FasadMaterial.DSP).map((m: ExtMaterial) => m.name), [materialList])
    const [selectedIndex, setSelectedIndex] = useState(0)
    const { name: edgeName, dsp, code } = edgeList[selectedIndex] || { name: "", dsp: "", code: "" } 
    const deleteEdge = useSetAtom(deleteEdgeAtom)
    const addEdge = useSetAtom(addEdgeAtom)
    const updateEdge = useSetAtom(updateEdgeAtom)
    const heads = ['Наименование', 'Код', 'Соответствие ДСП']
    const contents = edgeList.map((i: Edge) => [i.name, i.code, i.dsp])
    const editItems: EditDataItem[] = [
        { caption: "Наименование:", value: edgeName || "", message: "Введите наименование", type: InputType.TEXT },
        { caption: "Код:", value: code, message: "Введите код", type: InputType.TEXT },
        { caption: "Соответствие ДСП:", value: dsp, list: mList, message: "Выберите ДСП", type: InputType.LIST },
    ]
    return <EditContainer>
        <TableData heads={heads} content={contents} onSelectRow={(index) => { setSelectedIndex(index) }} />
        <EditDataSection name={edgeName} items={editItems}
            onUpdate={perm?.update ? async (checked, values) => {
                const usedName = checked[0] ? values[0] : ""
                const usedCode = checked[1] ? values[1] : ""
                const usedDSP = checked[2] ? values[2] : ""
                const result = await updateEdge({ name: edgeList[selectedIndex].name, newName: usedName, code: usedCode, dsp: usedDSP })
                return result
            } : undefined}
            onDelete={perm?.remove ? async (name) => {
                const index = edgeList.findIndex((p: Edge) => p.name === name)
                const result = await deleteEdge(edgeList[index])
                setSelectedIndex(0)
                return result
            } : undefined}
            onAdd={perm?.create ? async (checked, values) => {
                const name = values[0]
                const code = values[1]
                const dsp = values[2]
                if (edgeList.find((p: Edge) => p.name === name)) { return { success: false, message: messages.EDGE_EXIST } }
                const result = await addEdge({ name, dsp, code })
                return result
            } : undefined} />

    </EditContainer>
}


