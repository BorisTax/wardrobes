import { useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { Edge, FasadMaterial } from "../../../types/materials"
import { addEdgeAtom, deleteEdgeAtom, edgeListAtom, edgeTypeListAtom, updateEdgeAtom } from "../../../atoms/materials/edges"
import messages from "../../../server/messages"
import { materialListAtom } from "../../../atoms/materials/materials"
import { FASAD_TYPE } from "../../../types/enums"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import TableData from "../../TableData"
import { InputType } from "../../../types/property"
import EditContainer from "../../EditContainer"
import { userAtom } from "../../../atoms/users"
import { RESOURCE } from "../../../types/user"
import { useEdgeTypeMap } from "../../../custom-hooks/useMaterialMap"

export default function EditEdge() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MATERIALS)
    const edgeNotSortedList = useAtomValue(edgeListAtom)
    const edgeTypeNotSortedList = useAtomValue(edgeTypeListAtom)
    const edgeList = useMemo(() => edgeNotSortedList.toSorted((e1, e2) => e1?.name > e2?.name ? 1 : -1), [edgeNotSortedList])
    const edgeTypeIdList = useMemo(() => edgeTypeNotSortedList.toSorted((e1, e2) => e1.caption > e2.caption ? 1 : -1).map(e => e.id), [edgeTypeNotSortedList])
    const edgeTypeNames = useEdgeTypeMap(edgeTypeNotSortedList)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const { id, name: edgeName, code, typeId } = edgeList[selectedIndex] || { id: -1, name: "", dsp: "", code: "", typeId: -1 } 
    const deleteEdge = useSetAtom(deleteEdgeAtom)
    const addEdge = useSetAtom(addEdgeAtom)
    const updateEdge = useSetAtom(updateEdgeAtom)
    const heads = ['Наименование', 'Код', 'Тип']
    const contents = edgeList.map((i: Edge) => [i.name, i.code, edgeTypeNotSortedList.find(et => et.id === i.typeId)?.caption])
    const editItems: EditDataItem[] = [
        { caption: "Наименование:", value: edgeName || "", message: messages.ENTER_CAPTION, type: InputType.TEXT },
        { caption: "Код:", value: code, message: messages.ENTER_CODE, type: InputType.TEXT },
        { caption: "Тип:", value: typeId, valueCaption: (value) => edgeTypeNames.get(value), message: messages.ENTER_CODE, type: InputType.LIST, list: edgeTypeIdList },
    ]
    return <EditContainer>
        <TableData heads={heads} content={contents} onSelectRow={(index) => { setSelectedIndex(index) }} />
        {(perm?.Read) ? <EditDataSection items={editItems}
            onUpdate={perm?.Update ? async (checked, values) => {
                const usedName = checked[0] ? values[0] : ""
                const usedCode = checked[1] ? values[1] : ""
                const usedType = checked[2] ? edgeTypeNotSortedList.find(e => e.caption === values[2])?.id : -1
                const result = await updateEdge({ id, name: usedName as string, code: usedCode as string, typeId: usedType || -1 })
                return result
            } : undefined}
            onDelete={perm?.Delete ? async () => {
                const result = await deleteEdge(id)
                setSelectedIndex(0)
                return result
            } : undefined}
            onAdd={perm?.Create ? async (checked, values) => {
                const name = values[0] as string
                const code = values[1] as string
                const usedType = checked[2] ? edgeTypeNotSortedList.find(e => e.caption === values[2])?.id : -1
                if (edgeList.find((p: Edge) => p.name === name)) { return { success: false, message: messages.MATERIAL_EXIST } }
                const result = await addEdge({ name, code, typeId: usedType || -1 })
                return result
            } : undefined} /> : <div></div>}

    </EditContainer>
}


