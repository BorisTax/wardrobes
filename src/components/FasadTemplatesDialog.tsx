import { useEffect, useMemo, useRef, useState } from "react"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { templatesDialogAtom, templatesDialogPropsAtom } from "../atoms/dialogs"
import useMessage from "../custom-hooks/useMessage"
import useConfirm from "../custom-hooks/useConfirm"
import Button from "./Button"
import { rusMessages } from "../functions/messages"
import DialogWindow from "./DialogWindow"
import { addFasadTemplateAtom, applyTemplateAtom, deleteTemplateAtom, templateListAtom, templateTableAtom, updateFasadTemplateAtom } from "../atoms/templates"
import { TEMPLATE_TABLES } from "../server/types/enums"
import FasadState from "../classes/FasadState"
import { Template } from "../server/types/templates"
import FasadPreviewContainer from "./FasadPreviewContainer"
import Fasad from "../classes/Fasad"
import { newFasadFromState } from "../functions/fasades"
import { isEditorAtLeast } from "../server/functions/user"
import { userAtom } from "../atoms/users"

export default function FasadTemplatesDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const [, setTemplateDialogRef] = useAtom(templatesDialogAtom)
    const editMode = useAtomValue(templatesDialogPropsAtom)
    const templates = useAtomValue(templateListAtom)
    const [templateIndex, setTemplateIndex] = useState(0)
    const curTemplate = templates[templateIndex]
    const data: FasadState = curTemplate ? JSON.parse(curTemplate.data) : null
    const fasad: Fasad | null = data ? newFasadFromState(data) : null
    const [newName, setNewName] = useState((curTemplate && curTemplate.name) || "")
    const addTemplate = useSetAtom(addFasadTemplateAtom)
    const deleteTemplate = useSetAtom(deleteTemplateAtom)
    const updateTemplate = useSetAtom(updateFasadTemplateAtom)
    const applyTemplate = useSetAtom(applyTemplateAtom)
    const { role } = useAtomValue(userAtom)
    const editor = isEditorAtLeast(role)
    useMemo(() => {
        setNewName((curTemplate && curTemplate.name) || "")
    }, [templateIndex])
    const nameRef = useRef<HTMLInputElement>(null)
    const showMessage = useMessage()
    const showConfirm = useConfirm()
    useEffect(() => {
        setTemplateDialogRef(dialogRef)
    }, [setTemplateDialogRef, dialogRef])
    return <DialogWindow dialogRef={dialogRef}>
        <div className="d-flex">
            <div className="template-list">
                {templates.map((t: Template, index) => <div className={index === templateIndex ? "template-item-selected" : "template-item"} onClick={() => { setTemplateIndex(index) }}>{t.name}</div>)}
            </div>
            {fasad && <FasadPreviewContainer fasad={fasad} />}
        </div>
        <hr />
        {editor && editMode ? <div className="editmaterial-container">
            <hr />
            <div className="property-grid">
                <span className="text-end text-nowrap">Имя:</span>
                <input type="text" ref={nameRef} value={newName} onChange={(e) => { setNewName(e.target.value) }} />
            </div>
            <div className="editmaterial-buttons-container">
                <input type="button" value="Удалить" disabled={!curTemplate} onClick={() => {
                    const message = `Удалить шаблон: "${newName}" ?`
                    showConfirm(message, () => {
                        deleteTemplate({ name: newName, table: TEMPLATE_TABLES.FASAD }, (result) => {
                            showMessage(rusMessages[result.message])
                        });
                        setTemplateIndex(0)
                    })
                }} />
                <Button caption="Добавить" onClick={() => {
                    if (!newName.trim()) return showMessage("Введите имя шаблона")
                    const message = `Добавить шаблон: "${newName}" ?`
                    showConfirm(message, () => {
                        addTemplate(newName, (result) => {
                            showMessage(rusMessages[result.message])
                        });
                    })
                }} />
                <input type="button" value="Заменить" disabled={!curTemplate} onClick={() => {
                    const name = curTemplate.name
                    const message = `Заменить шаблон: "${newName}" ?`
                    showConfirm(message, () => {
                        updateTemplate({ name, newName }, (result) => {
                            showMessage(rusMessages[result.message])
                        })
                    })
                }} />
            </div>
        </div> : <div>
            <input type="button" value="Применить" disabled={!curTemplate} onClick={() => {
                const message = `Применить шаблон "${newName}" к выбранному фасаду?`
                showConfirm(message, () => {
                    applyTemplate(data, (result) => {
                        showMessage(rusMessages[result.message])
                    })
                })
            }} /></div>}
        </DialogWindow>        
}
