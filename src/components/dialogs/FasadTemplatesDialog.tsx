import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { templatesDialogAtom, templatesDialogPropsAtom } from "../../atoms/dialogs"
import useMessage from "../../custom-hooks/useMessage"
import useConfirm from "../../custom-hooks/useConfirm"
import Button from "../Button"
import { rusMessages } from "../../functions/messages"
import DialogWindow from "./DialogWindow"
import { addFasadTemplateAtom, applyTemplateAtom, deleteTemplateAtom, templateListAtom, templateTableAtom, updateFasadTemplateAtom } from "../../atoms/templates"
import { TEMPLATE_TABLES } from "../../types/enums"
import FasadState from "../../classes/FasadState"
import { Template } from "../../types/templates"
import FasadPreviewContainer from "../fasad/FasadPreviewContainer"
import Fasad from "../../classes/Fasad"
import { newFasadFromState } from "../../functions/fasades"
import { isEditorAtLeast } from "../../server/functions/user"
import { userAtom } from "../../atoms/users"

export default function FasadTemplatesDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const [, setTemplateDialogRef] = useAtom(templatesDialogAtom)
    const templatePreviewContainerRef = useRef<HTMLDivElement>(null)
    const templateListRef = useRef<HTMLDivElement>(null)
    const editMode = useAtomValue(templatesDialogPropsAtom)
    const templates = useAtomValue(templateListAtom)
    const [curTemplate, setTemplate] = useState(templates[0])
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
    }, [curTemplate])
    const nameRef = useRef<HTMLInputElement>(null)
    const showMessage = useMessage()
    const showConfirm = useConfirm()
    useLayoutEffect(() => {
        if(!templatePreviewContainerRef.current) return
        const height = getComputedStyle(templatePreviewContainerRef.current).height
        if (templateListRef.current) templateListRef.current.style.maxHeight = height
    }, [curTemplate])
    useEffect(() => {
        setTemplateDialogRef(dialogRef)
    }, [setTemplateDialogRef, dialogRef])
    return <DialogWindow dialogRef={dialogRef}>
        <div className="d-flex gap-1">
            <div className="d-flex flex-column align-self-stretch">
                <div className="text-center">Шаблоны</div>
                <div ref={templateListRef} className="template-list">
                    {templates.map((t: Template) => 
                    <div key={t.name} className={curTemplate && (t.name === curTemplate.name) ? "template-item template-item-selected" : "template-item"} onClick={() => { setTemplate(t) }}>{t.name}</div>)}
                </div>
            </div>
            <div className="d-flex flex-column align-items-center">
                <div>Предпросмотр</div>
                {fasad && <FasadPreviewContainer refObject={templatePreviewContainerRef} fasad={fasad} />}
            </div>
        </div>
        <hr />
        {editor && editMode ? <div className="d-flex flex-column gap-1">
            <div className="d-flex gap-1 align-items-baseline">
                <span className="text-end text-nowrap">Название шаблона:</span>
                <input type="text" ref={nameRef} value={newName} onChange={(e) => { setNewName(e.target.value) }} />
            </div>
            <div className="d-flex gap-1">
                <input type="button" value="Удалить" disabled={!curTemplate} onClick={() => {
                    const message = `Удалить шаблон: "${newName}" ?`
                    showConfirm(message, () => {
                        deleteTemplate({ name: newName, table: TEMPLATE_TABLES.FASAD }, (result) => {
                            showMessage(rusMessages[result.message])
                        });
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
                <input type="button" value="Переименовать" disabled={!curTemplate} onClick={() => {
                    const name = curTemplate.name
                    const message = `Переименовать шаблон "${name}" в "${newName}" ?`
                    showConfirm(message, () => {
                        updateTemplate({ name, newName, rename: true }, (result) => {
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
                        if(!result.success) return showMessage(rusMessages[result.message])
                        dialogRef.current?.close()
                    })
                })
            }} /></div>}
        </DialogWindow>        
}
