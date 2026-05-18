import { useEffect, useState } from "react"
import ComboBox from "../inputs/ComboBox"
import { InputType, PropertyType } from "../../types/property"
import { useAtomValue, useSetAtom } from "jotai"
import TextBox from "../inputs/TextBox"
import TableData, { TableDataHeader } from "../inputs/TableData"
import EditContainer from "../EditContainer"
import EditDataSection, { EditDataItem } from "../dialogs/EditDataSection"
import { userAtom } from "../../atoms/users"
import { RESOURCE } from "../../types/user"
import { ValueType } from "write-excel-file"
import GroupBox from "../inputs/GroupBox"
import { addMatSkladAtom, deleteMatSkladAtom, loadMatSkladAtom, loadMatSkladColorsAtom, loadMatSkladDepartAtom, loadMatSkladIncomeAtom, loadMatSkladThickAtom, matSkladAtom, matSkladColorsAtom, matSkladDepartAtom, matSkladThickAtom } from "../../atoms/skladMat"
import PropertyGrid from "../inputs/PropertyGrid"
import CheckBox from "../inputs/CheckBox"

export default function SkladMatList() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.SKLAD_MAT)
    const loadMatDepartment = useSetAtom(loadMatSkladDepartAtom)
    const loadMatThickness = useSetAtom(loadMatSkladThickAtom)
    const loadMatColors = useSetAtom(loadMatSkladColorsAtom)
    const loadMatSklad = useSetAtom(loadMatSkladAtom)
    const loadMatIncome = useSetAtom(loadMatSkladIncomeAtom)
    const addMat = useSetAtom(addMatSkladAtom)
    const deleteMat = useSetAtom(deleteMatSkladAtom)
    const matSkladFull = useAtomValue(matSkladAtom)
    const matThickness = useAtomValue(matSkladThickAtom)
    const matDepartment = useAtomValue(matSkladDepartAtom)
    const matColors = useAtomValue(matSkladColorsAtom)
    const [sortTable, setSortTable] = useState(false)
    const [{ filterId, filterMinLength, filterMaxLength, filterMinWidth, filterMaxWidth, filterThick, filterDepart }, setFilter] = useState({ filterId: 0, filterMinLength: 0, filterMaxLength: 3000, filterMinWidth: 0, filterMaxWidth: 3000, filterThick: 0 , filterDepart: 0 })
    const matColorsFiltered = [...matColors.keys()].filter(m => matColors.get(m)?.thickId === filterThick || filterThick === 0).toSorted((id1, id2) => (matColors.get(id1)?.name || "") > (matColors.get(id2)?.name || "") ? 1 : -1)
    const matSklad = matSkladFull.filter(s => (s?.id === filterId || filterId === 0) && (s?.department === filterDepart || filterDepart === 0) && (matColors.get(s.id)?.thickId === filterThick || filterThick === 0) && s?.length >= filterMinLength && s?.length <= filterMaxLength && s?.width >= filterMinWidth && s?.width <= filterMaxWidth)
    const matSkladDistinctId = [...new Set(matSkladFull.map(s => s.id).filter(id => matColors.get(id)?.thickId === filterThick || filterThick === 0))]
    const [selected, setSelected] = useState({row: 0})
    const heads: TableDataHeader[] = [{ caption: "Цех" }, { caption: "Материал", sorted: sortTable }, { caption: "Толщина" }, { caption: "Длина", sorted: sortTable }, { caption: "Ширина", sorted: sortTable }, { caption: "Кол-во" }]
    const contents = matSklad.map((ss, index) => ({ key: index, data: [matDepartment.get(ss.department), matColors.get(ss.id)?.name, matThickness.get(matColors.get(ss.id)?.thickId || 0), ss.length || 0, ss.width || 0, ss.count || 0] }))
    const editItems: EditDataItem[] = [
        { title: "Цех:", value: matSklad[selected.row]?.department, displayValue: (value) =>  matDepartment.get(value as number) || "",
             inputType: InputType.LIST, list: [...matDepartment.keys()], checkValue: (value) => ({ success: !!value, message: "Выберите цех" }) },
        { title: "Материал:", value: matSklad[selected.row]?.id, displayValue: (value) => {
            const mat = matColors.get(value as number)
            return (mat?.name || "") + " " + matThickness.get(mat?.thickId || 0)
        },
             inputType: InputType.LIST, list: matColorsFiltered, checkValue: (value) => ({ success: !!value, message: "Выберите материал" }) },
        { title: "Длина:", value: matSklad[selected.row]?.length, nullValue: 0, inputType: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER, checkValue: (value) => ({ success: value as number > 0, message: "Длина должна быть больше 0" }) },
        { title: "Ширина:", value: matSklad[selected.row]?.width, nullValue: 0, inputType: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER, checkValue: (value) => ({ success: value as number > 0, message: "Ширина должна быть больше 0" }) },
        { title: "Кол-во:", value: matSklad[selected.row]?.count, nullValue: 0, inputType: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER, checkValue: (value) => ({ success: value as number > 0, message: "Кол-во должно быть больше 0" }) }
    ]
    useEffect(() => {
        loadMatDepartment()
        loadMatThickness()
        loadMatColors()
        loadMatSklad()
        loadMatIncome(true)
        loadMatIncome(false)
    }, [])
    const filterComboStyle ={
        width: "fit-content"
    }
    return <>
        <hr />
        <br />
        <GroupBox caption="Фильтр">
            <hr />
            <PropertyGrid>
                <ComboBox title="Цех" value={filterDepart} items={[...matDepartment.keys()]} displayValue={v => matDepartment.get(v) || ""} onChange={value => setFilter(prev => ({ ...prev, filterDepart: value || 0 }))} styles={filterComboStyle} />
                <ComboBox title="Толщина" value={filterThick} items={[...matThickness.keys()]} displayValue={v => matThickness.get(v) || ""} onChange={value => setFilter(prev => ({ ...prev, filterThick: value || 0 }))} styles={filterComboStyle} />
                <ComboBox title="Материал" value={filterId} items={matSkladDistinctId} displayValue={v => {
                    const mat = matColors.get(v as number)
                    return (mat?.name || "") + " " + matThickness.get(mat?.thickId || 0)
                }}
                onChange={value => setFilter(prev => ({ ...prev, filterId: value || 0 }))} withEmpty={true} styles={filterComboStyle} />
            </PropertyGrid>
            <hr />
            <div className="d-flex align-items-center gap-1">
                    <div>Длина от</div>
                    <TextBox type={PropertyType.INTEGER_POSITIVE_NUMBER} value={filterMinLength} min={0} max={10000} setValue={value => setFilter(prev => ({ ...prev, filterMinLength: +value || 0 }))} width="60px"/>
                    <div>до</div>
                    <TextBox type={PropertyType.INTEGER_POSITIVE_NUMBER} value={filterMaxLength} min={0} max={10000} setValue={value => setFilter(prev => ({ ...prev, filterMaxLength: +value || 0 }))} width="60px"/>
            </div>
            <div className="d-flex align-items-center gap-1">
                    <div>Ширина от</div>
                    <TextBox type={PropertyType.INTEGER_POSITIVE_NUMBER} value={filterMinWidth} min={0} max={10000} setValue={value => setFilter(prev => ({ ...prev, filterMinWidth: +value || 0 }))} width="60px"/>
                    <div>до</div>
                    <TextBox type={PropertyType.INTEGER_POSITIVE_NUMBER} value={filterMaxWidth} min={0} max={10000} setValue={value => setFilter(prev => ({ ...prev, filterMaxWidth: +value || 0 }))} width="60px"/>
            </div>
            <input type="button" value="Сбросить" onClick={() => setFilter({ filterId: 0, filterMinLength: 0, filterMaxLength: 3000, filterMinWidth: 0, filterMaxWidth: 3000, filterThick: 0, filterDepart: 0 })} />
        </GroupBox>
        <hr />
        <EditContainer>
            <div>
                <CheckBox caption="Сортировка" checked={sortTable} onChange={() => setSortTable(prev => !prev)} />
                <TableData header={heads} content={contents} onSelectRow={value => { setSelected(_ => ({ row: value as number })) }} />
            </div>
            {(perm?.Update) ? <EditDataSection name={matSklad[selected.row]?.id} items={editItems} dontUseCheckBoxes={true}
                onUpdate={perm?.Update ? {
                    caption: "Убрать со склада", question: (values) => getTakeOffQuestion(values), onAction: async (values) => {
                        const department = (values as ValueType[])[0] as number
                        const id = (values as ValueType[])[1] as number
                        const length = +(values as ValueType[])[2] as number
                        const width = +(values as ValueType[])[3] as number
                        const count = +(values as ValueType[])[4] as number
                        const result = await deleteMat({ id, length, width, count, department })
                        setSelected({row: 0})
                        return result
                    }
                } : undefined}
                onAdd={perm?.Update ? {
                    caption: "Добавить на склад", question: (values) => getAddQuestion(values), onAction: async (values) => {
                        const department = (values as ValueType[])[0] as number
                        const id = values[1] as number
                        const length = +values[2] as number
                        const width = +values[3] as number
                        const count = +(values as ValueType[])[4] as number
                        const result = await addMat({ id, length, width, count, department })
                        return result
                    }
                } : undefined}
                 /> : <div></div>}
        </EditContainer>
    </>
}


function getTakeOffQuestion(values: ValueType[]) {
    return  `Удалить остаток:
    Цех: ${values[0]}
    Материал: ${values[1]}
    Размеры: ${values[2]} x ${values[3]}
    Кол-во: ${values[4]}шт?`
}
function getAddQuestion(values: ValueType[]) {
    return `Добавить остаток:
    Цех: ${values[0]}
    Материал: ${values[1]}
    Размеры: ${values[2]} x ${values[3]}
    Кол-во: ${values[4]}шт?`
}