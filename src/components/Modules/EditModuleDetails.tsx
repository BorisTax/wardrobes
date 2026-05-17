import { useEffect, useState } from "react"
import { useAtom, useAtomValue } from "jotai"
import { userAtom } from "../../atoms/users"
import { RESOURCE } from "../../types/user"
import EditContainer from "../EditContainer"
import TableData, { TableDataRow } from "../inputs/TableData"
import {  loadModuleGroups } from "../../atoms/modules/groups"
import EditDataSection, { EditDataItem } from "../dialogs/EditDataSection"
import { InputType, PropertyType } from "../../types/property"
import { loadModuleSeries} from "../../atoms/modules/series"
import ComboBox from "../inputs/ComboBox"
import {  loadModules } from "../../atoms/modules/modules"
import PropertyGrid from "../inputs/PropertyGrid"
import { ModuleDetailsTableSchema, ModuleEdgesTableSchema } from "../../types/schemas/moduleSchemas"
import { addModuleDetail, deleteModuleDetail, loadModuleDetails, modulesDetailsLastStateDBAtom, updateModuleDetail } from "../../atoms/modules/details"
import { loadModulesComments, loadModulesEdges, loadModulesGrooves } from "../../atoms/modules/edgesGroovesComments"
import { DefaultMap, ExtMap } from "../../atoms/storage"
const emptyDetail: ModuleDetailsTableSchema = { id: 0, name: "", matIndex: 0, length: 0, width: 0, commentId: 0, grooveId: 0, el1: 0, el2: 0, ew1: 0, ew2: 0, count: 0, texture: 0, moduleId: 0 }
const captions = ["Наименование", "Индекс мат.", "Длина", "Ширина", "Кол-во", "Текстура", "Кромка по 1-й длине", "Кромка по 2-й длине", "Кромка по 1-й ширине", "Кромка по 2-й ширине", "Паз", "Примечание"]
export default function EditModuleDetails() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MODULES)
    const [lastState, setLastState] = useAtom(modulesDetailsLastStateDBAtom)
    const [edges, setEdges] = useState<ExtMap<ModuleEdgesTableSchema>>(new Map())
    const [grooves, setGrooves] = useState<DefaultMap>(new Map())
    const [comments, setComments] = useState<DefaultMap>(new Map())
    const [modules, setModules] = useState(new Map())
    const [groups, setGroups] = useState(new Map())
    const [series, setSeries] = useState(new Map())
    const [details, setDetails] = useState<ModuleDetailsTableSchema[]>([])
    const detailIdList = details.map(d => d.id)
    const [selectedGroupId, setSelectedGroupId] = useState(0)
    const seriesList = [...series.keys()]
    const [selectedSerieId, setSelectedSerieId] = useState(0)
    const modulesList = [...modules.keys()]
    const [selectedModuleId, setSelectedModuleId] = useState(0)
    const [selectedId, setSelectedId] = useState(0)
    const { name, matIndex, length, width, count, grooveId, commentId, el1, el2, ew1, ew2, texture } = details.find(d => d.id === selectedId) || emptyDetail
    const heads = [{ caption: 'id', sorted: true }, { caption: 'Наименование', sorted: true }, { caption: 'Инд. мат.' }, { caption: 'Длина' }, { caption: 'Ширина' }, { caption: 'Кол-во' }, { caption: 'Текстура' }, { caption: 'Кромка Д1' }, { caption: 'Кромка Д2' }, { caption: 'Кромка Ш1' }, { caption: 'Кромка Ш2' }, { caption: 'Паз' }, { caption: 'Примечание' }]
    const contents: TableDataRow[] = details.map(d => ({ key: d.id, data: [d.id, d.name, d.matIndex, d.length, d.width, d.count, d.texture ? "ДА" : "НЕТ", edges.get(d.el1)?.name, edges.get(d.el2)?.name, edges.get(d.ew1)?.name, edges.get(d.ew2)?.name, grooves.get(d.grooveId), comments.get(d.commentId)] }))
    const editItems: EditDataItem[] = [
        { title: "Наименование:", value: name, inputType: InputType.TEXT, checkValue: (value) => ({ success: (value as string).trim() !== "", message: "Введите наименование" }) },
        { title: "Индекс мат.:", value: matIndex, inputType: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER, checkValue: value => ({ success: (value as number) > 0, message: "Укажите индекс материала" }) },
        { title: "Длина:", value: length, inputType: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER, checkValue: value => ({ success: (value as number) > 0, message: "Укажите длину" }) },
        { title: "Ширина:", value: width, inputType: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER, checkValue: value => ({ success: (value as number) > 0, message: "Укажите ширину" }) },
        { title: "Кол-во:", value: count, inputType: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER, checkValue: value => ({ success: (value as number) > 0, message: "Укажите кол-во" }) },
        { title: "Текстура:", value: !!texture, inputType: InputType.CHECKBOX },
        { title: "Кромка по 1-й длине:", value: el1, displayValue: value => edges.get(value as number)?.name || "", inputType: InputType.LIST, list: [...edges.keys()] },
        { title: "Кромка по 2-й длине:", value: el2, displayValue: value => edges.get(value as number)?.name || "", inputType: InputType.LIST, list: [...edges.keys()] },
        { title: "Кромка по 1-й ширине:", value: ew1, displayValue: value => edges.get(value as number)?.name || "", inputType: InputType.LIST, list: [...edges.keys()] },
        { title: "Кромка по 2-й ширине:", value: ew2, displayValue: value => edges.get(value as number)?.name || "", inputType: InputType.LIST, list: [...edges.keys()] },
        { title: "Паз:", value: grooveId, displayValue: value => grooves.get(value as number) || "", inputType: InputType.LIST, list: [...grooves.keys()] },
        { title: "Примечание:", value: commentId, displayValue: value => comments.get(value as number) || "", inputType: InputType.LIST, list: [...comments.keys()] },
    ]
    const loadData = (moduleId: number) => { loadModuleDetails(moduleId).then(data => { 
        setDetails(data); 
        const detailId = data.find(d => d.id === lastState.detailId)?.id || data[0]?.id || 0
        setSelectedId(detailId) 
    }) }
    useEffect(() => {
        loadModulesEdges().then(data => setEdges(() => data))
        loadModulesGrooves().then(data => setGrooves(() => data))
        loadModulesComments().then(data => setComments(() => data))
    }, [])
    useEffect(() => {
        loadModuleGroups().then(data => {
            setGroups(() => data); 
            const groupId = data.has(lastState.groupId)?lastState.groupId : [...data.keys()][0] || 0
            setSelectedGroupId(() => groupId) 
        })
    }, [])
    useEffect(() => {
        if (selectedGroupId === 0) return
        loadModuleSeries(selectedGroupId).then(data => { 
            setSeries(() => data); 
            const serieId = data.has(lastState.serieId)?lastState.serieId : [...data.keys()][0] || 0
            setSelectedSerieId(() => serieId) 
        })
    }, [selectedGroupId])
    useEffect(() => {
        if (selectedSerieId === 0) return
         loadModules(selectedSerieId).then(data => { 
            setModules(() => data); 
            const moduleId = data.has(lastState.moduleId)?lastState.moduleId : [...data.keys()][0] || 0
            setSelectedModuleId(moduleId)
         })
    }, [selectedSerieId])
    useEffect(() => {
        if (selectedModuleId === 0) return
        loadData(selectedModuleId)
        return () => {
            setLastState({ groupId: selectedGroupId, serieId: selectedSerieId, moduleId: selectedModuleId, detailId: selectedId })
        }
    }, [selectedModuleId])
    return <EditContainer>
        <div>
            <PropertyGrid>
                <ComboBox title="Группа" value={selectedGroupId} displayValue={(value) => groups.get(value)} items={[...groups.keys()]} onChange={(value) => setSelectedGroupId(value)} />
                <ComboBox title="Серия" value={selectedSerieId} displayValue={(value) => series.get(value)?.name} items={seriesList} onChange={(value) => setSelectedSerieId(value)} />
                <ComboBox title="Модуль" value={selectedModuleId} displayValue={(value) => modules.get(value)?.name} items={modulesList} onChange={(value) => setSelectedModuleId(value)} />
            </PropertyGrid>
            <TableData header={heads} content={contents} onSelectRow={value => { setSelectedId(value as number) }} />
        </div>
        {(perm?.Read) ? <EditDataSection items={editItems}
            onUpdate={perm?.Update ? {
                disabled: !detailIdList.includes(selectedId),
                question: (values) => `Обновить деталь:\nid: ${selectedId}${[0,1,2,3,4].map((index) => `\n${captions[index]}: ${values[index]}`).join("")}\nТекстура: ${values[5]?"ДА":"НЕТ"}${[6,7,8,9,10,11].map((index) => `\n${captions[index]}: ${values[index]}`).join("")}`,
                onAction: async (values) => {
                    const name = values[0] as string 
                    const matIndex = values[1] as number
                    const length =values[2] as number
                    const width =values[3] as number
                    const count =values[4] as number
                    const texture =values[5]?1:0
                    const el1 =values[6] as number
                    const el2 =values[7] as number
                    const ew1 =values[8] as number
                    const ew2 =values[9] as number
                    const grooveId =values[10] as number
                    const commentId =values[11] as number
                    const result = await updateModuleDetail({ id: selectedId, moduleId: selectedModuleId, name, matIndex, length, width, count, texture, el1, el2, ew1, ew2, grooveId, commentId })
                    if (result.success) loadData(selectedModuleId)
                    return result
                }
            } : undefined}
            onDelete={perm?.Delete ? {
                disabled: !detailIdList.includes(selectedId),
                question: () => `Удалить деталь:\nid=${selectedId}\n${name}`, 
                onAction: async () => {
                    const result = await deleteModuleDetail(selectedId)
                    if (result.success) loadData(selectedModuleId)
                    return result
                }
             }: undefined}
            onAdd={perm?.Create ? {
                question: (values) => `Добавить деталь:${[0,1,2,3,4].map((index) => `\n${captions[index]}: ${values[index]}`).join("")}\nТекстура: ${values[5]?"ДА":"НЕТ"}${[6,7,8,9,10,11].map((index) => `\n${captions[index]}: ${values[index]}`).join("")}`,
                onAction: async (values) => {
                    const name = values[0] as string
                    const matIndex = values[1] as number
                    const length = values[2] as number
                    const width = values[3] as number
                    const count = values[4] as number
                    const texture = values[5] ? 1 : 0
                    const el1 = values[6] as number
                    const el2 = values[7] as number
                    const ew1 = values[8] as number
                    const ew2 = values[9] as number
                    const grooveId = values[10] as number
                    const commentId = values[11] as number
                    const result = await addModuleDetail({ moduleId: selectedModuleId, name, matIndex, length, width, count, texture, el1, el2, ew1, ew2, grooveId, commentId })
                    if (result.success) loadData(selectedModuleId)
                    return result
                }
            } : undefined} /> : <div></div>}
    </EditContainer>
}
