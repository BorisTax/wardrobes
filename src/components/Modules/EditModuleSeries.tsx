import { useEffect, useState } from "react"
import { useAtomValue } from "jotai"
import { userAtom } from "../../atoms/users"
import { RESOURCE } from "../../types/user"
import EditContainer from "../EditContainer"
import TableData, { TableDataRow } from "../inputs/TableData"
import {  loadModuleGroups } from "../../atoms/modules/groups"
import EditDataSection, { EditDataItem } from "../dialogs/EditDataSection"
import { InputType } from "../../types/property"
import { addModuleSerie, deleteModuleSerie, loadModuleSeries, updateModuleSerie } from "../../atoms/modules/series"
import ComboBox from "../inputs/ComboBox"


export default function EditModuleSeries() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MODULES)
    const [groups, setGroups] = useState(new Map())
    const [selectedGroupId, setSelectedGroupId] = useState(0)
    const [series, setSeries] = useState(new Map())
    const seriesList = [...series.keys()]
    const [selectedId, setSelectedId] = useState(0)
    const heads = [{ caption: 'id', sorted: true }, { caption: 'Имя', sorted: true }]
    const contents: TableDataRow[] = []
    seriesList.forEach((key) => contents.push({ key, data: [key, series.get(key)?.name] }))
    const editItems: EditDataItem[] = [
        { title: "Серия:", value: series.get(selectedId)?.name || "", inputType: InputType.TEXT, checkValue: (value) => ({ success: value !== "", message: "Введите имя серии" }) },
    ]
    const loadData = (groupId: number) => loadModuleSeries(groupId).then(data => { setSeries(() => data); setSelectedId(() => [...data.keys()][0] || 0) })
    useEffect(() => {
        loadModuleGroups().then(data => { setGroups(() => data); setSelectedGroupId(() => [...data.keys()][0] || 0) })
    }, [])
    useEffect(() => {
        if (selectedGroupId === 0) return
        loadData(selectedGroupId)
    }, [selectedGroupId])
    return <EditContainer>
        <div>
            <ComboBox title="Группа" value={selectedGroupId} displayValue={(value) => groups.get(value)} items={[...groups.keys()]} onChange={(value) => setSelectedGroupId(value)} />
            <hr/>
            <TableData header={heads} content={contents} onSelectRow={value => { setSelectedId(value as number) }} />
        </div>
        {(perm?.Read) ? <EditDataSection name={series.get(selectedId)?.name} items={editItems}
            onUpdate={perm?.Update ? {
                question: (values) => `Обновить:\nid=${selectedId}\n${values[0]}`,
                disabled: !seriesList.includes(selectedId),
                onAction: async (values) => {
                    const name = values[0] as string 
                    const result = await updateModuleSerie({ id: selectedId, name, groupId: selectedGroupId })
                    if (result.success) loadData(selectedGroupId)
                    return result
                }
            } : undefined}
            onDelete={perm?.Delete ? {
                question: (values) => `Удалить:\nid=${selectedId}\n${values[0]}`,
                disabled: !seriesList.includes(selectedId),
                onAction: async () => {
                    const result = await deleteModuleSerie(selectedId)
                    if (result.success) loadData(selectedGroupId)
                    return result
                }
            } : undefined}
            onAdd={perm?.Create ? {
                question: (values) => `Добавить:\n${values[0]}`,
                onAction: async (values) => {
                    const name = values[0] as string 
                    const result = await addModuleSerie({ name, groupId: selectedGroupId })
                    if (result.success) loadData(selectedGroupId)
                    return result
                }
            } : undefined} /> : <div></div>}
    </EditContainer>
}
