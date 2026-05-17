import { useEffect, useState } from "react"
import { useAtomValue } from "jotai"
import { userAtom } from "../../atoms/users"
import { RESOURCE } from "../../types/user"
import EditContainer from "../EditContainer"
import TableData, { TableDataRow } from "../inputs/TableData"
import EditDataSection, { EditDataItem } from "../dialogs/EditDataSection"
import { InputType, PropertyType } from "../../types/property"
import { ExtMap } from "../../atoms/storage"
import { ModuleMatBaseTableSchema } from "../../types/schemas/moduleSchemas"
import { addModuleMatBase, deleteModuleMatBase, loadModuleMatBases, updateModuleMatBase } from "../../atoms/modules/materials"

export default function EditModuleMatBases() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MODULES)
    const [data, setData] = useState<ExtMap<ModuleMatBaseTableSchema>>(new Map())
    const dataList = [...data.keys()].filter(id => id !== 0)
    const [selectedId, setSelectedId] = useState(0)
    const heads = [{ caption: 'id' }, { caption: 'Наименование' }, { caption: 'Код 1С' },{ caption: 'Толщина' },]
    const contents: TableDataRow[] = dataList.map(id => ({ key: id, data: [id, data.get(id)?.name, data.get(id)?.code, data.get(id)?.thickness] }))
    const editItems: EditDataItem[] = [
        { title: "Наименование:", value: data.get(selectedId)?.name || "", inputType: InputType.TEXT, checkValue: (value) => ({ success: (value as string).trim() !== "", message: "Введите наименование" }) },
        { title: "Код 1С:", value: data.get(selectedId)?.code || "", inputType: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER, checkValue: (value) => ({ success: (value as number) > 0, message: "Введите Код 1С" }) },
        { title: "Толщина:", value: data.get(selectedId)?.thickness || "", inputType: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER, checkValue: (value) => ({ success: (value as number) > 0, message: "Введите толщину" }) },
    ]
    const loadData = () => loadModuleMatBases().then(data => { setData(data); setSelectedId(dataList[0] || 0) })
    useEffect(() => {
        loadData()
    }, [])
    return <EditContainer>
        <div>
            <TableData rowNumbers={false} header={heads} content={contents} onSelectRow={value => { setSelectedId(value as number) }} />
        </div>
        {(perm?.Read) ? <EditDataSection items={editItems}
            onUpdate={perm?.Update ? {
                disabled: !dataList.includes(selectedId),
                question: (values) => `Обновить:\nid=${selectedId}\nНаименование: ${values[0]}\nКод 1С: ${values[1]}\nТолщина: ${values[2]}`,
                onAction: async (values) => {
                    const name = values[0] as string 
                    const code = values[1] as number 
                    const thickness = values[2] as number 
                    const result = await updateModuleMatBase({ id: selectedId, name, code, thickness })
                    if(result.success) loadData()
                    return result
                }
            } : undefined}
            onDelete={perm?.Delete ? {
                disabled: !dataList.includes(selectedId),
                question: (values) => `Удалить:\nid=${selectedId}\nНаименование: ${values[0]}`,
                onAction: async () => {
                    const result = await deleteModuleMatBase(selectedId)
                    if(result.success) loadData()
                    return result
                }
            } : undefined}
            onAdd={perm?.Create ? {
                question: (values) => `Добавить:\nНаименование: ${values[0]}\nКод 1С: ${values[1]}\nТолщина: ${values[2]}`,
                onAction: async (values) => {
                    const name = values[0] as string 
                    const code = values[1] as number 
                    const thickness = values[2] as number 
                    const result = await addModuleMatBase({name, code, thickness})
                    if(result.success) loadData()
                    return result
                }
            } : undefined} /> : <div></div>}
    </EditContainer>
}


