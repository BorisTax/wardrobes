import React, { MouseEventHandler } from 'react';

export type ComboBoxProps = {
    onChange?: (index: number, value: string) => void
    items: string[]
    value: string
    title: string
    disabled: boolean
    size?: number
}

export default function ComboBox(props: ComboBoxProps = { value: "", items: [], disabled: false, title: "", size: 1 }) {
    const options = props.items?.map((i, index) =>
        <option
            key={index}
            //selected={props.value === i ? true : false}
        >
            {i}
        </option>
    )
    return (
        <>
            {props.title ? <span style={{ whiteSpace: "nowrap" }}>{props.title}</span> : <></>}
            <select size={!props.size ? 1 : props.size}
                value={props.value}
                disabled={props.disabled}
                onClick={(e) => { e.stopPropagation() }}
                onChange={(e) => {
                    const index = props.items?.findIndex(i => i === e.target.value) || 0
                    if (props.onChange) props.onChange(index, e.target.value)
                }}>
                {options}
            </select >

        </>
    );
}

