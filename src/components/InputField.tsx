import React, { useState, useEffect } from "react"
import { PropertyTypes, RegExp } from "../types/propertyTypes"
const { NUMBER, INTEGER_POSITIVE_NUMBER } = PropertyTypes

export type InputFieldProps = {
    setValue: (value: string | number) => void
    value: string | number
    type: string
    disabled: boolean
    max?: number
    min?: number
}

export default function InputField(props: InputFieldProps) {
    const [state, setState] = useState({ value: props.value, prevValue: props.value })
    const isNumber = (props.type === NUMBER) || (props.type === INTEGER_POSITIVE_NUMBER)
    useEffect(() => {
        setState({ prevValue: props.value, value: props.value })
    }, [props.value])
    const onChange = (v: string) => {
        if (v === "") { setState({ ...state, value: v }); return }
        let { value, correct } = test(v, props.type)
        //if (isNumber) value = +value
        if (correct) setState({ ...state, value })
    }
    const onKeyPress = (key: string, value: string) => {
        if (key === "Enter") {
            const { correct } = test(value, props.type, props.max, props.min)
            if (correct && value !== "") {
                props.setValue(state.value);
                setState({ ...state, prevValue: state.value });
            }
            else {
                if (!isNumber) props.setValue(value);
                setState({ ...state, value: isNumber ? state.prevValue : value })
            }
        }
    }
    const className = ((state.value !== state.prevValue) ? "input-cell-incorrect" : "input-cell")

    return <form 
        onSubmit={(e)=>{
            e.preventDefault()
            const formData = new FormData(e.target as HTMLFormElement)
            const input = formData.get("input") || ""
            props.setValue(input?.toString())
        }}
        onClick={(e)=>{e.stopPropagation()}}>
            <input
                type="text"
                className={className}
                disabled={props.disabled}
                value={state.value}
                name="input"
                // onKeyPress={(e) => {
                //     onKeyPress(e.key, e.target.value);
                //     e.stopPropagation()
                // }}
                onKeyDown={(e) => {
                    e.stopPropagation()
                }}
                onBlur={() => {
                    setState({ ...state, value: state.prevValue });
                }}
                onChange={(e) => { onChange(e.target.value) }}
                />
        </form>
}

function test(value: string, type: string, max?: number, min?: number) {
    const regexp = RegExp.get(type) || '';
    const result = { value, correct: false }
    if ((`${value}`.match(regexp) !== null) || value === "") { result.correct = true }
    if (min !== undefined) result.correct = +value >= min
    if (max !== undefined) result.correct = result.correct && (+value <= max)
    return result;
}

