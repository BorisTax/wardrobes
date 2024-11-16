import { Fragment, useEffect, useRef, useState } from "react"
import useMessage from "../../custom-hooks/useMessage"
import { InputType, PropertyType } from "../../types/property"
import TextBox from "../inputs/TextBox"
import ComboBox from "../inputs/ComboBox"
import useConfirm from "../../custom-hooks/useConfirm"
import { rusMessages } from "../../functions/messages"
import CheckBox from "../inputs/CheckBox"
import { MAX_FILE_SIZE } from "../../options"
type ValueType = string | boolean | number
export type EditDataItem = {
    caption: string
    value: ValueType
    valueCaption?: (value: ValueType) => string
    list?: ValueType[]
    listWithEmptyRow?: boolean
    message?: string
    readonly?: boolean
    type: InputType
    optional?: boolean
    propertyType?: PropertyType
    checkValue?: (value: ValueType) => { success: boolean, message: string }
    onChange?: (value: ValueType) => void
}
export type EditDataSectionProps = {
    items: EditDataItem[]
    name?: string
    dontAsk?: boolean
    onUpdate?: (checked: boolean[], values: (ValueType)[]) => Promise<{ success: boolean, message: string }>
    onAdd?: (checked: boolean[], values: (ValueType)[]) => Promise<{ success: boolean, message: string }>
    onDelete?: (name: ValueType) => Promise<{ success: boolean, message: string }>
}
export default function EditDataSection(props: EditDataSectionProps) {
    const [loading, setLoading] = useState(false)
    const [checked, setChecked] = useState(props.items.map(() => false))
    const [newValues, setNewValues] = useState(props.items.map(i => i.value))
    const [extValue, setExtValue] = useState("")
    const showMessage = useMessage()
    const showConfirm = useConfirm()
    const imageRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        setNewValues(props.items.map(i => i.value))
        setExtValue("")
        setChecked(() => props.items.map(p => !!p.readonly))
    }, [...props.items.map(i => i.value)])
    return <>
        <div className="editmaterial-container">
            <div className="edit-section-grid">
                {props.items.map((i, index) => <Fragment key={i.caption}><span className="text-end text-nowrap">{i.caption}</span>
                    {i.readonly || (!props.onUpdate && !props.onAdd) ? <div></div> : <input type="checkbox" checked={checked[index]} onChange={() => { setChecked(prev => { const p = [...prev]; p[index] = !p[index]; return p }) }} />}
                    {i.type === InputType.TEXT && <TextBox value={newValues[index] as string} disabled={!checked[index] || i.readonly} type={i.propertyType || PropertyType.STRING} setValue={(value) => { setNewValues(prev => { const p = [...prev]; p[index] = value;; i.onChange && i.onChange(p[index]); return [...p] }) }} submitOnLostFocus={true} />}
                    {i.type === InputType.CHECKBOX && <CheckBox caption={i.valueCaption && i.valueCaption(newValues[index])} checked={newValues[index] as boolean} disabled={!checked[index] || i.readonly} onChange={() => { setNewValues(prev => { const p = [...prev]; p[index] = !p[index]; i.onChange && i.onChange(prev[index]); return [...p] }) }} />}
                    {(i.list && i.type === InputType.LIST) && <ComboBox<ValueType> value={newValues[index] as ValueType} items={i.list as ValueType[]} displayValue={value => i.valueCaption ? i.valueCaption(value) : ""} disabled={!checked[index] || i.readonly} withEmpty={i.listWithEmptyRow} onChange={value => { setNewValues(prev => { const p = [...prev]; p[index] = value as string; return [...p] }); i.onChange && i.onChange(value) }} />}
                    {i.type === InputType.FILE && <div>
                        <input style={{ display: "none" }} disabled={!checked[index] || i.readonly} type="file" ref={imageRef} accept="image/jpg, image/png, image/jpeg" src={newValues[index] as string} onChange={(e) => {
                            const file = e.target.files && e.target.files[0]
                            if (file && file.size > MAX_FILE_SIZE) { showMessage("Файл слишком большой (макс. 2МБ)"); return }
                            const reader = new FileReader();
                            reader.onload = function () {
                                setNewValues(prev => { const p = [...prev]; p[index] = reader?.result as string || ""; return [...p] })
                                setExtValue(file?.name || "")
                            }
                            reader.readAsDataURL(file as Blob);
                        }}
                        />
                        <input style={{ width: "200px", height: "200px", border: "1px solid black" }} name="image" type="image" alt="Нет изображения" src={newValues[index] as string} onClick={() => imageRef.current?.click()} />
                    </div>}
                </Fragment>
                )}
            </div>
            <div className="editmaterial-buttons-container">
                {props.onAdd && < input type="button" value="Добавить" disabled={!(checked.every((c, index) => c || props.items[index].readonly))} onClick={async () => {
                    if (!props.onAdd) return
                    const values = props.items.map((p, i) => p.valueCaption ? p.valueCaption(newValues[i]) : newValues[i])
                    const check = checkFields({ checked, items: props.items, newValues: values })
                    if (!check.success) { showMessage(rusMessages[check.message]); return }
                    const message = getAddMessage({ checked, items: props.items, newValues: values })
                    const conf = props.dontAsk || await showConfirm(message)
                    if (!conf) return
                    setLoading(true)
                    const result = await props.onAdd(checked, newValues)
                    setLoading(false)
                    if (result.message) showMessage(rusMessages[result.message])
                }} />}
                {props.onUpdate && < input type="button" value="Обновить" disabled={!(checked.some((c, index) => c && !props.items[index].readonly))} onClick={ async () => {
                    if (!props.onUpdate) return
                    const values = props.items.map((p, i) => p.valueCaption ? p.valueCaption(newValues[i]) : newValues[i])
                    const check = checkFields({ checked, items: props.items, newValues: values })
                    if (!check.success) { showMessage(rusMessages[check.message]); return }
                    const message = getMessage({ checked, items: props.items, newValues: values, extValue })
                    const conf = props.dontAsk || await showConfirm(message)
                    if (!conf) return
                    setLoading(true)
                    const result = await props.onUpdate(checked, newValues)
                    setLoading(false)
                    if (result.message) showMessage(rusMessages[result.message])
                }} />}
                {props.onDelete && <input type="button" value="Удалить" onClick={async () => {
                    if (!props.onDelete) return
                    const message = getDeleteMessage(props.name as string)
                    const conf = props.dontAsk || await showConfirm(message)
                    if (!conf) return
                    setLoading(true)
                    const result = await props.onDelete(props.name as string)
                    setLoading(false)
                    if (result.message) showMessage(rusMessages[result.message])
                }} />}
                {(props.onAdd || props.onUpdate) && <>
                    < input type="button" value="Выделить все" onClick={() => {
                        setChecked(checked.map(c => true))
                    }} />
                    < input type="button" value="Снять выделение" onClick={() => {
                        setChecked(checked.map(c => false))
                    }} />
                </>
                }
            </div>
        {loading && <div className="spinner-container" onClick={(e) => { e.stopPropagation() }}><div className="spinner"></div></div>}
        </div>
    </>
}

function checkFields({ checked, items, newValues }: { checked: boolean[], items: EditDataItem[], newValues: ValueType[] }): { success: boolean, message: string } {
    let message = ""
    const success = checked.every((c, index) => {
        if (c === false) return true
        const item = items[index]
        const newValue = newValues[index]
        if (item.checkValue) {
            const result = item.checkValue(newValue)
            if (!result.success) {
                message = result.message
                return false
            }
        }
        if (typeof newValue === 'string' && newValue.trim() === "" && !item.optional) {
            message = item.message || ""
            return false
        }
        return true
    })
    return {success, message}
}

function getMessage({ checked, items, newValues, extValue }: { checked: boolean[], items: EditDataItem[], newValues: ValueType[], extValue?: string }): string {
    const msg: string[] = []
    checked.forEach((c, index) => {
        if (c) msg.push(`${items[index].caption} "${extValue || newValues[index]}"`)
    })
    return `Обновить - ${msg.join(' ')} ?`
}

function getAddMessage({ checked, items, newValues }: { checked: boolean[], items: EditDataItem[], newValues: ValueType[] }): string {
    const msg: string[] = []
    checked.forEach((c, index) => {
        if (c) msg.push(`${items[index].caption} "${newValues[index]}"`)
    })
    return `Добавить - ${msg.join(', ')} ?`
}

function getDeleteMessage(name: string): string {
    return `Удалить - ${name} ?`
}
