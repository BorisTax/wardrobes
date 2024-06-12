import { Fragment, useEffect, useState } from "react"
import useMessage from "../../custom-hooks/useMessage"
import { PropertyType } from "../../types/property"
import TextBox from "../TextBox"
import ComboBox from "../ComboBox"
export type EditDataItem = {
    caption: string
    value: string
    list?: string[]
    message: string
    readonly?: boolean
    type?: PropertyType
}
export type EditDataSectionProps = {
    items: EditDataItem[]
    name?: string
    onUpdate?: (checked: boolean[], values: string[], message: string) => void
    onAdd?: (checked: boolean[], values: string[], message: string) => void
    onDelete?: (name: string | number) => void
}
export default function EditDataSection(props: EditDataSectionProps) {
    const [checked, setChecked] = useState(props.items.map(i => false))
    const [newValues, setNewValues] = useState(props.items.map(i => i.value))
    const showMessage = useMessage()
    useEffect(() => {
        setNewValues(props.items.map(i => i.value))
        setChecked(prev => prev.map(p => false))
    }, [props.items])
    return <div className="editmaterial-container">
        <hr />
        <div className="table-grid">
            {props.items.map((i, index) => <Fragment key={i.caption}><span className="text-end text-nowrap">{i.caption}</span>
                <div className="d-flex justify-content-start gap-2">
                    {i.readonly ? <div></div> : <input type="checkbox" checked={checked[index]} onChange={() => { setChecked(prev => { const p = [...prev]; p[index] = !p[index]; return p }) }} />}
                    {i.readonly ? <div>{i.value}</div> :
                        i.list ? <ComboBox value={newValues[index]} items={i.list} disabled={!checked[index]} onChange={(_, value) => { setNewValues(prev => { prev[index] = value as string; return [...prev] }) }} />
                            :
                            <TextBox value={newValues[index]} disabled={!checked[index]} type={i.type || PropertyType.STRING} setValue={(value) => { setNewValues(prev => { prev[index] = value as string; return [...prev] }) }} />}
                </div>
            </Fragment>
            )}
        </div>
        <div className="editmaterial-buttons-container">
            {props.onAdd && < input type="button" value="Добавить" disabled={!(checked.every(c => c))} onClick={() => {
                if (!checkFields({ checked, items: props.items, newValues }, showMessage)) return
                const message = getAddMessage({ checked, items: props.items, newValues })
                if (props.onAdd) props.onAdd(checked, newValues, message)
            }} />}
            {props.onUpdate && < input type="button" value="Обновить" disabled={!(checked.some(c => c))} onClick={() => {
                if (!checkFields({ checked, items: props.items, newValues }, showMessage)) return
                const message = getMessage({ checked, items: props.items, newValues })
                if (props.onUpdate) props.onUpdate(checked, newValues, message)
            }} />}
            {props.onDelete && <input type="button" value="Удалить" onClick={() => {
                if (props.onDelete) props.onDelete(props.name as string)
            }} />}
        </div>
    </div>
}

function checkFields({ checked, items, newValues }: { checked: boolean[], items: EditDataItem[], newValues: string[] }, showMessage: (message: string) => void) {
    checked.forEach((c, index) => {
        if (c && newValues[index].trim() === "") {
            showMessage(items[index].message)
            return false
        }
    })
    return true
}

function getMessage({ checked, items, newValues }: { checked: boolean[], items: EditDataItem[], newValues: string[] }): string {
    const msg: string[] = []
    checked.forEach((c, index) => {
        if (c) msg.push(`${items[index].caption} "${newValues[index]}"`)
    })
    return `Обновить - ${msg.join(' ')} ?`
}

function getAddMessage({ checked, items, newValues }: { checked: boolean[], items: EditDataItem[], newValues: string[] }): string {
    const msg: string[] = []
    checked.forEach((c, index) => {
        if (c) msg.push(`${items[index].caption} "${newValues[index]}"`)
    })
    return `Добавить - ${msg.join(', ')} ?`
}

