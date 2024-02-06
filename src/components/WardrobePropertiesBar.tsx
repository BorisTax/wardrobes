import React, { useContext } from "react"
import { AppContext } from "../App"
import InputField from "./InputField"
import { PropertyTypes } from "../types/propertyTypes"
import PropertyGrid from "./PropertyGrid"
import PropertyRow from "./PropertyRow"
export default function WardrobePropertiesBar() {
    const { state, dispatch } = useContext(AppContext)
    return <div className="properties-bar">
        <div>Параметры шкафа</div>
        <hr/>
        <PropertyGrid>
            <div className="text-end">Высота: </div>
            <PropertyRow>
                <InputField value={0} type={PropertyTypes.INTEGER_POSITIVE_NUMBER} min={100} setValue={(value) => { }} disabled={true} />
            </PropertyRow>
            <div className="text-end">Ширина: </div>
            <PropertyRow>
                <InputField value={0} type={PropertyTypes.INTEGER_POSITIVE_NUMBER} min={100} setValue={(value) => {  }} disabled={true} />
            </PropertyRow>
        </PropertyGrid>
    </div>
}