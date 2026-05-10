import { useEffect, useState } from "react"
import ComboBox from "../inputs/ComboBox"
import { PropertyType } from "../../types/property"
import { useAtomValue } from "jotai"
import TextBox from "../inputs/TextBox"
import TableData, { TableDataHeader } from "../inputs/TableData"
import { getDateFormat, getDateInputValue, getMaxDateTime } from "../../functions/date"
import GroupBox from "../inputs/GroupBox"
import { matSkladColorsAtom, matSkladDepartAtom, matSkladIncomeAtom, matSkladOutcomeAtom, matSkladThickAtom } from "../../atoms/skladMat"
import PropertyGrid from "../inputs/PropertyGrid"

export default function SkladMatIncome({ income }: { income: boolean }) {
    const listFull = income ? useAtomValue(matSkladIncomeAtom) : useAtomValue(matSkladOutcomeAtom)
    const matColors = useAtomValue(matSkladColorsAtom)
    const matThickness = useAtomValue(matSkladThickAtom)
    const matDepartment = useAtomValue(matSkladDepartAtom)
    const minDate = listFull.map(l => l.date).reduce((prev, curr) => prev > curr ? curr : prev, listFull[0]?.date)
    const {filterDepart, filterId, filterMinLength, filterMaxLength, filterMinWidth, filterMaxWidth, filterMinDate, filterMaxDate, filterThick, setFilter } = useFilter(income, minDate)
    const list = listFull.filter(s => (s?.id === filterId || filterId === 0) && (s?.department === filterDepart || filterId === 0) && (matColors.get(s.id)?.thickId === filterThick || filterThick === 0) && s?.length >= filterMinLength && s?.length <= filterMaxLength && s?.width >= filterMinWidth && s?.width <= filterMaxWidth && s?.date >= filterMinDate && s?.date <= filterMaxDate)
    const listDistinctId = [...new Set(listFull.map(s => s.id).filter(id => matColors.get(id)?.thickId === filterThick || filterThick === 0))]
    const minDateValue = getDateInputValue(filterMinDate)
    const maxDateValue = getDateInputValue(filterMaxDate)
    const header: TableDataHeader[] = [{ caption: "Дата" },{ caption: "Цех" },  { caption: "Материал" }, { caption: "Толщина" }, { caption: "Длина" }, { caption: "Ширина" }, { caption: "Кол-во" }, { caption: "Пользователь" }]
    const contents = list.map(ss => ({ key: ss.id, data: [getDateFormat(ss.date),matDepartment.get(ss.department), matColors.get(ss.id)?.name, matThickness.get(matColors.get(ss.id)?.thickId || 0), ss.length, ss.width, ss.count, ss.user] }))
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
            <PropertyGrid>
                <ComboBox title="Цех" value={filterDepart} items={[...matDepartment.keys()]} displayValue={v => matDepartment.get(v) || ""} onChange={value => setFilter(prev => ({ ...prev, filterDepart: value || 0 }))} styles={filterComboStyle} />
                <ComboBox title="Толщина" value={filterThick} items={[...matThickness.keys()]} displayValue={v => matThickness.get(v) || ""} onChange={value => setFilter(prev => ({ ...prev, filterThick: value || 0 }))} styles={filterComboStyle} />
                <ComboBox title="Материал" value={filterId} items={listDistinctId} displayValue={v => {
                    const mat = matColors.get(v as number)
                    return (mat?.name || "") + " " + matThickness.get(mat?.thickId || 0)
                }}
                onChange={value => setFilter(prev => ({ ...prev, filterId: value || 0 }))} withEmpty={true} styles={filterComboStyle} />
            </PropertyGrid>
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
            <input type="button" value="Сбросить" onClick={() => setFilter({ filterDepart: 0, filterId: 0, filterMinLength: 0, filterMaxLength: 4000, filterMinWidth: 0, filterMaxWidth: 4000, filterMinDate: minDate, filterMaxDate: Date.now(), filterThick: 0 })} />
        </GroupBox>
        <hr />
        <TableData header={header} content={contents} />
    </div>
}

function useFilter(income: boolean, minDate: number) {
    const [{ filterDepart: filterDepart1, filterId: filterId1, filterMinLength: filterMinLength1, filterMaxLength: filterMaxLength1, filterMinWidth: filterMinWidth1, filterMaxWidth: filterMaxWidth1, filterMinDate: filterMinDate1, filterMaxDate: filterMaxDate1, filterThick: filterThick1 }, setFilter1] = useState({ filterDepart: 0, filterId: 0, filterMinLength: 0, filterMaxLength: 4000, filterMinWidth: 0, filterMaxWidth: 4000, filterMinDate: minDate, filterMaxDate: Date.now(), filterThick: 0 })
    const [{ filterDepart: filterDepart2, filterId: filterId2, filterMinLength: filterMinLength2, filterMaxLength: filterMaxLength2, filterMinWidth: filterMinWidth2, filterMaxWidth: filterMaxWidth2, filterMinDate: filterMinDate2, filterMaxDate: filterMaxDate2, filterThick: filterThick2 }, setFilter2] = useState({ filterDepart: 0, filterId: 0, filterMinLength: 0, filterMaxLength: 4000, filterMinWidth: 0, filterMaxWidth: 4000, filterMinDate: minDate, filterMaxDate: Date.now(), filterThick: 0 })    
    return {
        filterDepart: income ? filterDepart1 : filterDepart2,
        filterId: income ? filterId1 : filterId2,
        filterMinLength: income ? filterMinLength1 : filterMinLength2,
        filterMaxLength: income ? filterMaxLength1 : filterMaxLength2,
        filterMinWidth: income ? filterMinWidth1 : filterMinWidth2,
        filterMaxWidth: income ? filterMaxWidth1 : filterMaxWidth2,
        filterMinDate: income ? filterMinDate1 : filterMinDate2,
        filterMaxDate: income ? filterMaxDate1 : filterMaxDate2,
        filterThick:income ? filterThick1 : filterThick2,
        setFilter: income ? setFilter1 : setFilter2
    }
}