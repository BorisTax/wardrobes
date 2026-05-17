import { useEffect, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { userAtom } from "../../atoms/users"
import { RESOURCE } from "../../types/user"
import EditContainer from "../EditContainer"
import TableData, { TableDataRow } from "../inputs/TableData"
import {  loadModuleGroups } from "../../atoms/modules/groups"
import EditDataSection, { EditDataItem } from "../dialogs/EditDataSection"
import { InputType, PropertyType } from "../../types/property"
import { loadModuleSeries} from "../../atoms/modules/series"
import ComboBox from "../inputs/ComboBox"
import { addModule, deleteModule, loadModules, modulesLastStateDBAtom, updateModule } from "../../atoms/modules/modules"
import PropertyGrid from "../inputs/PropertyGrid"

export default function EditModules() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MODULES)
    const setLastState = useSetAtom(modulesLastStateDBAtom)
    const lastState = useAtomValue(modulesLastStateDBAtom)
    const [modules, setModules] = useState(new Map())
    const [groups, setGroups] = useState(new Map())
    const [series, setSeries] = useState(new Map())
    const [selectedGroupId, setSelectedGroupId] = useState(0)
    const seriesList = [...series.keys()]
    const [selectedSerieId, setSelectedSerieId] = useState(0)
    const modulesList = [...modules.keys()]
    const [selectedId, setSelectedId] = useState(0)
    const { name, shortName, sortIndex  } = modules.get(selectedId) || {name: "", shortName: "", sortIndex: 100}
    const heads = [{ caption: 'id', sorted: true }, { caption: 'Наименование', sorted: true }, { caption: 'Кратко' }, { caption: 'Порядок' }]
    const contents: TableDataRow[] = []
    modulesList.forEach((key) => contents.push({ key, data: [key, modules.get(key)?.name, modules.get(key)?.shortName, modules.get(key)?.sortIndex] }))
    const editItems: EditDataItem[] = [
        { title: "Наименование:", value: name, inputType: InputType.TEXT, checkValue: (value) => ({ success: value !== "", message: "Введите наименование" }) },
        { title: "Краткое:", value: shortName, inputType: InputType.TEXT},
        { title: "Порядок:", value: sortIndex, inputType: InputType.TEXT , propertyType: PropertyType.NUMBER},
    ]
    const loadData = (serieId: number) => { loadModules(serieId).then(data => { 
        setModules(() => data); 
        const moduleId = data.has(lastState.moduleId) ? lastState.moduleId : [...data.keys()][0] || 0
        setSelectedId(moduleId) 
    }) }
    useEffect(() => {
        loadModuleGroups().then(data => {
            setGroups(() => data);
            const groupId = data.has(lastState.groupId) ? lastState.groupId : [...data.keys()][0] || 0
            setSelectedGroupId(groupId)
        })
    }, [])
    useEffect(() => {
        if (selectedGroupId === 0) return
        loadModuleSeries(selectedGroupId).then(data => { 
                setSeries(() => data); 
                const serieId = data.has(lastState.serieId) ? lastState.serieId : [...data.keys()][0] || 0
                setSelectedSerieId(serieId) 
            })
    }, [selectedGroupId])
    useEffect(() => {
        if (selectedSerieId === 0) return
        loadData(selectedSerieId)
        return () => {
            setLastState({ groupId: selectedGroupId, serieId: selectedSerieId, moduleId: selectedId })
        }
    }, [selectedSerieId])
    return <EditContainer>
        <div>
            <PropertyGrid>
            <ComboBox title="Группа" value={selectedGroupId} displayValue={(value) => groups.get(value)} items={[...groups.keys()]} onChange={(value) => setSelectedGroupId(value)} />
            <ComboBox title="Серия" value={selectedSerieId} displayValue={(value) => series.get(value)?.name} items={seriesList} onChange={(value) => setSelectedSerieId(value)} />
            </PropertyGrid>
            <TableData header={heads} content={contents} onSelectRow={value => { setSelectedId(value as number) }}  styles={{maxHeight: "70svh"}}/>
        </div>
        {(perm?.Read) ? <EditDataSection items={editItems}
            onUpdate={perm?.Update ? {
                disabled: !modulesList.includes(selectedId),
                question: (values) => `Обновить модуль:\nid=${selectedId}\nНаименование: ${values[0]}\nКратко: ${values[1]}\nПорядок: ${values[2]}`,
                onAction: async (values) => {
                    const name = values[0] as string 
                    const shortName =values[1] as string
                    const sortIndex =values[2] as number
                    const result = await updateModule({ id: selectedId, name, shortName,sortIndex, serieId: selectedSerieId })
                    if (result.success) loadData(selectedSerieId)
                    return result
                }
            } : undefined}
            onDelete={perm?.Delete ? {
                disabled: !modulesList.includes(selectedId),
                question: () => `Удалить модуль:\nid=${selectedId}\n${name}`, 
                onAction: async () => {
                    const result = await deleteModule(selectedId)
                    if (result.success) loadData(selectedSerieId)
                    return result
                }
             }: undefined}
            onAdd={perm?.Create ? async (values) => {
                const name = values[0] as string 
                const shortName =values[1] as string
                const sortIndex =values[2] as number
                const result = await addModule({ name, shortName,sortIndex, serieId: selectedSerieId  })
                if (result.success) loadData(selectedSerieId)
                return result
            } : undefined} /> : <div></div>}
    </EditContainer>
}
