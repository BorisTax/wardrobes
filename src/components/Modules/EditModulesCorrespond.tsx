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
import { loadModulesAtom, modulesAtom } from "../../atoms/modules/modules"
import PropertyGrid from "../inputs/PropertyGrid"
import { addModuleCorrespondAtom, deleteModuleCorrespondAtom, loadModulesCorrespondAtom, modulesCorrespondAtom, updateModuleCorrespondAtom } from "../../atoms/modules/modulesCorrespond"
import { Value } from "sass"

export default function EditModulesCorrespond() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MODULES)
    const loadData = useSetAtom(loadModulesCorrespondAtom)
    const loadSeries = useSetAtom(loadModuleSeriesAtom)
    const loadModules = useSetAtom(loadModulesAtom)
    const updateData = useSetAtom(updateModuleCorrespondAtom)
    const addData = useSetAtom(addModuleCorrespondAtom)
    const deleteData = useSetAtom(deleteModuleCorrespondAtom)
    const modules = useAtomValue(modulesAtom)
    const modulesCorr = useAtomValue(modulesCorrespondAtom)
    const groups = useAtomValue(moduleGroupsAtom)
    const [selectedGroupId, setSelectedGroupId] = useState([...groups.keys()][0])
    const allSeries = useAtomValue(moduleSeriesAtom)
    const seriesList = [...allSeries.keys()].filter(k => allSeries.get(k)?.groupId === selectedGroupId)
    const initialSerieId = useMemo(() => seriesList[0] || 0, [seriesList])
    const [selectedSerieId, setSelectedSerieId] = useState(initialSerieId)
    const modulesCorrList = [...modulesCorr.keys()].filter(k => modulesCorr.get(k)?.serieId === selectedSerieId)
    const initialModuleCorrId = useMemo(() => modulesCorrList[0] || 0, [modulesCorrList])
    const [selectedModuleCorrId, setSelectedModuleCorrId] = useState(initialModuleCorrId)
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
    useEffect(() => {
        loadModules(selectedSerieId)
        loadData(selectedSerieId)
    }, [selectedSerieId])
    useEffect(() => {
        loadSeries()
    }, [])
    useEffect(() => {
        setSelectedSerieId(initialSerieId)
        setSelectedModuleCorrId(initialModuleCorrId)
    }, [initialSerieId, initialModuleCorrId])
    return <EditContainer>
        <div>
            <PropertyGrid>
            <ComboBox title="Группа" value={selectedGroupId} displayValue={(value) => groups.get(value)} items={[...groups.keys()]} onChange={(value) => setSelectedGroupId(value)} />
            <ComboBox title="Серия" value={selectedSerieId} displayValue={(value) => allSeries.get(value)?.name} items={seriesList} onChange={(value) => setSelectedSerieId(value)} />
            </PropertyGrid>
            <TableData header={heads} content={contents} onSelectRow={value => { setSelectedModuleCorrId(value as number) }} />
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
                    const result = await updateData({ id: selectedModuleCorrId, moduleId, serieId: selectedSerieId, name1C, code1C, orderName })
                    if (result.success) loadData(selectedSerieId)
                    return result
                }
            } : undefined}
            onDelete={perm?.Delete ? {
                disabled: !modulesCorrList.includes(selectedModuleCorrId),
                question: () => `Удалить соответствие:\nid=${selectedModuleCorrId}`, 
                onAction: async () => {
                    const result = await deleteData(selectedModuleCorrId)
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
                    const result = await addData({ moduleId, serieId: selectedSerieId, code1C, name1C, orderName })
                    if (result.success) loadData(selectedSerieId)
                    return result
                }
            } : undefined} /> : <div></div>}
    </EditContainer>
}
