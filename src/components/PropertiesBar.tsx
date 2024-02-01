import React, { useContext } from "react"
import Fasad from "../classes/Fasad"
import ComboBox from "./ComboBox"
import { Materials } from "../assets/data"
import { AppContext } from "../App"
import { divideFasad, setHeight, setMaterial, setWidth } from "../actions/AppActions"
import { Division } from "../types/enums"
import PropertyRow from "./PropertyRow"
import InputField from "./InputField"
import { PropertyTypes } from "../types/propertyTypes"
const sections = ["1", "2", "3", "4", "5", "6", "7", "8"]
export default function PropertiesBar({ fasad }: { fasad: Fasad | null }) {
    const width = fasad?.Width || 0
    const height = fasad?.Height || 0
    const material = fasad?.Material || ""
    const materials = fasad ? Materials : []
    const directions = ["Вертикально", "Горизонтально"]
    const direction = fasad?.Division === Division.HEIGHT ? directions[1] : directions[0]
    const sectionCount = (fasad && (fasad.Children.length > 1)) ? `${fasad.Children.length}` : "1"

    const { dispatch } = useContext(AppContext)
    return <div className="properties-bar">
        <div>Параметры фасада</div>
        <PropertyRow>
            <div>Высота: </div>
            <InputField value={height} type={PropertyTypes.INTEGER_POSITIVE_NUMBER} min={100} setValue={(value)=>{dispatch(setHeight(+value))}} disabled={!fasad} />
        </PropertyRow>
        <PropertyRow>
            <div>Ширина: </div>
            <InputField value={width} type={PropertyTypes.INTEGER_POSITIVE_NUMBER} min={100} setValue={(value)=>{dispatch(setWidth(+value))}} disabled={!fasad} />
        </PropertyRow>
        <PropertyRow>
            <ComboBox title="Материал: " value={material} items={materials} disabled={!fasad} onChange={(_, value) => { dispatch(setMaterial(value)) }} />
        </PropertyRow>
        <PropertyRow>
            <ComboBox title="Направление профиля: " value={direction} items={directions} disabled={!fasad} onChange={(_, value) => { }} />
        </PropertyRow>
        <PropertyRow>
            <ComboBox title="Кол-во секций: " value={sectionCount} items={sections} disabled={!fasad} onChange={(_, value) => { dispatch(divideFasad(+value)) }} />
        </PropertyRow>
    </div>
}