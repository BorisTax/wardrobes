import { ReactNode } from "react"
import "./selector.scss"

export type SelectorProps<T> = {
    onChange?: (value: T, index: number) => void
    items: T[]
    value?: T
    displayValue: (value: T) => string | undefined | ReactNode
    title?: string
    disabled?: boolean
    size?: number
    columns?: number
}

export default function Selector<T>(props: SelectorProps<T> = { items: [], disabled: false, title: "", size: 1, displayValue: () => "" }) {
    const items: T[] = props.items instanceof Map ? [...props.items.values()] : props.items
    let valueIndex: T = items.findIndex(i => i === props.value) as T
    const options: ReactNode[] = items?.map((i, index) => {
        const className = `selector-button ${valueIndex === index ? "selector-button-active" : "selector-button-inactive"}`
        return <div key={index}
            className={className}
            role="button"
            onClick={() => { if (props.onChange) props.onChange(props.items[index], index) }}>
            {props.displayValue(i) || ""}
        </div>
    }
    )
    return (
        <>
            {props.title ? <span className="text-end">{props.title}</span> : <></>}
                <div    
                    style={{gridTemplateColumns: `repeat(${props.columns || items.length}, 1fr)`}}
                    className="selector-button-container"
                    onClick={(e) => { e.stopPropagation() }}
                >
                    {options}
                </div>
        </>
    );
}

