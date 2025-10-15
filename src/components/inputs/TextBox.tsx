import { useState, useEffect } from "react"
import { PropertyType, RegExp } from "../../types/property"

export type TextBoxProps = {
    setValue: (value: string) => void
    value: string | number
    type: PropertyType
    name?: string
    disabled?: boolean
    max?: number
    min?: number
    submitOnLostFocus?: boolean
    width?: string
}

export default function TextBox(props: TextBoxProps) {
    const [state, setState] = useState({ value: String(props.value), prevValue: String(props.value) })
    useEffect(() => {
        let value = props.value
        if (typeof value === 'number'){
          if (props.min && value < props.min) props.setValue(String(props.min));
          if (props.max && value > props.max) props.setValue(String(props.max));
        }
        setState({ prevValue: String(value), value: String(value) })
    }, [props.value, props.min, props.max])
    const onChange = (v: string) => {
        if (v === "") { setState({ ...state, value: v }); return }
        const { value, correct } = test(v, props.type)
        if (correct) setState({ ...state, value })
    }
  const className = ((state.value !== state.prevValue) ? "textbox-incorrect" : "textbox")
  const submit = () => {
    if (minMaxTest(state.value, props.max, props.min))
      props.setValue(state.value);
    else setState({ ...state, value: state.prevValue });
  }
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit()
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onBlur={() => {
          if (props.submitOnLostFocus && state.value !== state.prevValue) submit(); else setState({ ...state, value: state.prevValue })
        }}
      >
        <input
          type="text"
          style={{ width: props.width || "auto" }}
          className={className}
          disabled={props.disabled}
          value={state.value}
          name={props.name || "input"}
          onKeyDown={(e) => {
            e.stopPropagation();
          }}
          onChange={(e) => {
            onChange(e.target.value);
          }}
        />
      </form>
    );
}

function test(value: string, type: PropertyType) {
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