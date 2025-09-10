import { useEffect, useMemo, useState } from "react"
import ComboBox from "../inputs/ComboBox"
import PropertyGrid from "../inputs/PropertyGrid"
import { InputType, PropertyType } from "../../types/property"
import { useAtomValue, useSetAtom } from "jotai"
import TextBox from "../inputs/TextBox"
import { addStolAtom, clearStolAtom, deleteStolAtom, loadStolColorsAtom, loadStolSkladAtom, stolColorsAtom, stolIncomeAtom, stolOutcomeAtom, stolSkladAtom } from "../../atoms/sklad"
import TableData, { TableDataHeader } from "../inputs/TableData"
import EditContainer from "../EditContainer"
import EditDataSection, { EditDataItem } from "../dialogs/EditDataSection"
import { userAtom } from "../../atoms/users"
import { RESOURCE } from "../../types/user"
import messages from "../../server/messages"
import { ValueType } from "write-excel-file"
import GroupBox from "../inputs/GroupBox"
import PropertyRow from "../inputs/PropertyRow"

export default function SkladStol() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.SKLAD_STOL)
    const loadStolColors = useSetAtom(loadStolColorsAtom)
    const loadStolSklad = useSetAtom(loadStolSkladAtom)
    const addStol = useSetAtom(addStolAtom)
    const deleteStol = useSetAtom(deleteStolAtom)
    const clearStol = useSetAtom(clearStolAtom)
    const stolSkladFull = useAtomValue(stolSkladAtom)
    const stolSkladDistinctId = [...new Set(stolSkladFull.map(s => s.id))]
    const stolColors = useAtomValue(stolColorsAtom)
    const [{ filterId, filterMinLength, filterMaxLength }, setFilter] = useState({ filterId: 0, filterMinLength: 0, filterMaxLength: 4000 })
    const stolSklad = stolSkladFull.filter(s => (s?.id === filterId || filterId === 0) && s?.length >= filterMinLength && s?.length <= filterMaxLength)
    const [selectedRow, setSelectedRow] = useState(0)
    const heads: TableDataHeader[] = [{ caption: "Столешница" }, { caption: "Длина" }, { caption: "Кол-во" }]
    const contents = stolSklad.map((ss, index) => ({ key: index, data: [stolColors.get(ss.id), ss.length, ss.amount] }))
    const editItems: EditDataItem[] = [
        { title: "Столешница:", value: stolSklad[selectedRow]?.id, displayValue: (value) => stolColors.get(value as number) || "", message: messages.ENTER_CAPTION, inputType: InputType.LIST, list: [...stolColors.keys()] },
        { title: "Длина:", value: stolSklad[selectedRow]?.length, message: messages.ENTER_CODE, inputType: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER, checkValue: (value) => ({ success: value as number > 0, message: "Длина должна быть больше 0" }) },
        { title: "Кол-во:", value: stolSklad[selectedRow]?.amount, inputType: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER, checkValue: (value) => ({ success: value as number > 0, message: "Кол-во должно быть больше 0" }) }
    ]
    useEffect(() => {
        loadStolColors()
        loadStolSklad()
    }, [])
    const filterComboStyle ={
        width: "fit-content"
    }
    return <>
        <hr />
        <br />
        <GroupBox caption="Фильтр">
            <hr />
            <ComboBox value={filterId} items={stolSkladDistinctId} displayValue={v => stolColors.get(v)} onChange={value => setFilter(prev => ({ ...prev, filterId: value || 0 }))} withEmpty={true} styles={filterComboStyle} />
            <hr />
            <div className="d-flex align-items-center gap-1">
                    <div>Длина от</div>
                    <TextBox type={PropertyType.INTEGER_POSITIVE_NUMBER} value={filterMinLength} min={0} max={10000} setValue={value => setFilter(prev => ({ ...prev, filterMinLength: +value || 0 }))} width="60px"/>
                    <div>до</div>
                    <TextBox type={PropertyType.INTEGER_POSITIVE_NUMBER} value={filterMaxLength} min={0} max={10000} setValue={value => setFilter(prev => ({ ...prev, filterMaxLength: +value || 0 }))} width="60px"/>
            </div>
            <input type="button" value="Сбросить" onClick={() => setFilter({ filterId: 0, filterMinLength: 0, filterMaxLength: 4000 })} />
        </GroupBox>
        <hr />
        <EditContainer>
            <div>
                <TableData header={heads} content={contents} onSelectRow={value => { setSelectedRow(value as number) }} />
            </div>
            {(perm?.Update) ? <EditDataSection name={stolSklad[selectedRow]?.id} items={editItems} dontUseCheckBoxes={true}
                onUpdate={perm?.Update ? {
                    caption: "Убрать со склада", question: (values) => getTakeOffQuestion(values), onAction: async (_, values) => {
                        const id = (values as ValueType[])[0] as number
                        const length = +(values as ValueType[])[1] as number
                        const amount = +(values as ValueType[])[2] as number
                        const result = await deleteStol({ id, length, amount })
                        setSelectedRow(0)
                        return result
                    }
                } : undefined}
                onAdd={perm?.Update ? {
                    caption: "Добавить на склад", question: (values) => getAddQuestion(values), onAction: async (checked, values) => {
                        const id = values[0] as number
                        const length = +values[1] as number
                        const amount = +values[2] as number
                        const result = await addStol({ id, length, amount })
                        return result
                    }
                } : undefined}
                onDelete={perm?.Delete ? {
                    caption: "Очистить все списки", question: () => "Удалить все данные?", onAction: async (checked, values) => {
                        const result = await clearStol()
                        return result
                    }
                } : undefined} /> : <div></div>}
        </EditContainer>
    </>
}


function getTakeOffQuestion(values: ValueType[]) {
    return `Удалить столешницу ${values[0]}     ${values[1]}мм  ${values[2]}шт?`
}
function getAddQuestion(values: ValueType[]) {
    return `Добавить столешницу ${values[0]}    ${values[1]}мм  ${values[2]}шт?`
}