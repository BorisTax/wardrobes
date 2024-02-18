import { useEffect, useMemo, useRef, useState } from "react"
import { useAtom, useSetAtom } from "jotai"
import { editProfileDialogAtom } from "../atoms/dialogs"
import { Profiles, ProfilesCaptions } from "../functions/materials"
import ComboBox from "./ComboBox"
import { Profile, ProfileType } from "../types/materials"
import useMessage from "../custom-hooks/useMessage"
import useConfirm from "../custom-hooks/useConfirm"
import Button from "./Button"
import { addProfileAtom, deleteProfileAtom, profileListAtom, updateProfileAtom } from "../atoms/profiles"
import { rusMessages } from "../functions/messages"
import messages from "../server/messages"

type DialogProps = {
    dialogRef: React.RefObject<HTMLDialogElement>
}

export default function EditProfileDialog(props: DialogProps) {
    const [profileList] = useAtom(profileListAtom)
    const [{ name: profileName, type, code }, setState] = useState({ ...profileList[0] })
    useMemo(() => { setState({ ...profileList[0] }) }, [profileList])
    const closeDialog = () => { props.dialogRef.current?.close() }
    const [, setProfileDialogRef] = useAtom(editProfileDialogAtom)
    const deleteProfile = useSetAtom(deleteProfileAtom)
    const addProfile = useSetAtom(addProfileAtom)
    const updateProfile = useSetAtom(updateProfileAtom)
    const [{ newName, newCode }, setNewValues] = useState({ newName: profileName, newCode: code })
    useMemo(() => { setNewValues({ newName: profileName, newCode: code }) }, [profileName, code, type])
    const [{ nameChecked, codeChecked }, setChecked] = useState({ nameChecked: false, codeChecked: false })
    const nameRef = useRef<HTMLInputElement>(null)
    const codeRef = useRef<HTMLInputElement>(null)
    const showMessage = useMessage()
    const showConfirm = useConfirm()
    const profiles = profileList.filter((p: Profile) => p.type === type).map((p: Profile) => p.name)
    useEffect(() => {
        setProfileDialogRef(props.dialogRef)
    }, [setProfileDialogRef, props.dialogRef])
    return <dialog ref={props.dialogRef}>
        <div className="d-flex flex-nowrap gap-2 align-items-start">
            <div>
                <div className="property-grid">
                    <ComboBox title="Тип: " value={ProfilesCaptions.get(type) || ""} items={Profiles} onChange={(_, value: string) => { const p = profileList.find((p: Profile) => p.type === value) as Profile; setState({ type: value as ProfileType, name: p.name, code: p.code }); }} />
                    <ComboBox title="Цвет: " value={profileName} items={profiles} onChange={(_, value: string) => { const p = profileList.find((p: Profile) => p.name === value) as Profile; setState((prev) => ({ ...prev, name: value, code: p.code })) }} />
                </div>
            </div>
        </div>
        <hr />
        <div className="editmaterial-container">
            <hr />
            <div className="property-grid">
                <span className="text-end text-nowrap">Наименование:</span>
                <div className="d-flex justify-content-start gap-2">
                    <input type="checkbox" checked={nameChecked} onChange={() => { setChecked(prev => ({ ...prev, nameChecked: !nameChecked })) }} />
                    <input type="text" ref={nameRef} value={newName} onChange={(e) => { setNewValues(prev => ({ ...prev, newName: e.target.value })) }} />
                </div>
                <span className="text-end text-nowrap">Код:</span>
                <div className="d-flex justify-content-start gap-2">
                    <input type="checkbox" checked={codeChecked} onChange={() => { setChecked(prev => ({ ...prev, codeChecked: !codeChecked })) }} />
                    <input type="text" ref={codeRef} value={newCode} onChange={(e) => { setNewValues(prev => ({ ...prev, newCode: e.target.value })) }} />
                </div>
            </div>
            <div className="editmaterial-buttons-container">
                <input type="button" value="Удалить" onClick={() => {
                    const name = profileName
                    const index = profileList.findIndex((p: Profile) => p.type === type && p.name === name)

                    const message = `Удалить профиль: "${profileList[index].name}" ?`
                    showConfirm(message, () => {
                        deleteProfile(profileList[index], (result) => {
                            showMessage(rusMessages[result.message])
                        });
                        setState((prev) => ({ ...prev, extMaterialIndex: 0 }))
                    })
                }} />
                <Button caption="Добавить" disabled={!(nameChecked && codeChecked)} onClick={() => {
                    const name = newName
                    const code = newCode
                    if (!checkFields({ newName, newCode }, showMessage)) return
                    if (profileList.find((p: Profile) => p.name === name && p.type === type)) { showMessage(rusMessages[messages.PROFILE_EXIST]); return }
                    const message = getAddMessage({ type: ProfilesCaptions.get(type) || "", name: newName, code: newCode })
                    showConfirm(message, () => {
                        addProfile({ name, type, code }, (result) => {
                            showMessage(rusMessages[result.message])
                        });
                    })
                }} />
                <input type="button" value="Заменить" disabled={!(nameChecked || codeChecked)} onClick={() => {
                    const name = profileName
                    if (!checkFields({ nameChecked, codeChecked, newName, newCode }, showMessage)) return
                    const message = getMessage({ nameChecked, codeChecked, name, code, newName, newCode })
                    showConfirm(message, () => {
                        const usedName = nameChecked ? newName : ""
                        const usedCode = codeChecked ? newCode : ""
                        updateProfile({ name, type, newName: usedName, newCode: usedCode }, (result) => {
                            showMessage(rusMessages[result.message])
                        })
                    })
                }} />
            </div>
        </div>
        <hr />
        <div className="d-flex flex-column gap-1 align-items-start">
            <input type="button" value="Закрыть" onClick={() => closeDialog()} />
        </div>
    </dialog>
}

function checkFields({ nameChecked = true, codeChecked = true, newName, newCode }: { nameChecked?: boolean, codeChecked?: boolean, newName: string, newCode: string }, showMessage: (message: string) => void) {
    if (nameChecked && newName.trim() === "") {
        showMessage("Введите наименование")
        return false
    }
    if (codeChecked && newCode.trim() === "") {
        showMessage("Введите код")
        return false
    }
    return true
}

function getMessage({ nameChecked, codeChecked, name, code, newName, newCode }: { nameChecked: boolean, codeChecked: boolean, name: string, code: string, newName: string, newCode: string }): string {
    const changeName = nameChecked ? `профлль: "${name}"` : ""
    const changeCode = codeChecked ? `код:"${code}"` : ""
    const changeName2 = nameChecked ? `"${newName}"` : ""
    const changeCode2 = codeChecked ? `код:"${newCode}"` : ""
    const sub2 = nameChecked || codeChecked ? "на" : ""
    const message = `Заменить ${changeName} ${changeCode} ${sub2} ${changeName2} ${changeCode2}?`
    return message
}

function getAddMessage({ type, name, code }: { type: string, name: string, code: string }): string {
    const message = `Добавить профиль (Тип: ${type}) - ${name}, код: ${code} ?`
    return message
}