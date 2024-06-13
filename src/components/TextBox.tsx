import { useState, useEffect } from "react"
import { PropertyType, RegExp } from "../types/property"
const { NUMBER, INTEGER_POSITIVE_NUMBER } = PropertyType

export type TextBoxProps = {
    setValue: (value: string | number) => void
    value: string | number
    type: PropertyType
    name?: string
    disabled?: boolean
    max?: number
    min?: number
}

export default function TextBox(props: TextBoxProps) {
    const [state, setState] = useState({ value: props.value, prevValue: props.value })
    useEffect(() => {
        setState({ prevValue: props.value, value: props.value })
    }, [props.value])
    const onChange = (v: string) => {
        if (v === "") { setState({ ...state, value: v }); return }
        let { value, correct } = test(v, props.type, props.max, props.min)
        if (correct) setState({ ...state, value })
    }
    const className = ((state.value !== state.prevValue) ? "textbox-incorrect" : "textbox")

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const input = formData.get(props.name || "input") || "";
          if (minMaxTest(state.value, props.max, props.min))
            props.setValue(input?.toString());
          else setState({ ...state, value: state.prevValue });
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <input
          type="text"
          className={className}
          disabled={props.disabled}
          value={state.value}
          name={props.name || "input"}
          onKeyDown={(e) => {
            e.stopPropagation();
          }}
          onBlur={() => {
            setState({ ...state, value: state.prevValue });
          }}
          onChange={(e) => {
            onChange(e.target.value);
          }}
        />
      </form>
    );
}

function test(value: string | number, type: PropertyType, max?: number, min?: number) {
    const regexp = RegExp.get(type) || '';
    const result = { value, correct: false }
    if ((`${value}`.match(regexp) !== null) || value === "") { result.correct = true }
    return result;
}

function minMaxTest(value: string | number, max?: number, min?: number) {
    let result = true
    if (min !== undefined) result = +value >= min
    if (max !== undefined) result = result && (+value <= max)
    return result;
}