import { useEffect, useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { userAtom } from "../../atoms/users"
import { RESOURCE } from "../../types/user"
import EditContainer from "../EditContainer"
import TableData, { TableDataRow } from "../inputs/TableData"
import {  moduleGroupsAtom } from "../../atoms/modules/groups"
import EditDataSection, { EditDataItem } from "../dialogs/EditDataSection"
import { InputType } from "../../types/property"
import { addModuleSerieAtom, deleteModuleSerieAtom, loadModuleSeriesAtom, moduleSeriesAtom, updateModuleSerieAtom } from "../../atoms/modules/series"
import ComboBox from "../inputs/ComboBox"


export default function EditModuleSeries() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MODULES)
    const loadData = useSetAtom(loadModuleSeriesAtom)
    const updateData = useSetAtom(updateModuleSerieAtom)
    const addData = useSetAtom(addModuleSerieAtom)
    const deleteData = useSetAtom(deleteModuleSerieAtom)
    const groups = useAtomValue(moduleGroupsAtom)
    const [selectedGroupId, setSelectedGroupId] = useState([...groups.keys()][0])
    const allSeries = useAtomValue(moduleSeriesAtom)
    const seriesList = [...allSeries.keys()].filter(k => allSeries.get(k)?.groupId === selectedGroupId)
    const initialId = useMemo(() => seriesList[0] || 0, [seriesList])
    const [selectedId, setSelectedId] = useState(initialId)
    const heads = [{ caption: 'id', sorted: true }, { caption: 'Имя', sorted: true }]
    const contents: TableDataRow[] = []
    seriesList.forEach((key) => contents.push({ key, data: [key, allSeries.get(key)?.name] }))
    const editItems: EditDataItem[] = [
        { title: "Серия:", value: allSeries.get(selectedId)?.name || "", inputType: InputType.TEXT, checkValue: (value) => ({ success: value !== "", message: "Введите имя серии" }) },
    ]
    useEffect(() => {
        loadData()
    }, [])
    return <EditContainer>
        <div>
            <ComboBox title="Группа" value={selectedGroupId} displayValue={(value) => groups.get(value)} items={[...groups.keys()]} onChange={(value) => setSelectedGroupId(value)} />
            <hr/>
            <TableData header={heads} content={contents} onSelectRow={value => { setSelectedId(value as number) }} />
        </div>
        {(perm?.Read) ? <EditDataSection name={allSeries.get(selectedId)?.name} items={editItems}
            onUpdate={perm?.Update ? {
                disabled: !seriesList.includes(selectedId),
                onAction: async (values) => {
                    const name = values[0] as string 
                    const result = await updateData({ id: selectedId, name, groupId: selectedGroupId })
                    if (result.success) loadData()
                    return result
                }
            } : undefined}
            onDelete={perm?.Delete ? {
                disabled: !seriesList.includes(selectedId),
                onAction: async () => {
                    const result = await deleteData(selectedId)
                    setSelectedId([...groups.keys()][0] || 0)
                    if (result.success) loadData()
                    return result
                }
            } : undefined}
            onAdd={perm?.Create ? async (values) => {
                const name = values[0] as string 
                const result = await addData({ name, groupId: selectedGroupId })
                if (result.success) loadData()
                return result
            } : undefined} /> : <div></div>}
    </EditContainer>
}
