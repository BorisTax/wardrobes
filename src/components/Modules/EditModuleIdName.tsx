import { useEffect, useState } from "react"
import { useAtomValue } from "jotai"
import { userAtom } from "../../atoms/users"
import { RESOURCE } from "../../types/user"
import EditContainer from "../EditContainer"
import TableData, { TableDataRow } from "../inputs/TableData"
import EditDataSection, { EditDataItem } from "../dialogs/EditDataSection"
import { InputType } from "../../types/property"
import { MODULE_COMMENTS_ROUTE, MODULE_GROOVES_ROUTE, MODULE_GROUPS_ROUTE } from "../../types/routes"
import { addModuleIdNameData, deleteModuleModuleIdNameData, loadModuleIdNameData, updateModuleIdNameData } from "../../atoms/modules/idNameData"
import { DefaultMap } from "../../atoms/storage"

const _IdNameRoutes = [MODULE_GROUPS_ROUTE, MODULE_GROOVES_ROUTE, MODULE_COMMENTS_ROUTE] as const
export type IdNameRoutes =  typeof _IdNameRoutes[keyof typeof _IdNameRoutes] 
export default function EditModuleIdName({ route }: { route: IdNameRoutes }) {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MODULES)
    const [data, setData] = useState<DefaultMap>(new Map())
    const dataList = [...data.keys()].filter(id => id !== 0)
    const [selectedId, setSelectedId] = useState(0)
    const heads = [{ caption: 'id' }, { caption: 'Наименование' }]
    const contents: TableDataRow[] = dataList.map(d => ({ key: d, data: [d, data.get(d)] }))
    const editItems: EditDataItem[] = [
        { title: "Наименование:", value: data.get(selectedId) || "", inputType: InputType.TEXT, checkValue: (value) => ({ success: (value as string).trim() !== "", message: "Введите наименование" }) },
    ]
    const loadData = () => loadModuleIdNameData(route).then(data => { setData(data); setSelectedId([...data.keys()][0] || 0) })
    useEffect(() => {
        loadData()
    }, [route])
    return <EditContainer>
        <div>
            <TableData rowNumbers={false} header={heads} content={contents} onSelectRow={value => { setSelectedId(value as number) }} />
        </div>
        {(perm?.Read) ? <EditDataSection items={editItems}
            onUpdate={perm?.Update ? {
                disabled: !data.has(selectedId),
                question: (values) => `Обновить:\nid=${selectedId}\nНаименование: ${values[0]}`,
                onAction: async (values) => {
                    const name = values[0] as string 
                    const result = await updateModuleIdNameData(route, { id: selectedId, name })
                    if(result.success) loadData()
                    return result
                }
            } : undefined}
            onDelete={perm?.Delete ? {
                disabled: !data.has(selectedId),
                question: (values) => `Удалить:\nid=${selectedId}\nНаименование: ${values[0]}`,
                onAction: async () => {
                    const result = await deleteModuleModuleIdNameData(route, selectedId)
                    if(result.success) loadData()
                    return result
                }
            } : undefined}
            onAdd={perm?.Create ? {
                question: (values) => `Добавить:\nНаименование: ${values[0]}`,
                onAction: async (values) => {
                    const name = values[0] as string
                    const result = await addModuleIdNameData(route, name)
                    if(result.success) loadData()
                    return result
                }
            } : undefined} /> : <div></div>}
    </EditContainer>
}


