import { Fragment, useEffect, useRef, useState } from "react"
import useMessage from "../../custom-hooks/useMessage"
import { InputType, PropertyType } from "../../types/property"
import TextBox from "../TextBox"
import ComboBox from "../ComboBox"
import useConfirm from "../../custom-hooks/useConfirm"
import { rusMessages } from "../../functions/messages"
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
    onUpdate?: (checked: boolean[], values: string[]) => Promise<{ success: boolean, message: string }>
    onAdd?: (checked: boolean[], values: string[]) => Promise<{ success: boolean, message: string }>
    onDelete?: (name: string | number) => Promise<{ success: boolean, message: string }>
}
export default function EditDataSection(props: EditDataSectionProps) {
    const [loading, setLoading] = useState(false)
    const [checked, setChecked] = useState(props.items.map(i => false))
    const [newValues, setNewValues] = useState(props.items.map(i => i.value))
    const [extValue, setExtValue] = useState("")
    const showMessage = useMessage()
    const showConfirm = useConfirm()
    const imageRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        setNewValues(props.items.map(i => i.value))
        setExtValue("")
        setChecked(prev => prev.map(p => false))
    }, [props.items])
    return <>
        <div className="editmaterial-container">
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
                    const check = checkFields({ checked, items: props.items, newValues })
                    if (!check.success) { showMessage(check.message); return }
                    const message = getAddMessage({ checked, items: props.items, newValues })
                    showConfirm(message, async () => {
                        if (!props.onAdd) return
                        setLoading(true)
                        const result = await props.onAdd(checked, newValues)
                        setLoading(false)
                        showMessage(rusMessages[result.message])
                    })
                }} />}
                {props.onUpdate && < input type="button" value="Обновить" disabled={!(checked.some(c => c))} onClick={() => {
                    const check = checkFields({ checked, items: props.items, newValues })
                    if (!check.success) { showMessage(check.message); return }
                    const message = getMessage({ checked, items: props.items, newValues, extValue })
                    showConfirm(message, async () => {
                        if (!props.onUpdate) return
                        setLoading(true)
                        const result = await props.onUpdate(checked, newValues)
                        setLoading(false)
                        showMessage(rusMessages[result.message])
                    })
                }} />}
                {props.onDelete && <input type="button" value="Удалить" onClick={() => {
                    const message = getDeleteMessage(props.name as string)
                    showConfirm(message, async () => {
                        if (!props.onDelete) return
                        setLoading(true)
                        const result = await props.onDelete(props.name as string)
                        setLoading(false)
                        showMessage(rusMessages[result.message])
                    })
                }} />}
            </div>
        </div>
        {loading && <div className="spinner-container" onClick={(e) => { e.stopPropagation() }}><div className="spinner"></div></div>}
    </>
}

function checkFields({ checked, items, newValues }: { checked: boolean[], items: EditDataItem[], newValues: string[] }): { success: boolean, message: string } {
    let message = ""
    const success = checked.every((c, index) => {
        if (c === false) return true
        if (newValues[index].trim() === "") {
            message = items[index].message
            return false
        }
        return true
    })
    return {success, message}
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
