import { useEffect, useState } from "react"
import { useAtomValue } from "jotai"
import { userAtom } from "../../atoms/users"
import { RESOURCE } from "../../types/user"
import EditContainer from "../EditContainer"
import TableData, { TableDataRow } from "../inputs/TableData"
import EditDataSection, { EditDataItem } from "../dialogs/EditDataSection"
import { InputType } from "../../types/property"
import { ExtMap } from "../../atoms/storage"
import { ModuleColorsTableSchema } from "../../types/schemas/moduleSchemas"
import { addModuleMatColor, deleteModuleMatColor, loadModuleMatColors, updateModuleMatColor } from "../../atoms/modules/materials"

export default function EditModuleMatColors() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MODULES)
    const [data, setData] = useState<ExtMap<ModuleColorsTableSchema>>(new Map())
    const dataList = [...data.keys()].filter(id => id !== 0)
    const [selectedId, setSelectedId] = useState(0)
    const heads = [{ caption: 'id' }, { caption: 'Наименование' }, { caption: 'Код 1С' },{ caption: 'Текстура' },]
    const contents: TableDataRow[] = dataList.map(id => ({ key: id, data: [id, data.get(id)?.name, data.get(id)?.code, data.get(id)?.texture ? "ДА" : "НЕТ"] }))
    const editItems: EditDataItem[] = [
        { title: "Наименование:", value: data.get(selectedId)?.name || "", inputType: InputType.TEXT, checkValue: (value) => ({ success: (value as string).trim() !== "", message: "Введите наименование" }) },
        { title: "Код 1С:", value: data.get(selectedId)?.code || "", inputType: InputType.TEXT, checkValue: (value) => ({ success: (value as string).trim() !== "", message: "Введите Код 1С" }) },
        { title: "Текстура:", value: !!data.get(selectedId)?.texture, inputType: InputType.CHECKBOX },
    ]
    const loadData = () => loadModuleMatColors().then(data => { setData(data); setSelectedId(dataList[0] || 0) })
    useEffect(() => {
        loadData()
    }, [])
    return <EditContainer>
        <div>
            <TableData rowNumbers={false} header={heads} content={contents} onSelectRow={value => { setSelectedId(value as number) }}  styles={{maxHeight: "70svh"}}/>
        </div>
        {(perm?.Read) ? <EditDataSection items={editItems}
            onUpdate={perm?.Update ? {
                disabled: !dataList.includes(selectedId),
                question: (values) => `Обновить:\nid=${selectedId}\nНаименование: ${values[0]}\nКод 1С: ${values[1]}\nТекстура: ${values[2] ? "ДА" : "НЕТ"}`,
                onAction: async (values) => {
                    const name = values[0] as string 
                    const code = values[1] as string 
                    const texture = values[2] ? 1 : 0 
                    const result = await updateModuleMatColor({ id: selectedId, name, code, texture })
                    if(result.success) loadData()
                    return result
                }
            } : undefined}
            onDelete={perm?.Delete ? {
                disabled: !dataList.includes(selectedId),
                question: (values) => `Удалить:\nid=${selectedId}\nНаименование: ${values[0]}`,
                onAction: async () => {
                    const result = await deleteModuleMatColor(selectedId)
                    if(result.success) loadData()
                    return result
                }
            } : undefined}
            onAdd={perm?.Create ? {
                question: (values) => `Добавить:\nНаименование: ${values[0]}\nКод 1С: ${values[1]}\nТекстура: ${values[2] ? "ДА" : "НЕТ"}`,
                onAction: async (values) => {
                    const name = values[0] as string 
                    const code = values[1] as string 
                    const texture = values[2] ? 1 : 0 
                    const result = await addModuleMatColor({name, code, texture})
                    if(result.success) loadData()
                    return result
                }
            } : undefined} /> : <div></div>}
    </EditContainer>
}


