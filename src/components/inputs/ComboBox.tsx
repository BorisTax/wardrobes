import { ReactNode } from "react"

export type ComboBoxProps<T> = {
    onChange?: (value: T, index: number) => void
    items: T[]
    value?: T
    altValue?: string
    displayValue: (value: T) => string | undefined
    withEmpty?: boolean
    emptyValue?: any
    title?: string
    disabled?: boolean
    disableTyping?: boolean
    size?: number
    styles?: object
}

export default function ComboBox<T>(props: ComboBoxProps<T> = { items: [], disabled: false, title: "", size: 1, styles: {}, displayValue: () => "", emptyValue: "" }) {
    const items: T[] = props.items instanceof Map ? [...props.items.values()] : props.items
    let value: T = items.find(i => i === props.value) as T
    const options: ReactNode[] = []
    if (props.withEmpty) options.push(<option key={-1}>{""}</option>)
        items?.forEach((i, index) =>
            options.push(
                <option key={index}>
                {props.displayValue(i) || ""}
            </option>))
    if (props.altValue) options.push(<option key={-2} hidden>{props.altValue}</option>)
    return (
        <>
            {props.title ? <span className="text-end" style={{ ...props.styles }}>{props.title}</span> : <></>}
            <select size={!props.size ? 1 : props.size}
                value={props.altValue || props.displayValue(value) || ""}
                style={{ ...props.styles }}
                disabled={props.disabled}
                onClick={(e) => { e.stopPropagation() }}
                onChange={(e) => {
                    const index = props.withEmpty ? e.target.selectedIndex - 1 : e.target.selectedIndex 
                    if (props.onChange) props.onChange(items[index], index)
                }}
                onKeyDown={e => {
                    if (props.disableTyping) {
                        e.preventDefault()
                        return false
                    }
                }}
                >
                
                {options}
            </select >
        </>
    );
}

