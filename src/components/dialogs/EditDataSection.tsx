import { Fragment, useEffect, useRef, useState } from "react"
import useMessage from "../../custom-hooks/useMessage"
import { InputType, PropertyType } from "../../types/property"
import TextBox from "../inputs/TextBox"
import ComboBox from "../inputs/ComboBox"
import useConfirm from "../../custom-hooks/useConfirm"
import { rusMessages } from "../../functions/messages"
import CheckBox from "../inputs/CheckBox"
import { MAX_FILE_SIZE } from "../../options"
export type ValueType = string | boolean | number
export type EditDataItem = {
    title: string
    value: ValueType
    displayValue?: (value: ValueType) => string
    message?: string
    readonly?: boolean
    optional?: boolean
    nullValue?: ValueType
    propertyType?: PropertyType
    checkValue?: (value: ValueType) => { success: boolean, message: string }
    onChange?: (value: ValueType) => void
    styles?: object,
} & ({
    inputType: InputType.LIST
    list: ValueType[]
    listWithEmptyRow?: boolean
} | {
    inputType: Exclude<InputType, InputType.LIST>
})

type UpdateAction = (values: (ValueType)[]) => Promise<{ success: boolean, message: string }>
type AddAction = (values: (ValueType)[]) => Promise<{ success: boolean, message: string }>
type DeleteAction = (name: ValueType, values?: ValueType[]) => Promise<{ success: boolean, message: string }>
type ActionProp = {
    disabled?: boolean
    caption?: string,
    question?: (values: ValueType[]) => string
}

type UpdateActionProp = (ActionProp & { onAction: UpdateAction }) | UpdateAction
type AddActionProp = (ActionProp & { onAction: AddAction }) | AddAction
type DeleteActionProp = (ActionProp & { onAction: DeleteAction }) | DeleteAction

export type EditDataSectionProps = {
    items: EditDataItem[]
    name?: string | number
    dontAsk?: boolean
    dontUseCheckBoxes?: boolean 
    onUpdate?: UpdateActionProp
    onAdd?: AddActionProp
    onDelete?: DeleteActionProp
}
export default function EditDataSection(props: EditDataSectionProps) {
    const [loading, setLoading] = useState(false)
    const [newValues, setNewValues] = useState(props.items.map(i => i.value))
    const [extValue, setExtValue] = useState("")
    const showMessage = useMessage()
    const showConfirm = useConfirm(true)
    const imageRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        setNewValues(props.items.map(i => i.value))
        setExtValue("")
    }, [...props.items.map(i => i.value)])
    return <>
        <div className="editmaterial-container">
            <div className="edit-section-grid">
                {props.items.map((i, index) => <Fragment key={i.title}><span className="text-end text-nowrap">{i.title}</span>
                    {i.inputType === InputType.CHECKBOX && <CheckBox caption={i.displayValue && i.displayValue(newValues[index])} checked={newValues[index] as boolean} disabled={i.readonly} onChange={() => { setNewValues(prev => { const p = [...prev]; p[index] = !p[index]; i.onChange && i.onChange(prev[index]); return [...p] }) }} styles={i.styles} />}
                    {i.inputType === InputType.TEXT && <TextBox value={newValues[index] as string} disabled={i.readonly} type={i.propertyType || PropertyType.STRING} setValue={(value) => { setNewValues(prev => { const p = [...prev]; p[index] = value;; i.onChange && i.onChange(p[index]); return [...p] }) }} submitOnLostFocus={true} nullValue={i.nullValue} styles={i.styles} />}
                    {(i.inputType === InputType.LIST) && <ComboBox<ValueType> value={newValues[index] as ValueType} items={i.list as ValueType[]} displayValue={value => i.displayValue ? i.displayValue(value) : `${value}`} disabled={i.readonly} withEmpty={i.listWithEmptyRow} onChange={value => { setNewValues(prev => { const p = [...prev]; p[index] = value as string; return [...p] }); i.onChange && i.onChange(value) }}  styles={i.styles} />}
                    {i.inputType === InputType.FILE && <div>
                        <input style={{ display: "none" }} disabled={i.readonly} type="file" ref={imageRef} accept="image/jpg, image/png, image/jpeg" src={newValues[index] as string} onChange={(e) => {
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
                {props.onAdd && < input type="button" disabled={(props.onAdd as ActionProp).disabled} value={(props.onAdd as ActionProp)?.caption || "Добавить"} onClick={async () => {
                    if (!props.onAdd) return
                    const values = props.items.map((p, i) => p.displayValue ? p.displayValue(newValues[i]) : newValues[i])
                    const check = checkFields({ items: props.items, newValues })
                    if (!check.success) { showMessage(rusMessages[check.message] || check.message); return }
                    const question = (props.onAdd as ActionProp).question && ((props.onAdd as ActionProp).question as Function)(values)
                    const message = question || getAddMessage({ items: props.items, newValues: values })
                    const conf = props.dontAsk || await showConfirm(message)
                    if (!conf) return
                    setLoading(true)
                    const onAdd = typeof props.onAdd === 'function' ? props.onAdd : props.onAdd.onAction
                    const result = await onAdd(newValues)
                    setLoading(false)
                    if (!result.success) showMessage(rusMessages[result.message])
                }} />}
                {props.onUpdate && < input type="button" disabled={(props.onUpdate as ActionProp).disabled}  value={(props.onUpdate as ActionProp)?.caption ||"Обновить"} onClick={ async () => {
                    if (!props.onUpdate) return
                    const values = props.items.map((p, i) => p.displayValue ? p.displayValue(newValues[i]) : newValues[i])
                    const check = checkFields({ items: props.items, newValues })
                    if (!check.success) { showMessage(rusMessages[check.message] || check.message); return }
                    const question = (props.onUpdate as ActionProp).question && ((props.onUpdate as ActionProp).question as Function)(values)
                    const message = question || getMessage({ items: props.items, newValues: values, extValue })
                    const conf = props.dontAsk || await showConfirm(message)
                    if (!conf) return
                    setLoading(true)
                    const onUpdate = typeof props.onUpdate === 'function' ? props.onUpdate : props.onUpdate.onAction
                    const result = await onUpdate(newValues)
                    setLoading(false)
                    if (!result.success) showMessage(rusMessages[result.message])
                }} />}
                {props.onDelete && <input type="button" disabled={(props.onDelete as ActionProp).disabled} value={(props.onDelete as ActionProp)?.caption ||"Удалить"} onClick={async () => {
                    if (!props.onDelete) return
                    const values = props.items.map((p, i) => p.displayValue ? p.displayValue(newValues[i]) : newValues[i])
                    const question = (props.onDelete as ActionProp).question && ((props.onDelete as ActionProp).question as Function)(values)
                    const message = question || getDeleteMessage(props.name as string)
                    const conf = props.dontAsk || await showConfirm(message)
                    if (!conf) return
                    setLoading(true)
                    const onDelete = typeof props.onDelete === 'function' ? props.onDelete : props.onDelete.onAction
                    const result = await onDelete(props.name as string, newValues)
                    setLoading(false)
                    if (result.message) showMessage(rusMessages[result.message])
                }} />}


            </div>
        {loading && <div className="spinner-container" onClick={(e) => { e.stopPropagation() }}><div className="spinner"></div></div>}
        </div>
    </>
}

function checkFields({ items, newValues }: { items: EditDataItem[], newValues: ValueType[] }): { success: boolean, message: string } {
    let message = ""
    const success = items.every((item, index) => {
        const newValue = newValues[index]
        if (item.checkValue) {
            const result = item.checkValue(newValue)
            if (!result.success) {
                message = result.message
                return false
            }
        }
        if (item.optional) return true;
        if (typeof newValue === 'string' && newValue.trim() === "" && !item.optional) {
            message = item.message || ""
            return false
        }
        return true
    })
    return {success, message}
}

function getMessage({ items, newValues, extValue }: {items: EditDataItem[], newValues: ValueType[], extValue?: string }): string {
    const msg: string[] = []
    items.forEach((item, index) => {
        if (item) msg.push(`${item.title} "${extValue || newValues[index]}"`)
    })
    return `Обновить:\n${msg.join('\n')}`
}

function getAddMessage({ items, newValues }: { items: EditDataItem[], newValues: ValueType[] }): string {
    const msg: string[] = []
    items.forEach((item, index) => {
        if (item) msg.push(`${item.title} "${newValues[index]}"`)
    })
    return `Добавить:\n${msg.join('\n')}`
}

function getDeleteMessage(name: string): string {
    return `Удалить:\n${name} ?`
}
