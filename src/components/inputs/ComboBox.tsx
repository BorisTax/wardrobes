import { ReactNode, ReactNodeArray } from "react"

export type ComboBoxProps<T> = {
    onChange?: (index: number, value: T) => void
    items: T[]
    value?: T
    displayValue: (value: T) => string | undefined
    withEmpty?: boolean
    title?: string
    disabled?: boolean
    size?: number
    styles?: object
}

export default function ComboBox<T>(props: ComboBoxProps<T> = { items: [], disabled: false, title: "", size: 1, styles: {}, displayValue: () => "" }) {
    const items: T[] = props.items instanceof Map ? [...props.items.values()] : props.items
    let value: T = items.find(i => i === props.value) as T
    const options: ReactNode[] = []
    if (props.withEmpty) options.push(<option key={-1}>{""}</option>)
    items?.forEach((i, index) =>
        options.push(
            <option key={index}>
                {props.displayValue(i) || ""}
            </option>))
    return (
        <>
            {props.title ? <span className="text-end text-nowrap" style={{ ...props.styles }}>{props.title}</span> : <></>}
            <select size={!props.size ? 1 : props.size}
                value={props.displayValue(value)}
                style={{ ...props.styles }}
                disabled={props.disabled}
                onClick={(e) => { e.stopPropagation() }}
                onChange={(e) => {
                    const index = props.withEmpty ? e.target.selectedIndex - 1 : e.target.selectedIndex 
                    if (props.onChange) props.onChange(index, items[index])
                }}>
                {options}
            </select >
        </>
    );
}

