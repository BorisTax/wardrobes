import React, { useContext } from "react"
import Fasad from "../classes/Fasad"
import ComboBox from "./ComboBox"
import { Materials } from "../assets/data"
import { AppContext } from "../App"
import { divideFasad, setFixedHeight, setFixedWidth, setHeight, setMaterial, setProfileDirection, setWidth } from "../actions/AppActions"
import { Division } from "../types/enums"
import InputField from "./InputField"
import { PropertyTypes } from "../types/propertyTypes"
import PropertyGrid from "./PropertyGrid"
import PropertyRow from "./PropertyRow"
import ToggleButton from "./ToggleButton"
const sections = ["1", "2", "3", "4", "5", "6", "7", "8"]
export default function PropertiesBar({ fasad }: { fasad: Fasad | null }) {
    const width = fasad?.cutWidth || 0
    const height = fasad?.cutHeight || 0
    const material = fasad?.Material || ""
    const materials = fasad ? Materials : []
    const directions: Map<string, string> = new Map()
    directions.set("Вертикально", Division.WIDTH)
    directions.set("Горизонтально", Division.HEIGHT)
    const direction = fasad?.Division === Division.HEIGHT ? "Горизонтально" : "Вертикально"
    const sectionCount = (fasad && (fasad.Children.length > 1)) ? `${fasad.Children.length}` : "1"
    const fixWidth = fasad?.FixedWidth() || false
    const fixHeight = fasad?.FixedHeight() || false
    const disabledWidth = !fasad || fasad.FixedWidth()
    const disabledHeight = !fasad || fasad.FixedHeight()
    const disabledFixWidth = !fasad
    const disabledFixHeight = !fasad
    const { dispatch } = useContext(AppContext)
    return <div className="properties-bar">
        <div>Параметры фасада</div>
        <PropertyGrid>
            <div className="text-end">Высота: </div>
            <PropertyRow>
                <InputField value={height} type={PropertyTypes.INTEGER_POSITIVE_NUMBER} min={100} setValue={(value) => { dispatch(setHeight(+value)) }} disabled={disabledHeight} />
                <ToggleButton pressed={fixHeight} iconPressed="fix" iconUnPressed="unfix" title="Зафиксировать высоту" disabled={disabledFixHeight} onClick={() => { dispatch(setFixedHeight(!fixHeight)) }} />
            </PropertyRow>
            <div className="text-end">Ширина: </div>
            <PropertyRow>
                <InputField value={width} type={PropertyTypes.INTEGER_POSITIVE_NUMBER} min={100} setValue={(value) => { dispatch(setWidth(+value)) }} disabled={disabledWidth} />
                <ToggleButton pressed={fixWidth} iconPressed="fix" iconUnPressed="unfix" title="Зафиксировать ширину" disabled={disabledFixWidth} onClick={() => { dispatch(setFixedWidth(!fixWidth)) }} />
            </PropertyRow>
            <ComboBox title="Материал: " value={material} items={materials} disabled={!fasad} onChange={(_, key, value) => { dispatch(setMaterial(key)) }} />
            <ComboBox title="Направление профиля: " value={direction} items={directions} disabled={!fasad} onChange={(_, key,  value) => { dispatch(setProfileDirection(key)) }} />
            <ComboBox title="Кол-во секций: " value={sectionCount} items={sections} disabled={!fasad} onChange={(_, key, value) => { dispatch(divideFasad(+value)) }} />
        </PropertyGrid>
    </div>
}