import { useEffect, useState } from "react"
import { useAtomValue } from "jotai"
import { userAtom } from "../../atoms/users"
import { RESOURCE } from "../../types/user"
import EditContainer from "../EditContainer"
import TableData, { TableDataRow } from "../inputs/TableData"
import {  loadModuleGroups } from "../../atoms/modules/groups"
import EditDataSection, { EditDataItem } from "../dialogs/EditDataSection"
import { InputType, PropertyType } from "../../types/property"
import { loadModuleSeries } from "../../atoms/modules/series"
import ComboBox from "../inputs/ComboBox"
import { loadModules } from "../../atoms/modules/modules"
import PropertyGrid from "../inputs/PropertyGrid"
import { addModuleCorrespond, deleteModuleCorrespond, loadModulesCorrespond, updateModuleCorrespond } from "../../atoms/modules/modulesCorrespond"
import { ExtMap } from "../../atoms/storage"
import { ModuleModulesTableSchema } from "../../types/schemas/moduleSchemas"

export default function EditModulesCorrespond() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MODULES)
    const [modules, setModules] = useState<ExtMap<ModuleModulesTableSchema>>(new Map())
    const [groups, setGroups] = useState(new Map())
    const [series, setSeries] = useState(new Map())
    const [modulesCorr, setModulesCorr] = useState(new Map())
    const [selectedGroupId, setSelectedGroupId] = useState(0)
    const seriesList = [...series.keys()]
    const [selectedSerieId, setSelectedSerieId] = useState(0)
    const modulesCorrList = [...modulesCorr.keys()].filter(k => modulesCorr.get(k)?.serieId === selectedSerieId)
    const [selectedModuleCorrId, setSelectedModuleCorrId] = useState(0)
    const { moduleId, name1C, code1C, orderName } = modulesCorr.get(selectedModuleCorrId) || { moduleId: 0, name1C: "", code1C: 0, orderName: "" }
    const heads = [{ caption: 'id', sorted: true }, { caption: 'Модуль', sorted: true }, { caption: 'Наименование 1С' }, { caption: 'Код 1С' }, { caption: 'Заказ' }]
    const contents: TableDataRow[] = []
    modulesCorrList.forEach((key) => contents.push({ key, data: [key, modules.get(modulesCorr.get(key)?.moduleId || 0)?.name, modulesCorr.get(key)?.name1C, modulesCorr.get(key)?.code1C, modulesCorr.get(key)?.orderName] }))
    const editItems: EditDataItem[] = [
        { title: "Модуль", value: moduleId, displayValue: (value) => value === 0 ? "" : modules.get(value as number)?.name || "", inputType: InputType.LIST, list: [0, ...modules.keys()], checkValue: (value) => ({ success: !!modules.get(value as number), message: "Выберите модуль" }) },
        { title: "Наименование 1С:", value: name1C, inputType: InputType.TEXT, checkValue: (value) => ({ success: (value as string).trim() !== "", message: "Введите наименование 1С" }) },
        { title: "Код 1С:", value: code1C, inputType: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER, optional: true},
        { title: "Заказ:", value: orderName, inputType: InputType.TEXT, optional: true},
    ]
    const loadData = (serieId: number) => { loadModulesCorrespond(serieId).then(data => { setModulesCorr(() => data); setSelectedModuleCorrId(() => [...data.keys()][0] || 0) }) }
    useEffect(() => {
        loadModuleGroups().then(data => { setGroups(() => data); setSelectedGroupId(() => [...data.keys()][0] || 0) })
    }, [])
    useEffect(() => {
        if (selectedGroupId === 0) return
        loadModuleSeries(selectedGroupId).then(data => { setSeries(() => data); setSelectedSerieId(() => [...data.keys()][0] || 0) })
    }, [selectedGroupId])
    useEffect(() => {
        if (selectedSerieId === 0) return
        loadModules(selectedSerieId).then(data => setModules(data))
        loadData(selectedSerieId)
    }, [selectedSerieId])
    return <EditContainer>
        <div>
            <PropertyGrid>
            <ComboBox title="Группа" value={selectedGroupId} displayValue={(value) => groups.get(value)} items={[...groups.keys()]} onChange={(value) => setSelectedGroupId(value)} />
            <ComboBox title="Серия" value={selectedSerieId} displayValue={(value) => series.get(value)?.name} items={seriesList} onChange={(value) => setSelectedSerieId(value)} />
            </PropertyGrid>
            <TableData header={heads} content={contents} onSelectRow={value => { setSelectedModuleCorrId(value as number) }}  styles={{maxHeight: "70svh"}}/>
        </div>
        {(perm?.Read) ? <EditDataSection items={editItems}
            onUpdate={perm?.Update ? {
                disabled: !modulesCorrList.includes(selectedModuleCorrId),
                question: (values) => `Обновить соответствие:\nid=${selectedModuleCorrId}\nМодуль: ${values[0]}\nНаименование 1С: ${values[1]}\nКод 1С: ${values[2]}\nЗаказ: ${values[3]}`,
                onAction: async (values) => {
                    const moduleId = values[0] as number
                    const name1C = values[1] as string
                    const code1C = values[2] as number
                    const orderName = values[3] as string
                    const result = await updateModuleCorrespond({ id: selectedModuleCorrId, moduleId, serieId: selectedSerieId, name1C, code1C, orderName })
                    if (result.success) loadData(selectedSerieId)
                    return result
                }
            } : undefined}
            onDelete={perm?.Delete ? {
                disabled: !modulesCorrList.includes(selectedModuleCorrId),
                question: () => `Удалить соответствие:\nid=${selectedModuleCorrId}\nМодуль: ${modules.get(moduleId)?.name}\nНаименование 1С: ${name1C}\nКод 1С: ${code1C}`, 
                onAction: async () => {
                    const result = await deleteModuleCorrespond(selectedModuleCorrId)
                    if (result.success) loadData(selectedSerieId)
                    return result
                }
             }: undefined}
            onAdd={perm?.Create ? {
                question: (values) => `Добавить соответствие:\nМодуль: ${values[0]}\nНаименование 1С: ${values[1]}\nКод 1С: ${values[2]}\nЗаказ: ${values[3]}`,
                onAction: async (values) => {
                    const moduleId = values[0] as number
                    const name1C = values[1] as string
                    const code1C = values[2] as number
                    const orderName = values[3] as string
                    const result = await addModuleCorrespond({ moduleId, serieId: selectedSerieId, code1C, name1C, orderName })
                    if (result.success) loadData(selectedSerieId)
                    return result
                }
            } : undefined} /> : <div></div>}
    </EditContainer>
}
