import { useEffect, useState } from "react"
import { useAtomValue } from "jotai"
import { userAtom } from "../../atoms/users"
import { RESOURCE } from "../../types/user"
import EditContainer from "../EditContainer"
import TableData, { TableDataRow } from "../inputs/TableData"
import EditDataSection, { EditDataItem } from "../dialogs/EditDataSection"
import { InputType } from "../../types/property"
import { ExtMap } from "../../atoms/storage"
import { ModuleMatBaseTableSchema, ModuleMaterialCorrespondTableSchema, ModuleMaterialsTableSchema } from "../../types/schemas/moduleSchemas"
import { loadModuleMatBases, loadModuleMaterials } from "../../atoms/modules/materials"
import ComboBox from "../inputs/ComboBox"
import { useModuleMaterials } from "../../custom-hooks/moduleMaterials"
import { MatIndexes } from "../../atoms/modules/serieMaterials"
import { addModuleMaterialCorrespond, deleteModuleMaterialCorrespond, loadModuleMaterialCorrespond, updateModuleMaterialCorrespond } from "../../atoms/modules/materialCorrespond"

export default function EditModuleMaterialCorrespond() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MODULES)
    const [matBases, setMatBases] = useState<ExtMap<ModuleMatBaseTableSchema>>(new Map())
    const [selectedMatBaseId, setSelectedMatBaseId] = useState(0)
    const [materials, setMaterials] = useState<ExtMap<ModuleMaterialsTableSchema>>(new Map())
    const { getFullMaterialName } = useModuleMaterials(materials)
    const [materialCorr, setMaterialsCorr] = useState<ExtMap<ModuleMaterialCorrespondTableSchema>>(new Map())
    const matList = [...materials.keys()].filter(id => (materials.get(id)?.baseId === selectedMatBaseId || selectedMatBaseId === 0) && id !== 0)
    const matCorrList = [...materialCorr.keys()]
    const [selectedId, setSelectedId] = useState(0)
    const { matIndex, material1C, materialId } = materialCorr.get(selectedId) || { matIndex: 0, material1C: "", materialId: 0 }
    const heads = [{ caption: 'id' }, { caption: 'Материал 1С' }, { caption: 'Материал' }, { caption: 'Индекс' }]
    const contents: TableDataRow[] = matCorrList.map(id => ({ key: id, data: [id, materialCorr.get(id)?.material1C, getFullMaterialName(materialCorr.get(id)?.materialId || 0), materialCorr.get(id)?.matIndex] }))
    const editItems: EditDataItem[] = [
        { title: "Материал 1С:", value: material1C, inputType: InputType.TEXT, checkValue: (value) => ({ success: (value as string).trim() !== "", message: "Введите материал 1С" }) },
        { title: "Материал:", value: materialId, displayValue: value => getFullMaterialName(value as number), inputType: InputType.LIST, list: matList, checkValue: (value) => ({ success: (value as number) !== 0, message: "Выберите материал" }) },
        { title: "Индекс мат.", value: matIndex, displayValue: value => (value || "").toString(), inputType: InputType.LIST, list: MatIndexes, checkValue: (value) => ({ success: (value as number) > 0, message: "Введите индекс материала" }) },
        ]
    const loadData = () => loadModuleMaterialCorrespond().then(data => { setMaterialsCorr(data); setSelectedId([...data.keys()][0] || 0) })
    useEffect(() => {
        loadModuleMatBases().then(data => setMatBases(data))
        loadModuleMaterials().then(data => setMaterials(data))
    }, [])    
    useEffect(() => {
        loadData()
    }, [])
    return <EditContainer>
        <div>
            <ComboBox title={"Основа"} value={selectedMatBaseId} displayValue={value => matBases.get(value as number)?.name || ""} items={[...matBases.keys()]} onChange={value => setSelectedMatBaseId(value)} />
                <hr/>
            <TableData rowNumbers={false} header={heads} content={contents} onSelectRow={value => { setSelectedId(value as number) }} styles={{maxHeight: "70svh"}}/>
        </div>
        {(perm?.Read) ? <EditDataSection items={editItems}
            onUpdate={perm?.Update ? {
                disabled: !materialCorr.has(selectedId),
                question: (values) => `Обновить:\nid=${selectedId}\nМатериал 1С: ${values[0]}\nМатериал: ${values[1]}\nИндекс: ${values[2]}`,
                onAction: async (values) => {
                    const material1C = values[0] as string 
                    const materialId = values[1] as number 
                    const matIndex = values[2] as number
                    const result = await updateModuleMaterialCorrespond({ id: selectedId, material1C, materialId, matIndex })
                    if(result.success) loadData()
                    return result
                }
            } : undefined}
            onDelete={perm?.Delete ? {
                disabled: !materialCorr.has(selectedId),
                question: (values) => `Удалить:\nid=${selectedId}\nМатериал 1С: ${material1C}\nМатериал: ${getFullMaterialName(materialId)}\nИндекс: ${matIndex}`,
                onAction: async () => {
                    const result = await deleteModuleMaterialCorrespond(selectedId)
                    if(result.success) loadData()
                    return result
                }
            } : undefined}
            onAdd={perm?.Create ? {
                question: (values) => `Добавить:\nМатериал 1С: ${values[0]}\nМатериал: ${values[1]}\nИндекс: ${values[2]}`,
                onAction: async (values) => {
                    const material1C = values[0] as string 
                    const materialId = values[1] as number 
                    const matIndex = values[2] as number
                    const result = await addModuleMaterialCorrespond({material1C, materialId, matIndex})
                    if(result.success) loadData()
                    return result
                }
            } : undefined} /> : <div></div>}
    </EditContainer>
}


