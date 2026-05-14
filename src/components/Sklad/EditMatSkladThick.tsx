import { useEffect, useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { userAtom } from "../../atoms/users"
import { RESOURCE } from "../../types/user"
import EditContainer from "../EditContainer"
import TableData, { TableDataRow } from "../inputs/TableData"
import EditDataSection, { EditDataItem } from "../dialogs/EditDataSection"
import { InputType } from "../../types/property"
import { addMatSkladThickness, deleteMatSkladThickness, loadMatSkladThickAtom, matSkladThickAtom, updateMatSkladThickness } from "../../atoms/skladMat"


export default function EditMatSkladThick() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.SKLAD_MAT)
    const loadData = useSetAtom(loadMatSkladThickAtom)
    const thick = useAtomValue(matSkladThickAtom)
    const thickList = [...thick.keys()].filter(k => k !== 0)
    const initialId = useMemo(() => thickList[0] || 0, [thickList])
    const [selectedId, setSelectedId] = useState(initialId)
    const heads = [{ caption: 'id'}, { caption: 'Толщина' }]
    const contents: TableDataRow[] = []
    thickList.forEach((key) => contents.push({ key, data: [key, thick.get(key)] }))
    const editItems: EditDataItem[] = [
        { title: "Толщина:", value: thick.get(selectedId) || "", inputType: InputType.TEXT, checkValue: (value) => ({ success: (value as string).trim() !== "", message: "Введите толщину" }), styles: {maxWidth: "100px"}},
    ]
    useEffect(() => {
        loadData()
    }, [])
    return <EditContainer>
        <div>
            <TableData rowNumbers={false} header={heads} content={contents} onSelectRow={value => { setSelectedId(value as number) }} />
        </div>
        {(perm?.Read) ? <EditDataSection  items={editItems}
            onUpdate={perm?.Update ? {
                question: (values)=>`Обновить:\nid=${selectedId}\nТолщина ${values[0]}`,
                disabled: !thick.has(selectedId) || selectedId === 0,
                onAction: async (values) => {
                    const name = values[0] as string 
                    const result = await updateMatSkladThickness({id: selectedId, name})
                    if (result.success) loadData()
                    return result
                }
            } : undefined}
            onDelete={perm?.Delete ? {
                question: () => `Удалить толщину:\nid=${selectedId}\n${thick.get(selectedId)}`,
                disabled: !thick.has(selectedId) || selectedId === 0,
                onAction: async () => {
                    const result = await deleteMatSkladThickness(selectedId)
                    setSelectedId([...thick.keys()][0] || 0)
                    if (result.success) loadData()
                    return result
                }
            } : undefined}
            onAdd={perm?.Create ? {
                question: (values)=>`Добавить:\nТолщина: ${values[0]}`,
                onAction: async (values) => {
                    const name = values[0] as string 
                    const result = await addMatSkladThickness({ name })
                    if (result.success) loadData()
                    return result
                }
            } : undefined} /> : <div></div>}
    </EditContainer>
}
