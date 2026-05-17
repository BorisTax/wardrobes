import { useEffect, useState } from "react"
import { useAtomValue } from "jotai"
import { userAtom } from "../../atoms/users"
import { RESOURCE } from "../../types/user"
import EditContainer from "../EditContainer"
import TableData, { TableDataRow } from "../inputs/TableData"
import EditDataSection, { EditDataItem } from "../dialogs/EditDataSection"
import { InputType, PropertyType } from "../../types/property"
import { ExtMap } from "../../atoms/storage"
import { ModuleColorsTableSchema, ModuleMatBaseTableSchema, ModuleMaterialsTableSchema } from "../../types/schemas/moduleSchemas"
import { addModuleMaterial, deleteModuleMaterial, loadModuleMatBases, loadModuleMatColors, loadModuleMaterials, updateModuleMatColor, updateModuleMaterial } from "../../atoms/modules/materials"
import ComboBox from "../inputs/ComboBox"

export default function EditModuleMaterials() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MODULES)
    const [matBases, setMatBases] = useState<ExtMap<ModuleMatBaseTableSchema>>(new Map())
    const [matColors, setMatColors] = useState<ExtMap<ModuleColorsTableSchema>>(new Map())
    const [selectedMatBaseId, setSelectedMatBaseId] = useState(0)
    const [data, setData] = useState<ExtMap<ModuleMaterialsTableSchema>>(new Map())
    const dataList = [...data.keys()].filter(id => (data.get(id)?.baseId === selectedMatBaseId || selectedMatBaseId === 0) && id !== 0)
    const [selectedId, setSelectedId] = useState(0)
    const heads = [{ caption: 'id' }, { caption: 'Основа' }, { caption: 'Цвет' }, { caption: 'Длина' }, { caption: 'Ширина' }, { caption: 'Краткое наименование' }]
    const contents: TableDataRow[] = dataList.map(id => ({ key: id, data: [id, matBases.get(data.get(id)?.baseId || 0)?.name, matColors.get(data.get(id)?.colorId || 0)?.name, data.get(id)?.length, data.get(id)?.width, data.get(id)?.shortName] }))
    const editItems: EditDataItem[] = [
        { title: "Основа:", value: data.get(selectedId)?.baseId || 0, displayValue: value => matBases.get(value as number)?.name || "", inputType: InputType.LIST, list: [...matBases.keys()], checkValue: (value) => ({ success: (value as number) !== 0, message: "Выберите основу" }) },
        { title: "Цвет:", value: data.get(selectedId)?.colorId || 0, displayValue: value => matColors.get(value as number)?.name || "", inputType: InputType.LIST, list: [...matColors.keys()], checkValue: (value) => ({ success: (value as number) !== 0, message: "Выберите цвет" }) },
        { title: "Длина:", value: data.get(selectedId)?.length || "", inputType: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER, checkValue: (value) => ({ success: (value as number) > 0, message: "Введите длину" }) },
        { title: "Ширина:", value: data.get(selectedId)?.width || "", inputType: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER, checkValue: (value) => ({ success: (value as number) > 0, message: "Введите ширину" }) },
        { title: "Краткое наименование:", value: data.get(selectedId)?.shortName || "", inputType: InputType.TEXT, checkValue: (value) => ({ success: (value as string).trim() !== "", message: "Введите краткое наименование" }) },
    ]
    const loadData = () => loadModuleMaterials().then(data => { setData(data); setSelectedId(dataList[0] || 0) })
    useEffect(() => {
        loadModuleMatBases().then(data => setMatBases(data))
        loadModuleMatColors().then(data => setMatColors(data))
    }, [])    
    useEffect(() => {
        loadData()
    }, [])
    return <EditContainer>
        <div>
            <ComboBox title={"Основа"} value={selectedMatBaseId} displayValue={value => matBases.get(value as number)?.name || ""} items={[...matBases.keys()]} onChange={value => setSelectedMatBaseId(value)} />
                <hr/>
            <TableData rowNumbers={false} header={heads} content={contents} onSelectRow={value => { setSelectedId(value as number) }}  styles={{maxHeight: "70svh"}}/>
        </div>
        {(perm?.Read) ? <EditDataSection items={editItems}
            onUpdate={perm?.Update ? {
                disabled: !dataList.includes(selectedId),
                question: (values) => `Обновить:\nid=${selectedId}\nОснова: ${values[0]}\nЦвет: ${values[1]}\nДлина: ${values[2]}\nШиирна: ${values[3]}\nКратко: ${values[4]}`,
                onAction: async (values) => {
                    const baseId = values[0] as number 
                    const colorId = values[1] as number 
                    const length = values[2] as number
                    const width = values[3] as number
                    const shortName = values[4] as string
                    const result = await updateModuleMaterial({ id: selectedId, baseId, colorId, length, width, shortName })
                    if(result.success) loadData()
                    return result
                }
            } : undefined}
            onDelete={perm?.Delete ? {
                disabled: !dataList.includes(selectedId),
                question: (values) => `Удалить:\nid=${selectedId}\nОснова: ${values[0]}\nЦвет: ${values[1]}`,
                onAction: async () => {
                    const result = await deleteModuleMaterial(selectedId)
                    if(result.success) loadData()
                    return result
                }
            } : undefined}
            onAdd={perm?.Create ? {
                question: (values) => `Добавить:\nОснова: ${values[0]}\nЦвет: ${values[1]}\nДлина: ${values[2]}\nШиирна: ${values[3]}\nКратко: ${values[4]}`,
                onAction: async (values) => {
                    const baseId = values[0] as number 
                    const colorId = values[1] as number 
                    const length = values[2] as number
                    const width = values[3] as number
                    const shortName = values[4] as string
                    const result = await addModuleMaterial({baseId, colorId, length, width, shortName })
                    if(result.success) loadData()
                    return result
                }
            } : undefined} /> : <div></div>}
    </EditContainer>
}


