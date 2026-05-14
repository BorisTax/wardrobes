import { useEffect, useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { userAtom } from "../../atoms/users"
import { RESOURCE } from "../../types/user"
import EditContainer from "../EditContainer"
import TableData, { TableDataRow } from "../inputs/TableData"
import EditDataSection, { EditDataItem } from "../dialogs/EditDataSection"
import { InputType, PropertyType } from "../../types/property"
import { addModuleEdgeAtom, deleteModuleEdgeAtom, loadModulesEdgesAtom, modulesEdgeAtom, updateModuleEdgeAtom } from "../../atoms/modules/edgesGroovesComments"


export default function EditModuleEdges() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MODULES)
    const loadData = useSetAtom(loadModulesEdgesAtom)
    const updateData = useSetAtom(updateModuleEdgeAtom)
    const addData = useSetAtom(addModuleEdgeAtom)
    const deleteData = useSetAtom(deleteModuleEdgeAtom)

    const edges = useAtomValue(modulesEdgeAtom)
    const initialId = useMemo(() => [...edges.keys()][0] || 0, [edges])
    const [selectedId, setSelectedId] = useState(initialId)
    const heads = [{ caption: 'id' }, { caption: 'Наименование' }, { caption: 'Толщина' }]
    const contents: TableDataRow[] = []
    edges.forEach((value, key) => contents.push({key, data: [key, value.name, value.thickness]}))
    const editItems: EditDataItem[] = [
        { title: "Наименование:", value: edges.get(selectedId)?.name || "", inputType: InputType.TEXT, checkValue: (value) => ({ success: value !== "", message: "Введите наименование" }) },
        { title: "Толщина:", value: edges.get(selectedId)?.thickness || "", inputType: InputType.TEXT, propertyType: PropertyType.POSITIVE_NUMBER, checkValue: (value) => ({ success: value !== "", message: "Введите толщину" }) },
    ]
    useEffect(() => {
        loadData()
    }, [])
    return <EditContainer>
        <div>
            <TableData rowNumbers={false} header={heads} content={contents} onSelectRow={value => { setSelectedId(value as number) }} />
        </div>
        {(perm?.Read) ? <EditDataSection items={editItems}
            onUpdate={perm?.Update ? {
                disabled: !edges.has(selectedId),
                question: (values) => `Обновить кромку:\nid=${selectedId}\n${values[0]}\nТолщина: ${values[1]}мм`,
                onAction: async (values) => {
                    const name = values[0] as string 
                    const thickness = values[1] as number 
                    const result = await updateData({ id: selectedId, name, thickness })
                    if(result.success) loadData()
                    return result
                }
            } : undefined}
            onDelete={perm?.Delete ? {
                disabled: !edges.has(selectedId),
                question: (values) => `Удалить кромку:\nid=${selectedId}\nНаименование: ${values[0]}\nТолщина: ${values[1]}`,
                onAction: async () => {
                    const result = await deleteData(selectedId)
                    if(result.success) loadData()
                    setSelectedId([...edges.keys()][0] || 0)
                    return result
                }
            } : undefined}
            onAdd={perm?.Create ? {
                question: (values) => `Добавить кромку:\n${values[0]}\nТолщина: ${values[1]}мм`,
                onAction: async (values) => {
                    const name = values[0] as string
                    const thickness = values[1] as number
                    const result = await addData({ name, thickness })
                    if(result.success) loadData()
                    return result
                }
            } : undefined} /> : <div></div>}
    </EditContainer>
}
