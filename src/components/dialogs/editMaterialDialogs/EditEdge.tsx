import { useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { Kromka, FasadMaterial } from "../../../types/materials"
import { addKromkaAtom, deleteKromkaAtom, kromkaListAtom, kromkaTypeListAtom, updateKromkaAtom } from "../../../atoms/materials/kromka"
import messages from "../../../server/messages"
import { materialListAtom } from "../../../atoms/materials/chars"
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
    const edgeNotSortedList = useAtomValue(kromkaListAtom)
    const edgeTypeNotSortedList = useAtomValue(kromkaTypeListAtom)
    const edgeList = useMemo(() => edgeNotSortedList.toSorted((e1, e2) => e1?.name > e2?.name ? 1 : -1), [edgeNotSortedList])
    const edgeTypeIdList = useMemo(() => edgeTypeNotSortedList.toSorted((e1, e2) => e1.caption > e2.caption ? 1 : -1).map(e => e.id), [edgeTypeNotSortedList])
    const edgeTypeNames = useEdgeTypeMap(edgeTypeNotSortedList)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const { id, name: edgeName, code, typeId } = edgeList[selectedIndex] || { id: -1, name: "", dsp: "", code: "", typeId: -1 } 
    const deleteEdge = useSetAtom(deleteKromkaAtom)
    const addEdge = useSetAtom(addKromkaAtom)
    const updateEdge = useSetAtom(updateKromkaAtom)
    const heads = ['Наименование', 'Код', 'Тип']
    const contents = edgeList.map((i: Kromka) => [i.name, i.code, edgeTypeNotSortedList.find(et => et.id === i.typeId)?.caption])
    const editItems: EditDataItem[] = [
        { caption: "Наименование:", value: edgeName || "", message: messages.ENTER_CAPTION, type: InputType.TEXT },
        { caption: "Код:", value: code, message: messages.ENTER_CODE, type: InputType.TEXT },
        { caption: "Тип:", value: typeId, valueCaption: (value) => edgeTypeNames.get(value), message: messages.ENTER_CODE, type: InputType.LIST, list: edgeTypeIdList },
    ]
    return <EditContainer>
        <TableData heads={heads} content={contents} onSelectRow={(index) => { setSelectedIndex(index) }} />
        {(perm?.Read) ? <EditDataSection name={edgeName} items={editItems}
            onUpdate={perm?.Update ? async (checked, values) => {
                const usedName = values[0] as string
                const usedCode = values[1] as string
                const usedType = values[2] as number
                const result = await updateEdge({ id, name: usedName, code: usedCode, typeId: usedType })
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
                const usedType = values[2] as number
                if (edgeList.find((p: Kromka) => p.name === name)) { return { success: false, message: messages.MATERIAL_EXIST } }
                const result = await addEdge({ name, code, typeId: usedType })
                return result
            } : undefined} /> : <div></div>}

    </EditContainer>
}


