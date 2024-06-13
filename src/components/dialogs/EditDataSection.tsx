import { Fragment, useEffect, useRef, useState } from "react"
import useMessage from "../../custom-hooks/useMessage"
import { InputType, PropertyType } from "../../types/property"
import TextBox from "../TextBox"
import ComboBox from "../ComboBox"
export type EditDataItem = {
    caption: string
    value: string
    list?: string[] | Map<string, string>
    message: string
    readonly?: boolean
    type: InputType
    propertyType?: PropertyType
}
export type EditDataSectionProps = {
    items: EditDataItem[]
    name?: string
    onUpdate?: (checked: boolean[], values: string[], message: string) => void
    onAdd?: (checked: boolean[], values: string[], message: string) => void
    onDelete?: (name: string | number, message: string) => void
}
export default function EditDataSection(props: EditDataSectionProps) {
    const [checked, setChecked] = useState(props.items.map(i => false))
    const [newValues, setNewValues] = useState(props.items.map(i => i.value))
    const [extValue, setExtValue] = useState("")
    const showMessage = useMessage()
    const imageRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        setNewValues(props.items.map(i => i.value))
        setExtValue("")
        setChecked(prev => prev.map(p => false))
    }, [props.items])
    return <div className="editmaterial-container">
        <hr />
        <div className="edit-section-grid">
            {props.items.map((i, index) => <Fragment key={i.caption}><span className="text-end text-nowrap">{i.caption}</span>
                    {i.readonly ? <div></div> : <input type="checkbox" checked={checked[index]} onChange={() => { setChecked(prev => { const p = [...prev]; p[index] = !p[index]; return p }) }} />}
                    {i.type === InputType.TEXT && <TextBox value={newValues[index]} disabled={!checked[index]} type={i.propertyType || PropertyType.STRING} setValue={(value) => { setNewValues(prev => { const p = [...prev]; p[index] = value as string; return [...p] }) }} />}
                    {i.list && <ComboBox value={newValues[index]} items={i.list} disabled={!checked[index] || i.readonly} onChange={(_, value) => { setNewValues(prev => { const p = [...prev]; p[index] = value as string; return [...p] }) }} />}
                    {i.type === InputType.FILE && <div>
                        <input style={{ display: "none" }} disabled={!checked[index] || i.readonly} type="file" ref={imageRef} accept="image/jpg, image/png, image/jpeg" src={newValues[index]} onChange={(e) => {
                            const file = e.target.files && e.target.files[0]
                            let reader = new FileReader();
                            reader.onload = function () {
                                setNewValues(prev => { const p = [...prev]; p[index] = reader?.result as string || ""; return [...p] })
                                setExtValue(file?.name || "")
                            }
                            reader.readAsDataURL(file as Blob);
                        }}
                        />
                        <input style={{ width: "200px", height: "200px", border: "1px solid black" }} name="image" type="image" alt="Нет изображения" src={newValues[index]} onClick={() => imageRef.current?.click()} />
                    </div>}
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
                const message = getMessage({ checked, items: props.items, newValues, extValue })
                if (props.onUpdate) props.onUpdate(checked, newValues, message)
            }} />}
            {props.onDelete && <input type="button" value="Удалить" onClick={() => {
                if (props.onDelete) props.onDelete(props.name as string, getDeleteMessage(props.name as string))
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

function getMessage({ checked, items, newValues, extValue }: { checked: boolean[], items: EditDataItem[], newValues: string[], extValue?: string }): string {
    const msg: string[] = []
    checked.forEach((c, index) => {
        if (c) msg.push(`${items[index].caption} "${extValue || newValues[index]}"`)
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

function getDeleteMessage(name: string): string {
    return `Удалить - ${name} ?`
}
