import { useEffect, useState } from "react"
import ComboBox from "../inputs/ComboBox"
import { PropertyType } from "../../types/property"
import { useAtomValue, useSetAtom } from "jotai"
import TextBox from "../inputs/TextBox"
import { loadStolIncomeAtom, stolColorsAtom, stolIncomeAtom, stolOutcomeAtom } from "../../atoms/sklad"
import TableData, { TableDataHeader } from "../inputs/TableData"
import { getDateFormat, getDateInputValue, getMaxDateTime } from "../../functions/date"
import GroupBox from "../inputs/GroupBox"

export default function SkladStolIncome({ income }: { income: boolean }) {
    const loadStolIncome = useSetAtom(loadStolIncomeAtom)
    const listFull = income ? useAtomValue(stolIncomeAtom) : useAtomValue(stolOutcomeAtom)
    const stolColors = useAtomValue(stolColorsAtom)
    const listDistinctId = [...new Set(listFull.map(s => s.id))]
    const minDate = listFull.map(l => l.date).reduce((prev, curr) => prev > curr ? curr : prev, listFull[0]?.date)
    const { filterId, filterMinLength, filterMaxLength, filterMinDate, filterMaxDate, setFilter } = useFilter(income, minDate)
    const list = listFull.filter(s => (s?.id === filterId || filterId === 0) && s?.length >= filterMinLength && s?.length <= filterMaxLength && s?.date >= filterMinDate && s?.date <= filterMaxDate)
    const minDateValue = getDateInputValue(filterMinDate)
    const maxDateValue = getDateInputValue(filterMaxDate)
    const header: TableDataHeader[] = [{ caption: "Дата" }, { caption: "Столешница" }, { caption: "Длина" }, { caption: "Кол-во" }]
    const contents = list.map(ss => ({ key: ss.id, data: [getDateFormat(ss.date), stolColors.get(ss.id), ss.length, ss.amount] }))
    useEffect(() => {
        loadStolIncome(income)
    }, [income])
    useEffect(() => {
        setFilter(prev => ({ ...prev, filterMinDate: minDate }))
    }, [minDate])
    const filterComboStyle = {
        width: "fit-content"
    }
    return <div className="sklad-container">
        <hr />
        <br />
        <GroupBox caption="Фильтр">
            <hr />
            <ComboBox value={filterId} items={listDistinctId} displayValue={v => stolColors.get(v)} onChange={value => setFilter(prev => ({ ...prev, filterId: value || 0 }))} withEmpty={true} styles={filterComboStyle} />
            <hr />
            <div className="d-flex align-items-center gap-1">
                <div>Длина от</div>
                <TextBox type={PropertyType.INTEGER_POSITIVE_NUMBER} value={filterMinLength} min={0} max={10000} setValue={value => setFilter(prev => ({ ...prev, filterMinLength: +value || 0 }))} width="60px" />
                <div>до</div>
                <TextBox type={PropertyType.INTEGER_POSITIVE_NUMBER} value={filterMaxLength} min={0} max={10000} setValue={value => setFilter(prev => ({ ...prev, filterMaxLength: +value || 0 }))} width="60px" />
            </div>
            <div className="d-flex align-items-center gap-1 justify-content-stretch">
                <input type="date" value={minDateValue} onChange={(e) => setFilter(prev => ({ ...prev, filterMinDate: new Date(e.target.value).valueOf() }))} />
                <div className="text-nowrap">{'<---->'}</div>
                <input type="date" value={maxDateValue} onChange={(e) => setFilter(prev => ({ ...prev, filterMaxDate: getMaxDateTime(e.target.value) }))} />
            </div>
            <input type="button" value="Сбросить" onClick={() => setFilter({ filterId: 0, filterMinLength: 0, filterMaxLength: 4000, filterMinDate: minDate, filterMaxDate: Date.now() })} />
        </GroupBox>
        <hr />
        <TableData header={header} content={contents} />
    </div>
}

function useFilter(income: boolean, minDate: number) {
    const [{ filterId: filterId1, filterMinLength: filterMinLength1, filterMaxLength: filterMaxLength1, filterMinDate: filterMinDate1, filterMaxDate: filterMaxDate1 }, setFilter1] = useState({ filterId: 0, filterMinLength: 0, filterMaxLength: 4000, filterMinDate: minDate, filterMaxDate: Date.now() })
    const [{ filterId: filterId2, filterMinLength: filterMinLength2, filterMaxLength: filterMaxLength2, filterMinDate: filterMinDate2, filterMaxDate: filterMaxDate2 }, setFilter2] = useState({ filterId: 0, filterMinLength: 0, filterMaxLength: 4000, filterMinDate: minDate, filterMaxDate: Date.now() })
    return {
        filterId: income ? filterId1 : filterId2,
        filterMinLength: income ? filterMinLength1 : filterMinLength2,
        filterMaxLength: income ? filterMaxLength1 : filterMaxLength2,
        filterMinDate: income ? filterMinDate1 : filterMinDate2,
        filterMaxDate: income ? filterMaxDate1 : filterMaxDate2,
        setFilter: income ? setFilter1 : setFilter2
    }
}