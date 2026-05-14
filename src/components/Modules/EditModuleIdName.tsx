import { useEffect, useMemo, useState } from "react"
import { useAtomValue } from "jotai"
import { userAtom } from "../../atoms/users"
import { RESOURCE } from "../../types/user"
import EditContainer from "../EditContainer"
import TableData, { TableDataRow } from "../inputs/TableData"
import EditDataSection, { EditDataItem } from "../dialogs/EditDataSection"
import { InputType } from "../../types/property"
import { MODULE_COMMENTS_ROUTE, MODULE_GROOVES_ROUTE, MODULE_GROUPS_ROUTE } from "../../types/routes"
import useModuleIdNameData from "../../custom-hooks/modules/useModuleGroups"
import { addModuleIdNameData, deleteModuleModuleIdNameData, updateModuleIdNameData } from "../../atoms/modules/idNameData"

const _IdNameRoutes = [MODULE_GROUPS_ROUTE, MODULE_GROOVES_ROUTE, MODULE_COMMENTS_ROUTE] as const
export type IdNameRoutes =  typeof _IdNameRoutes[keyof typeof _IdNameRoutes] 
export default function EditModuleIdName({ route }: { route: IdNameRoutes }) {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MODULES)
    const [data, loadData] = useModuleIdNameData(route)
    const initialId = useMemo(() => [...data.keys()][0] || 0, [data])
    const [selectedId, setSelectedId] = useState(initialId)
    const heads = [{ caption: 'id' }, { caption: 'Наименование' }]
    const contents: TableDataRow[] = []
    data.forEach((value, key) => contents.push({key, data: [key, value]}))
    const editItems: EditDataItem[] = [
        { title: "Наименование:", value: data.get(selectedId) || "", inputType: InputType.TEXT, checkValue: (value) => ({ success: value !== "", message: "Введите наименование" }) },
    ]
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
                    setSelectedId([...data.keys()][0] || 0)
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


