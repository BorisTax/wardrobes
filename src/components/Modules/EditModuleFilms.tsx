import { useEffect, useState } from "react"
import { useAtomValue } from "jotai"
import { userAtom } from "../../atoms/users"
import { RESOURCE } from "../../types/user"
import EditContainer from "../EditContainer"
import TableData, { TableDataRow } from "../inputs/TableData"
import EditDataSection, { EditDataItem } from "../dialogs/EditDataSection"
import { InputType } from "../../types/property"
import { ExtMap } from "../../atoms/storage"
import { ModuleFilmTableSchema, ModuleMatBaseTableSchema, ModuleMaterialsTableSchema } from "../../types/schemas/moduleSchemas"
import { addModuleFilm, deleteModuleFilm, loadModuleFilm, loadModuleMatBases, loadModuleMaterials, updateModuleFilm } from "../../atoms/modules/materials"
import ComboBox from "../inputs/ComboBox"
import { useModuleMaterials } from "../../custom-hooks/moduleMaterials"

export default function EditModuleFilms() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MODULES)
    const [matBases, setMatBases] = useState<ExtMap<ModuleMatBaseTableSchema>>(new Map())
    const [materials, setMaterials] = useState<ExtMap<ModuleMaterialsTableSchema>>(new Map())
    const [films, setFilms] = useState<ExtMap<ModuleFilmTableSchema>>(new Map())
    const filmsList = [...films.keys()]
    const { getFullMaterialName } = useModuleMaterials(materials)
    const [selectedMatBaseId, setSelectedMatBaseId] = useState(0)
    const matList = [...materials.keys()].filter(id => (materials.get(id)?.baseId === selectedMatBaseId || selectedMatBaseId === 0) && id !== 0)
    const [selectedId, setSelectedId] = useState(0)
    const heads = [{ caption: 'id' }, { caption: 'Материал' }, { caption: 'Глянец' }]
    const contents: TableDataRow[] = filmsList.map(id => ({ key: id, data: [id, getFullMaterialName(films.get(id)?.materialId || 0), films.get(id)?.glossy ? "ДА" : "НЕТ"] }))
    const editItems: EditDataItem[] = [
        { title: "Материал:", value: films.get(selectedId)?.materialId || 0, displayValue: value => getFullMaterialName(value as number), inputType: InputType.LIST, list: matList, checkValue: (value) => ({ success: (value as number) !== 0, message: "Выберите материал" }) },
        { title: "Глянец:", value: !!films.get(selectedId)?.glossy, inputType: InputType.CHECKBOX },
    ]
    const loadData = () => loadModuleFilm().then(data => { setFilms(data); setSelectedId([...data.keys()][0] || 0) })
    useEffect(() => {
        loadModuleMatBases().then(data => setMatBases(data))
        loadModuleMaterials().then(data => setMaterials(data))
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
                disabled: !films.has(selectedId),
                question: (values) => `Обновить:\nid=${selectedId}\nМатериал: ${values[0]}\nГлянец: ${values[1]?"ДА":"НЕТ"}`,
                onAction: async (values) => {
                    const materialId = values[0] as number
                    const glossy = values[1] ? 1 : 0
                    const result = await updateModuleFilm({ id: selectedId, materialId, glossy })
                    if(result.success) loadData()
                    return result
                }
            } : undefined}
            onDelete={perm?.Delete ? {
                disabled: !films.has(selectedId),
                question: (values) => `Удалить:\nid=${selectedId}\nМатериал: ${values[0]}\nГлянец: ${values[1]?"ДА":"НЕТ"}`,
                onAction: async () => {
                    const result = await deleteModuleFilm(selectedId)
                    if(result.success) loadData()
                    return result
                }
            } : undefined}
            onAdd={perm?.Create ? {
                question: (values) => `Добавить:\nМатериал: ${values[0]}\nГлянец: ${values[1]?"ДА":"НЕТ"}`,
                onAction: async (values) => {
                    const materialId = values[0] as number 
                    const glossy = values[1] ? 1 : 0
                    const result = await addModuleFilm({materialId, glossy})
                    if(result.success) loadData()
                    return result
                }
            } : undefined} /> : <div></div>}
    </EditContainer>
}


