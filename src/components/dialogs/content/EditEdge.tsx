import { useMemo, useRef, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import ComboBox from "../../ComboBox"
import { Edge, ExtMaterial } from "../../../types/materials"
import useMessage from "../../../custom-hooks/useMessage"
import useConfirm from "../../../custom-hooks/useConfirm"
import Button from "../../Button"
import { addEdgeAtom, deleteEdgeAtom, edgeListAtom, updateEdgeAtom } from "../../../atoms/materials/edges"
import { rusMessages } from "../../../functions/messages"
import messages from "../../../server/messages"
import { materialListAtom } from "../../../atoms/materials/materials"
import { FasadMaterial } from "../../../types/enums"
import { EditDialogProps } from "../EditMaterialDialog"

export default function EditEdge(props: EditDialogProps) {
    const edgeList = useAtomValue(edgeListAtom)
    const materialList = useAtomValue(materialListAtom)
    const mList = useMemo(() => materialList.filter(mat => mat.material === FasadMaterial.DSP).map((m: ExtMaterial) => m.name), [materialList])
    const [{ name: edgeName, dsp, code }, setState] = useState({ ...edgeList[0] })
    useMemo(() => { setState({ ...edgeList[0] }) }, [edgeList])
    const deleteEdge = useSetAtom(deleteEdgeAtom)
    const addEdge = useSetAtom(addEdgeAtom)
    const updateEdge = useSetAtom(updateEdgeAtom)
    const [{ newName, newCode, newDSP }, setNewValues] = useState({ newName: edgeName || "", newCode: code || "", newDSP: dsp || "" })
    useMemo(() => { setNewValues({ newName: edgeName || "", newCode: code || "", newDSP: dsp || "" }) }, [edgeName, code, dsp])
    const [{ nameChecked, codeChecked, dspChecked }, setChecked] = useState({ nameChecked: false, codeChecked: false, dspChecked: false })
    const nameRef = useRef<HTMLInputElement>(null)
    const codeRef = useRef<HTMLInputElement>(null)
    const showMessage = useMessage()
    const showConfirm = useConfirm()
    const edges = useMemo(() => edgeList.map((p: Edge) => p.name).toSorted(), [edgeList])
    return <>
        <div className="d-flex flex-nowrap gap-2 align-items-start">
            <div>
                <div className="property-grid">
                    <ComboBox title="Кромка: " value={edgeName} items={edges} onChange={(_, value: string) => { const p = edgeList.find((p: Edge) => p.name === value) as Edge; setState((prev) => ({ ...prev, name: value, code: p.code, dsp: p.dsp })) }} />
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
                    <input type="text" ref={nameRef} value={newName} onChange={(e) => { setNewValues(prev => ({ ...prev, newName: e.target.value })) }} disabled={!nameChecked}/>
                </div>
                <span className="text-end text-nowrap">Код:</span>
                <div className="d-flex justify-content-start gap-2">
                    <input type="checkbox" checked={codeChecked} onChange={() => { setChecked(prev => ({ ...prev, codeChecked: !codeChecked })) }} />
                    <input type="text" ref={codeRef} value={newCode} onChange={(e) => { setNewValues(prev => ({ ...prev, newCode: e.target.value })) }} disabled={!codeChecked}/>
                </div>
                <span className="text-end text-nowrap">Соответствие с ДСП:</span>
                <div className="d-flex justify-content-start gap-2">
                    <input type="checkbox" checked={dspChecked} onChange={() => { setChecked(prev => ({ ...prev, dspChecked: !dspChecked })) }} />
                    <ComboBox value={newDSP} items={mList} onChange={(_, value: string) => { setNewValues(prev => ({ ...prev, newDSP: value })) }} disabled={!dspChecked}/>
                </div>
            </div>
            <div className="editmaterial-buttons-container">
                <input type="button" value="Удалить" onClick={() => {
                    const name = edgeName
                    const index = edgeList.findIndex((p: Edge) => p.name === name)
                    const message = `Удалить кромку: "${edgeList[index].name}" ?`
                    showConfirm(message, () => {
                        props.setLoading(true)
                        deleteEdge(edgeList[index], (result) => {
                            props.setLoading(false)
                            showMessage(rusMessages[result.message])
                        });
                        setState((prev) => ({ ...prev, extMaterialIndex: 0 }))
                    })
                }} />
                <Button caption="Добавить" disabled={!(nameChecked && codeChecked && dspChecked)} onClick={() => {
                    const name = newName
                    const code = newCode
                    const dsp = newDSP
                    if (!checkFields({ newName, newCode, newDSP }, showMessage)) return
                    if (edgeList.find((p: Edge) => p.name === name)) { showMessage(rusMessages[messages.EDGE_EXIST]); return }
                    const message = getAddMessage({ name: newName, code: newCode, dsp: newDSP })
                    showConfirm(message, () => {
                        props.setLoading(true)
                        addEdge({ name, dsp, code }, (result) => {
                            props.setLoading(false)
                            showMessage(rusMessages[result.message])
                        });
                    })
                }} />
                <input type="button" value="Заменить" disabled={!(nameChecked || codeChecked || dspChecked)} onClick={() => {
                    const name = edgeName
                    if (!checkFields({ nameChecked, codeChecked, dspChecked, newName, newCode, newDSP }, showMessage)) return
                    const message = getMessage({ nameChecked, codeChecked, dspChecked, name, code, dsp, newName, newCode, newDSP })
                    showConfirm(message, () => {
                        props.setLoading(true)
                        const usedName = nameChecked ? newName : ""
                        const usedCode = codeChecked ? newCode : ""
                        const usedDSP = dspChecked ? newDSP : ""
                        updateEdge({ name, newName: usedName, code: usedCode, dsp: usedDSP }, (result) => {
                            props.setLoading(false)
                            showMessage(rusMessages[result.message])
                        })
                    })
                }} />
            </div>
        </div>
    </>
}

function checkFields({ nameChecked = true, codeChecked = true, dspChecked = true, newName, newCode, newDSP }: { nameChecked?: boolean, codeChecked?: boolean, dspChecked?: boolean, newName: string, newCode: string, newDSP: string }, showMessage: (message: string) => void) {
    if (nameChecked && newName.trim() === "") {
        showMessage("Введите наименование")
        return false
    }
    if (codeChecked && newCode.trim() === "") {
        showMessage("Введите код")
        return false
    }
    if (dspChecked && newDSP.trim() === "") {
        showMessage("Выберите цвет ДСП")
        return false
    }
    return true
}

function getMessage({ nameChecked, codeChecked, dspChecked, name, code, dsp, newName, newCode, newDSP }: { nameChecked: boolean, codeChecked: boolean, dspChecked: boolean, name: string, code: string, dsp: string, newName: string, newCode: string, newDSP: string }): string {
    const changeName = nameChecked ? `кромку: "${name}"` : ""
    const changeCode = codeChecked ? `код:"${code}"` : ""
    const changeDSP = dspChecked ? `ДСП:"${dsp}"` : ""
    const changeName2 = nameChecked ? `"${newName}"` : ""
    const changeCode2 = codeChecked ? `код:"${newCode}"` : ""
    const changeDSP2 = dspChecked ? `ДСП:"${newDSP}"` : ""
    const sub2 = nameChecked || codeChecked ? "на" : ""
    const message = `Заменить ${changeName} ${changeCode} ${changeDSP} ${sub2} ${changeName2} ${changeCode2} ${changeDSP2}?`
    return message
}

function getAddMessage({ name, code, dsp }: { name: string, code: string, dsp: string }): string {
    const message = `Добавить кромку - ${name}, код: ${code}, ДСП: ${dsp} ?`
    return message
}