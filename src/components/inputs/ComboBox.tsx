export type ComboBoxProps = {
    onChange?: (index: number, value: string) => void
    items: number[] | string[] | Map<string, string>
    value: string
    title?: string
    disabled?: boolean
    size?: number
    styles?: object
}

export default function ComboBox(props: ComboBoxProps = { value: "", items: [], disabled: false, title: "", size: 1, styles: {} }) {
    const items: number[] | string[] = props.items instanceof Map ? [...props.items.values()] : props.items
    let value = props.items instanceof Map ? props.items.get(props.value) || "" : props.value || ""
    if (props.items instanceof Map) {
        const key = [...props.items].find(i => i[1] === props.value)
        if (key) value = key[0]
    }
    const itemsWithNull = value === "" ? ["", ...items] : items
    const options = itemsWithNull?.map((i, index) => <option key={index}>{i}</option>)
    return (
        <>
            {props.title ? <span className="text-end text-nowrap" style={{ ...props.styles }}>{props.title}</span> : <></>}
            <select size={!props.size ? 1 : props.size}
                value={value}
                style={{ ...props.styles }}
                disabled={props.disabled}
                onClick={(e) => { e.stopPropagation() }}
                onChange={(e) => {
                    const index = items.findIndex(i => i === e.target.value) || 0
                    const value = props.items instanceof Map ? ([...(props.items as Map<string, string>).entries()].find(entry => entry[1] === e.target.value) || ["", ""])[0] : e.target.value 
                    if (props.onChange) props.onChange(index, value)
                }}>
                {options}
            </select >

        </>
    );
}

