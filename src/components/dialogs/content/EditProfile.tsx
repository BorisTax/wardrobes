import { useMemo, useRef, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { Profiles } from "../../../functions/materials"
import ComboBox from "../../ComboBox"
import { Profile, ProfileType } from "../../../types/materials"
import useMessage from "../../../custom-hooks/useMessage"
import useConfirm from "../../../custom-hooks/useConfirm"
import Button from "../../Button"
import { addProfileAtom, deleteProfileAtom, profileListAtom, updateProfileAtom } from "../../../atoms/materials/profiles"
import { rusMessages } from "../../../functions/messages"
import messages from "../../../server/messages"
import { EditDialogProps } from "../EditMaterialDialog"
import { brushListAtom } from "../../../atoms/materials/brush"

export default function EditProfile(props: EditDialogProps) {
    const profileList = useAtomValue(profileListAtom)
    const [{ name: profileName, type, code, brush }, setState] = useState({ ...profileList[0] })
    const bList = useAtomValue(brushListAtom)
    const brushList = useMemo(() => bList.map(b => b.name).toSorted(), bList)
    //const brushList = [...new Set(profileList.map((p: Profile) => p.brush))].toSorted()
    useMemo(() => { setState({ ...profileList[0] }) }, [profileList])
    const deleteProfile = useSetAtom(deleteProfileAtom)
    const addProfile = useSetAtom(addProfileAtom)
    const updateProfile = useSetAtom(updateProfileAtom)
    const [{ newName, newCode, newBrush }, setNewValues] = useState({ newName: profileName || "", newCode: code || "", newBrush: brush || "" })
    useMemo(() => { setNewValues({ newName: profileName || "", newCode: code || "", newBrush: brush || "" }) }, [profileName, code, type, brush])
    const [{ nameChecked, codeChecked, brushChecked }, setChecked] = useState({ nameChecked: false, codeChecked: false, brushChecked: false })
    const nameRef = useRef<HTMLInputElement>(null)
    const codeRef = useRef<HTMLInputElement>(null)
    const showMessage = useMessage()
    const showConfirm = useConfirm()
    const profiles = useMemo(() => profileList.filter((p: Profile) => p.type === type).map((p: Profile) => p.name), [profileList])
    return <>
        <div className="d-flex flex-nowrap gap-2 align-items-start">
            <div>
                <div className="table-grid">
                    <ComboBox title="Тип: " value={type || ""} items={Profiles} onChange={(_, value: string) => { const p = profileList.find((p: Profile) => p.type === value) as Profile; if(p) setState({ type: value as ProfileType, name: p.name, code: p.code, brush: p.brush }); }} />
                    <ComboBox title="Цвет: " value={profileName} items={profiles} onChange={(_, value: string) => { const p = profileList.find((p: Profile) => p.name === value) as Profile; if(p) setState((prev) => ({ ...prev, name: value, code: p.code, brush: p.brush })) }} />
                </div>
            </div>
        </div>
        <hr />
        <div className="editmaterial-container">
            <hr />
            <div className="table-grid">
                <span className="text-end text-nowrap">Наименование:</span>
                <div className="d-flex justify-content-start gap-2">
                    <input type="checkbox" checked={nameChecked} onChange={() => { setChecked(prev => ({ ...prev, nameChecked: !nameChecked })) }} />
                    <input type="text" ref={nameRef} value={newName} onChange={(e) => { setNewValues(prev => ({ ...prev, newName: e.target.value })) }} disabled={!nameChecked}/>
                </div>
                <span className="text-end text-nowrap">Код:</span>
                <div className="d-flex justify-content-start gap-2">
                    <input type="checkbox" checked={codeChecked} onChange={() => { setChecked(prev => ({ ...prev, codeChecked: !codeChecked })) }} />
                    <input type="text" ref={codeRef} value={newCode} onChange={(e) => { setNewValues(prev => ({ ...prev, newCode: e.target.value })) }} disabled={!codeChecked}/>
                </div>
                <span className="text-end text-nowrap">Щетка:</span>
                <div className="d-flex justify-content-start gap-2">
                    <input type="checkbox" checked={brushChecked} onChange={() => { setChecked(prev => ({ ...prev, brushChecked: !brushChecked })) }} />
                    <ComboBox value={newBrush} items={brushList} onChange={(_, value: string) => { setNewValues(prev => ({ ...prev, newBrush: value })) }} disabled={!brushChecked}/>
                </div>
            </div>
            <div className="editmaterial-buttons-container">
                <input type="button" value="Удалить" onClick={() => {
                    const name = profileName
                    const index = profileList.findIndex((p: Profile) => p.type === type && p.name === name)

                    const message = `Удалить профиль: "${profileList[index].name}" ?`
                    showConfirm(message, () => {
                        props.setLoading(true)
                        deleteProfile(profileList[index], (result) => {
                            props.setLoading(false)
                            showMessage(rusMessages[result.message])
                        });
                        setState((prev) => ({ ...prev, extMaterialIndex: 0 }))
                    })
                }} />
                <Button caption="Добавить" disabled={!(nameChecked && codeChecked && brushChecked)} onClick={() => {
                    const name = newName
                    const code = newCode
                    const brush = newBrush
                    if (!checkFields({ newName, newCode, newBrush }, showMessage)) return
                    if (profileList.find((p: Profile) => p.name === name && p.type === type)) { showMessage(rusMessages[messages.PROFILE_EXIST]); return }
                    const message = getAddMessage({ type: Profiles.get(type) || "", name: newName, code: newCode, brush: newBrush })
                    showConfirm(message, () => {
                        props.setLoading(true)
                        addProfile({ name, type, code, brush }, (result) => {
                            props.setLoading(false)
                            showMessage(rusMessages[result.message])
                        });
                    })
                }} />
                <input type="button" value="Заменить" disabled={!(nameChecked || codeChecked || brushChecked)} onClick={() => {
                    const name = profileName
                    if (!checkFields({ nameChecked, codeChecked, brushChecked, newName, newCode, newBrush }, showMessage)) return
                    const message = getMessage({ nameChecked, codeChecked, brushChecked, name, code, brush, newName, newCode, newBrush })
                    showConfirm(message, () => {
                        props.setLoading(true)
                        const usedName = nameChecked ? newName : ""
                        const usedCode = codeChecked ? newCode : ""
                        const usedBrush = brushChecked ? newBrush : ""
                        updateProfile({ name, type, newName: usedName, newCode: usedCode, newBrush: usedBrush }, (result) => {
                            props.setLoading(false)
                            showMessage(rusMessages[result.message])
                        })
                    })
                }} />
            </div>
        </div>
    </>
}

function checkFields({ nameChecked = true, codeChecked = true, brushChecked = true, newName, newCode, newBrush }: { nameChecked?: boolean, codeChecked?: boolean, brushChecked?: boolean, newName: string, newCode: string, newBrush: string }, showMessage: (message: string) => void) {
    if (nameChecked && newName.trim() === "") {
        showMessage("Введите наименование")
        return false
    }
    if (codeChecked && newCode.trim() === "") {
        showMessage("Введите код")
        return false
    }
    if (brushChecked && newBrush.trim() === "") {
        showMessage("Выберите щетку")
        return false
    }
    return true
}

function getMessage({ nameChecked, codeChecked, brushChecked, name, code, brush, newName, newCode, newBrush }: { nameChecked: boolean, codeChecked: boolean, brushChecked: boolean, name: string, code: string, brush: string, newName: string, newCode: string, newBrush: string }): string {
    const changeName = nameChecked ? `профиль: "${name}"` : ""
    const changeCode = codeChecked ? `код:"${code}"` : ""
    const changeBrush = brushChecked ? `щетка:"${brush}"` : ""
    const changeName2 = nameChecked ? `"${newName}"` : ""
    const changeCode2 = codeChecked ? `код:"${newCode}"` : ""
    const changeBrush2 = brushChecked ? `щетка:"${newBrush}"` : ""
    const sub2 = nameChecked || codeChecked ? "на" : ""
    const message = `Заменить ${changeName} ${changeCode} ${changeBrush} ${sub2} ${changeName2} ${changeCode2} ${changeBrush2}?`
    return message
}

function getAddMessage({ type, name, code, brush }: { type: string, name: string, code: string, brush: string }): string {
    const message = `Добавить профиль (Тип: ${type}) - ${name}, код: ${code}, щетка: ${brush} ?`
    return message
}