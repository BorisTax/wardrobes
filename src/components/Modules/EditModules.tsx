import { useEffect, useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { userAtom } from "../../atoms/users"
import { RESOURCE } from "../../types/user"
import EditContainer from "../EditContainer"
import TableData, { TableDataRow } from "../inputs/TableData"
import {  moduleGroupsAtom } from "../../atoms/modules/groups"
import EditDataSection, { EditDataItem } from "../dialogs/EditDataSection"
import { InputType, PropertyType } from "../../types/property"
import { loadModuleSeriesAtom, moduleSeriesAtom } from "../../atoms/modules/series"
import ComboBox from "../inputs/ComboBox"
import { addModuleAtom, deleteModuleAtom, loadModulesAtom, modulesAtom, updateModuleAtom } from "../../atoms/modules/modules"
import PropertyGrid from "../inputs/PropertyGrid"

export default function EditModules() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MODULES)
    const loadData = useSetAtom(loadModulesAtom)
    const loadSeries = useSetAtom(loadModuleSeriesAtom)
    const updateData = useSetAtom(updateModuleAtom)
    const addData = useSetAtom(addModuleAtom)
    const deleteData = useSetAtom(deleteModuleAtom)
    const modules = useAtomValue(modulesAtom)
    const groups = useAtomValue(moduleGroupsAtom)
    const [selectedGroupId, setSelectedGroupId] = useState([...groups.keys()][0])
    const allSeries = useAtomValue(moduleSeriesAtom)
    const seriesList = [...allSeries.keys()].filter(k => allSeries.get(k)?.groupId === selectedGroupId)
    const initialSerieId = useMemo(() => seriesList[0] || 0, [seriesList])
    const [selectedSerieId, setSelectedSerieId] = useState(initialSerieId)
    const modulesList = [...modules.keys()]
    const initialId = useMemo(() => modulesList[0] || 0, [modulesList])
    const [selectedId, setSelectedId] = useState(initialId)
    const { name, shortName, sortIndex  } = modules.get(selectedId) || {name: "", shortName: "", sortIndex: 100}
    const heads = [{ caption: 'id', sorted: true }, { caption: 'Наименование', sorted: true }, { caption: 'Кратко' }, { caption: 'Порядок' }]
    const contents: TableDataRow[] = []
    modulesList.forEach((key) => contents.push({ key, data: [key, modules.get(key)?.name, modules.get(key)?.shortName, modules.get(key)?.sortIndex] }))
    const editItems: EditDataItem[] = [
        { title: "Наименование:", value: name, inputType: InputType.TEXT, checkValue: (value) => ({ success: value !== "", message: "Введите наименование" }) },
        { title: "Краткое:", value: shortName, inputType: InputType.TEXT},
        { title: "Порядок:", value: sortIndex, inputType: InputType.TEXT , propertyType: PropertyType.NUMBER},
    ]
    useEffect(() => {
        loadData(selectedSerieId)
    }, [selectedSerieId])
    useEffect(() => {
        loadSeries()
    }, [selectedGroupId])
    useEffect(() => {
        setSelectedSerieId(initialSerieId)
    }, [initialSerieId])
    return <EditContainer>
        <div>
            <PropertyGrid>
            <ComboBox title="Группа" value={selectedGroupId} displayValue={(value) => groups.get(value)} items={[...groups.keys()]} onChange={(value) => setSelectedGroupId(value)} />
            <ComboBox title="Серия" value={selectedSerieId} displayValue={(value) => allSeries.get(value)?.name} items={seriesList} onChange={(value) => setSelectedSerieId(value)} />
            </PropertyGrid>
            <TableData header={heads} content={contents} onSelectRow={value => { setSelectedId(value as number) }} />
        </div>
        {(perm?.Read) ? <EditDataSection items={editItems}
            onUpdate={perm?.Update ? {
                disabled: !modulesList.includes(selectedId),
                question: (values) => `Обновить модуль:\nid=${selectedId}\nНаименование: ${values[0]}\nКратко: ${values[1]}\nПорядок: ${values[2]}`,
                onAction: async (values) => {
                    const name = values[0] as string 
                    const shortName =values[1] as string
                    const sortIndex =values[2] as number
                    const result = await updateData({ id: selectedId, name, shortName,sortIndex, serieId: selectedSerieId })
                    if (result.success) loadData(selectedSerieId)
                    return result
                }
            } : undefined}
            onDelete={perm?.Delete ? {
                disabled: !modulesList.includes(selectedId),
                question: () => `Удалить модуль:\nid=${selectedId}\n${name}`, 
                onAction: async () => {
                    const result = await deleteData(selectedId)
                    if (result.success) loadData(selectedSerieId)
                    setSelectedId(0)
                    return result
                }
             }: undefined}
            onAdd={perm?.Create ? async (values) => {
                const name = values[0] as string 
                const shortName =values[1] as string
                const sortIndex =values[2] as number
                const result = await addData({ name, shortName,sortIndex, serieId: selectedSerieId  })
                if (result.success) loadData(selectedSerieId)
                return result
            } : undefined} /> : <div></div>}
    </EditContainer>
}
