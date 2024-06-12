import { useMemo, useRef, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import ComboBox from "../../ComboBox"
import { Trempel } from "../../../types/materials"
import useMessage from "../../../custom-hooks/useMessage"
import useConfirm from "../../../custom-hooks/useConfirm"
import Button from "../../Button"
import { addTrempelAtom, deleteTrempelAtom, trempelListAtom, updateTrempelAtom } from "../../../atoms/materials/trempel"
import { rusMessages } from "../../../functions/messages"
import messages from "../../../server/messages"
import { EditDialogProps } from "../EditMaterialDialog"

export default function EditTrempel(props: EditDialogProps) {
    const trempelList = useAtomValue(trempelListAtom)
    const [{ name: trempelName, code }, setState] = useState({ ...trempelList[0] })
    useMemo(() => { setState({ ...trempelList[0] }) }, [trempelList])
    const deleteTrempel = useSetAtom(deleteTrempelAtom)
    const addTrempel = useSetAtom(addTrempelAtom)
    const updateTrempel = useSetAtom(updateTrempelAtom)
    const [{ newName, newCode }, setNewValues] = useState({ newName: trempelName || "", newCode: code || "" })
    useMemo(() => { setNewValues({ newName: trempelName || "", newCode: code || ""}) }, [trempelName, code])
    const [{ nameChecked, codeChecked }, setChecked] = useState({ nameChecked: false, codeChecked: false })
    const nameRef = useRef<HTMLInputElement>(null)
    const codeRef = useRef<HTMLInputElement>(null)
    const showMessage = useMessage()
    const showConfirm = useConfirm()
    const trempeles = useMemo(() => trempelList.map((p: Trempel) => p.name).toSorted(), [trempelList])
    return <>
        <div className="d-flex flex-nowrap gap-2 align-items-start">
            <div>
                <div className="table-grid">
                    <ComboBox title="Тремпель: " value={trempelName} items={trempeles} onChange={(_, value: string) => { const p = trempelList.find((p: Trempel) => p.name === value) as Trempel; setState((prev) => ({ ...prev, name: value, code: p.code })) }} />
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
            </div>
            <div className="editmaterial-buttons-container">
                <input type="button" value="Заменить" disabled={!(nameChecked || codeChecked )} onClick={() => {
                    const name = trempelName
                    if (!checkFields({ nameChecked, codeChecked, newName, newCode }, showMessage)) return
                    const message = getMessage({ nameChecked, codeChecked, name, code, newName, newCode })
                    showConfirm(message, () => {
                        props.setLoading(true)
                        const usedName = nameChecked ? newName : ""
                        const usedCode = codeChecked ? newCode : ""
                        updateTrempel({ name, newName: usedName, code: usedCode }, (result) => {
                            props.setLoading(false)
                            showMessage(rusMessages[result.message])
                        })
                    })
                }} />
            </div>
        </div>
    </>
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
    const changeName = nameChecked ? `щетку: "${name}"` : ""
    const changeCode = codeChecked ? `код:"${code}"` : ""
    const changeName2 = nameChecked ? `"${newName}"` : ""
    const changeCode2 = codeChecked ? `код:"${newCode}"` : ""
    const sub2 = nameChecked || codeChecked ? "на" : ""
    const message = `Заменить ${changeName} ${changeCode} ${sub2} ${changeName2} ${changeCode2}?`
    return message
}

function getAddMessage({ name, code }: { name: string, code: string }): string {
    const message = `Добавить щетку - ${name}, код: ${code} ?`
    return message
}