import { ReactNode } from "react"
import "./selector.scss"

export type SelectorProps<T> = {
    onChange?: (value: T, index: number) => void
    items: T[]
    value?: T
    displayValue: (value: T) => string | undefined
    title?: string
    disabled?: boolean
    size?: number
    styles?: object
}
const styleActive = {
    backgroundColor: "green",
}
const styleInActive = {
    backgroundColor: "gray",
}

export default function Selector<T>(props: SelectorProps<T> = { items: [], disabled: false, title: "", size: 1, styles: {}, displayValue: () => "" }) {
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
            {props.title ? <span className="text-end text-nowrap" style={{ ...props.styles }}>{props.title}</span> : <></>}
            <div
                style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0.2em" }}
                onClick={(e) => { e.stopPropagation() }}
            >
                {options}
            </div>

        </>
    );
}

