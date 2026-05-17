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
import { ModuleMatBaseTableSchema, ModuleMaterialsTableSchema, ModuleModulesTableSchema, ModuleSerieMaterialsTableSchema } from "../../types/schemas/moduleSchemas"
import { ExtMap } from "../../atoms/storage"
import { addModuleSerieMaterial, deleteModuleSerieMaterial, loadModuleSerieMaterials, MatIndexes, updateModuleSerieMaterial } from "../../atoms/modules/serieMaterials"
import { useModuleMaterials } from "../../custom-hooks/moduleMaterials"
import { loadModuleMatBases, loadModuleMaterials } from "../../atoms/modules/materials"

export default function EditModulesSerieMaterials() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MODULES)
    const [modules, setModules] = useState<ExtMap<ModuleModulesTableSchema>>(new Map())
    const [groups, setGroups] = useState(new Map())
    const [series, setSeries] = useState(new Map())
    const [matBases, setMatBases] = useState<ExtMap<ModuleMatBaseTableSchema>>(new Map()) 
    const [selectedMatBaseId, setSelectedMatBaseId] = useState(0)
    const [materials, setMaterials] = useState<ExtMap<ModuleMaterialsTableSchema>>(new Map())
    const materialList = [...materials.keys()].filter(id => materials.get(id)?.baseId === selectedMatBaseId || selectedMatBaseId === 0)
    const { getFullMaterialName } = useModuleMaterials(materials)
    const [serieMaterials, setSerieMaterials] = useState<ExtMap<ModuleSerieMaterialsTableSchema>>(new Map())
    const [selectedGroupId, setSelectedGroupId] = useState(0)
    const seriesList = [...series.keys()].filter(id => id !== 0)
    const [selectedSerieId, setSelectedSerieId] = useState(0)
    const [selectedSerieMaterialId, setSelectedSerieMaterialId] = useState(0)
    const { moduleId, matIndex, materialId } = serieMaterials.get(selectedSerieMaterialId) || { moduleId: 0, matIndex: 0, materialId: 0 }
    const heads = [{ caption: 'id', sorted: true }, { caption: 'Серия' }, { caption: 'Модуль' }, { caption: 'Индекс мат.' }, { caption: 'Материал' }]
    const contents: TableDataRow[] = []
    serieMaterials.forEach((schema, id) => contents.push({ key: id, data: [id, series.get(schema.serieId)?.name, modules.get(schema.moduleId)?.name, schema.matIndex, getFullMaterialName(schema.materialId)] }))
    const editItems: EditDataItem[] = [
        { title: "Модуль", value: moduleId, displayValue: (value) => modules.get(value as number)?.name || "", inputType: InputType.LIST, list: [0,...modules.keys()], checkValue: () => ({ success: true, message: "" }) },
        { title: "Индекс мат.", value: matIndex, displayValue: value => (value || "").toString(), inputType: InputType.LIST, list: MatIndexes, checkValue: (value) => ({ success: (value as number) > 0, message: "Введите индекс материала" }) },
        { title: "Материал:", value: materialId, displayValue: value => getFullMaterialName(value as number), inputType: InputType.LIST, list: materialList, checkValue: (value) => ({ success: (value as number) > 0, message: "Выберите материал" }) },
    ]
    const loadData = (serieId: number) => { loadModuleSerieMaterials(serieId).then(data => { setSerieMaterials(() => data); setSelectedSerieMaterialId(() => [...data.keys()][0] || 0) }) }
    useEffect(() => {
        loadModuleGroups().then(data => { setGroups(() => data); setSelectedGroupId(() => [...data.keys()][0] || 0) })
        loadModuleMatBases().then(data => { setMatBases(data); setSelectedMatBaseId(0) })
        loadModuleMaterials().then(data => setMaterials(data))
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
            <ComboBox title="Основа" value={selectedMatBaseId} displayValue={(value) => matBases.get(value)?.name} items={[...matBases.keys()]} onChange={(value) => setSelectedMatBaseId(value)} />
            </PropertyGrid>
            <TableData header={heads} content={contents} onSelectRow={value => { setSelectedSerieMaterialId(value as number) }} />
        </div>
        {(perm?.Read) ? <EditDataSection items={editItems}
            onUpdate={perm?.Update ? {
                disabled: !serieMaterials.has(selectedSerieMaterialId),
                question: (values) => `Обновить соответствие:\nid=${selectedSerieMaterialId}\nМодуль: ${values[0]}\nИндекс мат.: ${values[1]}\nМатериал: ${values[2]}`,
                onAction: async (values) => {
                    const moduleId = values[0] as number
                    const matIndex = values[1] as number
                    const materialId = values[2] as number
                    const result = await updateModuleSerieMaterial({ id: selectedSerieMaterialId, moduleId, serieId: selectedSerieId, matIndex, materialId })
                    if (result.success) loadData(selectedSerieId)
                    return result
                }
            } : undefined}
            onDelete={perm?.Delete ? {
                disabled: !serieMaterials.has(selectedSerieMaterialId),
                question: () => `Удалить соответствие:\nid=${selectedSerieMaterialId}`, 
                onAction: async () => {
                    const result = await deleteModuleSerieMaterial(selectedSerieMaterialId)
                    if (result.success) loadData(selectedSerieId)
                    return result
                }
             }: undefined}
            onAdd={perm?.Create ? {
                question: (values) => `Добавить соответствие:\nМодуль: ${values[0]}\nИндекс мат.: ${values[1]}\nМатериал: ${values[2]}`,
                onAction: async (values) => {
                    const moduleId = values[0] as number
                    const matIndex = values[1] as number
                    const materialId = values[2] as number
                    const result = await addModuleSerieMaterial({moduleId, serieId: selectedSerieId, matIndex, materialId })
                    if (result.success) loadData(selectedSerieId)
                    return result
                }
            } : undefined} /> : <div></div>}
    </EditContainer>
}
