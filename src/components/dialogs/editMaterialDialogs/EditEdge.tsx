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
    const { name: edgeName, code } = edgeList[selectedIndex] || { name: "", dsp: "", code: "" } 
    const deleteEdge = useSetAtom(deleteEdgeAtom)
    const addEdge = useSetAtom(addEdgeAtom)
    const updateEdge = useSetAtom(updateEdgeAtom)
    const heads = ['Наименование', 'Код']
    const contents = edgeList.map((i: Edge) => [i.name, i.code])
    const editItems: EditDataItem[] = [
        { caption: "Наименование:", value: edgeName || "", message: messages.ENTER_CAPTION, type: InputType.TEXT },
        { caption: "Код:", value: code, message: messages.ENTER_CODE, type: InputType.TEXT },
    ]
    return <EditContainer>
        <TableData heads={heads} content={contents} onSelectRow={(index) => { setSelectedIndex(index) }} />
        {(perm?.Read) ? <EditDataSection name={edgeName} items={editItems}
            onUpdate={perm?.Update ? async (checked, values) => {
                const usedName = checked[0] ? values[0] : ""
                const usedCode = checked[1] ? values[1] : ""
                const usedDSP = checked[2] ? values[2] : ""
                const result = await updateEdge({ name: edgeList[selectedIndex].name, newName: usedName, code: usedCode, dsp: usedDSP })
                return result
            } : undefined}
            onDelete={perm?.Delete ? async (name) => {
                const index = edgeList.findIndex((p: Edge) => p.name === name)
                const result = await deleteEdge(edgeList[index])
                setSelectedIndex(0)
                return result
            } : undefined}
            onAdd={perm?.Create ? async (checked, values) => {
                const name = values[0] as string
                const code = values[1] as string
                if (edgeList.find((p: Edge) => p.name === name)) { return { success: false, message: messages.MATERIAL_EXIST } }
                const result = await addEdge({ name, code })
                return result
            } : undefined} /> : <div></div>}

    </EditContainer>
}


