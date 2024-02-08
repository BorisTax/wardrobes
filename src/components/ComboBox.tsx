import React from 'react';

export type ComboBoxProps = {
    onChange?: (index: number, value: string) => void
    items: string[] | Map<string, string>
    value: string
    title: string
    disabled?: boolean
    size?: number
}

export default function ComboBox(props: ComboBoxProps = { value: "", items: [], disabled: false, title: "", size: 1 }) {
    const items: string[] = props.items instanceof Map ? [...props.items.keys()] : props.items
    let value = props.value
    if (props.items instanceof Map) {
        const key = [...props.items].find(i => i[1] === props.value)
        if (key) value = key[0]
    }
    const options = items?.map((i, index) =>
        <option
            key={index}
        >
            {i}
        </option>
    )
    return (
        <>
            {props.title ? <span className="text-end text-nowrap">{props.title}</span> : <></>}
            <select size={!props.size ? 1 : props.size}
                value={value}
                disabled={props.disabled}
                onClick={(e) => { e.stopPropagation() }}
                onChange={(e) => {
                    const index = items.findIndex(i => i === e.target.value) || 0
                    const value = props.items instanceof Map ? (props.items as Map<string, string>).get(e.target.value) || "" : e.target.value 
                    if (props.onChange) props.onChange(index, value)
                }}>
                {options}
            </select >

        </>
    );
}

