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
import messages from "../../server/messages"
import { ValueType } from "write-excel-file"
import GroupBox from "../inputs/GroupBox"
import { addMatSkladAtom, clearMatSkladAtom, deleteMatSkladAtom, loadMatSkladAtom, loadMatSkladColorsAtom, loadMatSkladIncomeAtom, loadMatSkladThickAtom, matSkladAtom, matSkladColorsAtom, matSkladThickAtom } from "../../atoms/skladMat"

export default function SkladMatList() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.SKLAD_MAT)
    const loadMatThickness = useSetAtom(loadMatSkladThickAtom)
    const loadMatColors = useSetAtom(loadMatSkladColorsAtom)
    const loadMatSklad = useSetAtom(loadMatSkladAtom)
    const loadMatIncome = useSetAtom(loadMatSkladIncomeAtom)
    const addMat = useSetAtom(addMatSkladAtom)
    const deleteMat = useSetAtom(deleteMatSkladAtom)
    const clearMat = useSetAtom(clearMatSkladAtom)
    const matSkladFull = useAtomValue(matSkladAtom)
    const matThickness = useAtomValue(matSkladThickAtom)
    const matColors = useAtomValue(matSkladColorsAtom)
    const [{ filterId, filterMinLength, filterMaxLength, filterMinWidth, filterMaxWidth, filterThick }, setFilter] = useState({ filterId: 0, filterMinLength: 0, filterMaxLength: 3000, filterMinWidth: 0, filterMaxWidth: 3000, filterThick: 0  })
    const matColorsFiltered = [...matColors.keys()].filter(m => matColors.get(m)?.thickId === filterThick || filterThick === 0)
    const matSklad = matSkladFull.filter(s => (s?.id === filterId || filterId === 0) && (matColors.get(s.id)?.thickId === filterThick || filterThick === 0) && s?.length >= filterMinLength && s?.length <= filterMaxLength && s?.width >= filterMinWidth && s?.width <= filterMaxWidth)
    const matSkladDistinctId = [...new Set(matSkladFull.map(s => s.id).filter(id => matColors.get(id)?.thickId === filterThick || filterThick === 0))]
    const [selected, setSelected] = useState({row: 0})
    const heads: TableDataHeader[] = [{ caption: "Материал" }, { caption: "Толщина" }, { caption: "Длина" }, { caption: "Ширина" }, { caption: "Кол-во" }]
    const contents = matSklad.map((ss, index) => ({ key: index, data: [matColors.get(ss.id)?.name, matThickness.get(matColors.get(ss.id)?.thickId || 0), ss.length || 0, ss.width || 0, ss.count || 0] }))
    const editItems: EditDataItem[] = [
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
            <ComboBox value={filterThick} items={[...matThickness.keys()]} displayValue={v => matThickness.get(v) || ""} onChange={value => setFilter(prev => ({ ...prev, filterThick: value || 0 }))} styles={filterComboStyle} />
            <br />
            <ComboBox value={filterId} items={matSkladDistinctId} displayValue={v => {
                    const mat = matColors.get(v as number)
                    return (mat?.name || "") + " " + matThickness.get(mat?.thickId || 0)
                }}
                onChange={value => setFilter(prev => ({ ...prev, filterId: value || 0 }))} withEmpty={true} styles={filterComboStyle} />
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
            <input type="button" value="Сбросить" onClick={() => setFilter({ filterId: 0, filterMinLength: 0, filterMaxLength: 3000, filterMinWidth: 0, filterMaxWidth: 3000, filterThick: 0 })} />
        </GroupBox>
        <hr />
        <EditContainer>
            <div>
                <TableData header={heads} content={contents} onSelectRow={value => { setSelected(_ => ({ row: value as number })) }} />
            </div>
            {(perm?.Update) ? <EditDataSection name={matSklad[selected.row]?.id} items={editItems} dontUseCheckBoxes={true}
                onUpdate={perm?.Update ? {
                    caption: "Убрать со склада", question: (values) => getTakeOffQuestion(values), onAction: async (_, values) => {
                        const id = (values as ValueType[])[0] as number
                        const length = +(values as ValueType[])[1] as number
                        const width = +(values as ValueType[])[2] as number
                        const count = +(values as ValueType[])[3] as number
                        const result = await deleteMat({ id, length, width, count })
                        setSelected({row: 0})
                        return result
                    }
                } : undefined}
                onAdd={perm?.Update ? {
                    caption: "Добавить на склад", question: (values) => getAddQuestion(values), onAction: async (checked, values) => {
                        const id = values[0] as number
                        const length = +values[1] as number
                        const width = +values[2] as number
                        const count = +(values as ValueType[])[3] as number
                        const result = await addMat({ id, length, width, count })
                        return result
                    }
                } : undefined}
                onDelete={perm?.Delete ? {
                    caption: "Очистить все списки", question: () => "Удалить все данные?", onAction: async (checked, values) => {
                        const result = await clearMat()
                        return result
                    }
                } : undefined} /> : <div></div>}
        </EditContainer>
    </>
}


function getTakeOffQuestion(values: ValueType[]) {
    return `Удалить остаток ${values[0]}     ${values[1]} x ${values[2]} ${values[3]}шт?`
}
function getAddQuestion(values: ValueType[]) {
    return `Добавить остаток ${values[0]}    ${values[1]} x ${values[2]} ${values[3]}шт?`
}