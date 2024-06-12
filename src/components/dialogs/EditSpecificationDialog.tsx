import { useEffect, useMemo, useRef, useState } from "react"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { editSpecificationDialogAtom } from "../../atoms/dialogs"
import useMessage from "../../custom-hooks/useMessage"
import useConfirm from "../../custom-hooks/useConfirm"
import { rusMessages } from "../../functions/messages"
import { updatePriceListAtom } from "../../atoms/prices"
import { SpecificationData } from "../../types/server"
import { UnitCaptions } from "../../functions/materials"
import { PropertyType } from "../../types/property"
import DialogWindow from "./DialogWindow"
import TextBox from "../TextBox"
import { loadSpecificationListAtom, specificationDataAtom } from "../../atoms/specification"

export default function EditSpecificationDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const [loading, setLoading] = useState(false)
    const loadSpecList = useSetAtom(loadSpecificationListAtom)
    const specList = useAtomValue(specificationDataAtom)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const def = { name: "", caption: "", coef: 1, price: "", code: "", id: "", markup: "" }
    const { name, caption, coef, code, id } = (specList && specList[selectedIndex]) ? ({ ...(specList[selectedIndex] || def)}) : def
    const [, setDialogRef] = useAtom(editSpecificationDialogAtom)
    const updatePriceList = useSetAtom(updatePriceListAtom)
    const [{ newCaption, newCoef, newCode, newId }, setNewValues] = useState({ newCaption: caption || "", newCoef: `${coef}`, newCode: code || "", newId: id || "" })
    useMemo(() => { setNewValues({ newCaption: caption || "", newCoef: `${coef}`, newCode: code || "", newId: id || "" }) }, [selectedIndex, specList])
    const [{ captionChecked, priceChecked, coefChecked, codeChecked, idChecked, markupChecked }, setChecked] = useState({ captionChecked: false, coefChecked: false, priceChecked: false, codeChecked: false, idChecked: false, markupChecked: false })
    const showMessage = useMessage()
    const showConfirm = useConfirm()
    const contents = specList?.map((i: SpecificationData, index) => <tr key={index} onClick={() => setSelectedIndex(index)}>
                <td className="pricelist-cell">{i.caption}</td>
                <td className="pricelist-cell">{UnitCaptions.get(i.units || "")}</td>
                <td className="pricelist-cell">{i.coef}</td>
                <td className="pricelist-cell">{i.code || ""}</td>
                <td className="pricelist-cell">{i.id || ""}</td>
            </tr>)
    useEffect(() => {
        loadSpecList()
        setDialogRef(dialogRef)
    }, [setDialogRef, dialogRef])
    return <DialogWindow dialogRef={dialogRef} title="Редактор спецификации">
        <div className="overflow-scroll">
            <div className="pricelist">
                <table>
                    <thead>
                        <tr>
                            <th className="priceheader">Наименование</th>
                            <th className="priceheader">Ед</th>
                            <th className="priceheader">Коэф-т</th>
                            <th className="priceheader">Код</th>
                            <th className="priceheader">Идентификатор</th>
                        </tr>
                    </thead>
                    <tbody>{contents}</tbody>
                </table>
            </div>
            <div className="editmaterial-container">
                <hr />
                <div className="property-grid">
                    <span className="text-end text-nowrap">Наименование:</span>
                    <div className="d-flex justify-content-start gap-2">
                        <input type="checkbox" checked={captionChecked} onChange={() => { setChecked(prev => ({ ...prev, captionChecked: !captionChecked })) }} />
                        <input type="text" value={newCaption} disabled={!captionChecked} onChange={(e) => { setNewValues(prev => ({ ...prev, newCaption: e.target.value })) }} />
                    </div>
                    <span className="text-end text-nowrap">Коэф-т:</span>
                    <div className="d-flex justify-content-start gap-2">
                        <input type="checkbox" checked={coefChecked} onChange={() => { setChecked(prev => ({ ...prev, coefChecked: !coefChecked })) }} />
                        <TextBox value={`${newCoef}`} disabled={!coefChecked} type={PropertyType.POSITIVE_NUMBER} setValue={(value) => { setNewValues(prev => ({ ...prev, newCoef: `${value}` })) }} />
                    </div>
                    <span className="text-end text-nowrap">Код:</span>
                    <div className="d-flex justify-content-start gap-2">
                        <input type="checkbox" checked={codeChecked} onChange={() => { setChecked(prev => ({ ...prev, codeChecked: !codeChecked })) }} />
                        <input type="text" value={newCode} disabled={!codeChecked} onChange={(e) => { setNewValues(prev => ({ ...prev, newCode: e.target.value })) }} />
                    </div>
                    <span className="text-end text-nowrap">Идентификатор:</span>
                    <div className="d-flex justify-content-start gap-2">
                        <input type="checkbox" checked={idChecked} onChange={() => { setChecked(prev => ({ ...prev, idChecked: !idChecked })) }} />
                        <input type="text" value={newId} disabled={!idChecked} onChange={(e) => { setNewValues(prev => ({ ...prev, newId: e.target.value })) }} />
                    </div>
                </div>
                <div className="editmaterial-buttons-container">
                    <input type="button" value="Обновить" disabled={!(captionChecked || coefChecked || codeChecked || idChecked)} onClick={() => {
                        if (!checkFields({ captionChecked, coefChecked, codeChecked, idChecked, newCaption, newCoef, newCode, newId }, showMessage)) return
                        const message = getMessage({ captionChecked, coefChecked, codeChecked, idChecked, caption: caption || "", newCaption, newCoef, newCode, newId })
                        const data: SpecificationData = { name }
                        if (codeChecked) data.code = newCode
                        if (idChecked) data.id = newId
                        if (coefChecked) data.coef = +newCoef
                        if (captionChecked) data.caption = newCaption
                        showConfirm(message, () => {
                            setLoading(true)
                            updatePriceList(data, (result) => {
                                setLoading(false)
                                showMessage(rusMessages[result.message])
                            })
                        })
                    }} />
                </div>
            </div>
        </div>
        {loading && <div className="spinner-container" onClick={(e) => { e.stopPropagation() }}><div className="spinner"></div></div>}
    </DialogWindow>
}

function checkFields({ captionChecked = true, coefChecked = true, codeChecked = true, idChecked = true, newCaption = "", newCoef = "", newCode = "", newId = "" }: { captionChecked: boolean, coefChecked: boolean, codeChecked: boolean, idChecked: boolean, newCaption: string, newCoef: string, newCode: string, newId: string }, showMessage: (message: string) => void) {
    if (captionChecked && newCaption.trim() === "") {
        showMessage("Введите наименование")
        return false
    }
    if (coefChecked && newCoef.trim() === "") {
        showMessage("Введите корректный коэф-т")
        return false
    }

    if (codeChecked && newCode.trim() === "") {
        showMessage("Введите код")
        return false
    }
    if (idChecked && newId.trim() === "") {
        showMessage("Введите идентификатор")
        return false
    }
    return true
}

function getMessage({ captionChecked, coefChecked, codeChecked, idChecked, caption, newCaption, newCoef, newCode, newId }: { captionChecked: boolean, coefChecked: boolean, codeChecked: boolean, idChecked: boolean, caption: string, newCaption: string, newCoef: string, newCode: string, newId: string }): string {
    const changeCaption = captionChecked ? `наименование: "${newCaption}"` : ""
    const changeCoef = coefChecked ? `коэф-т:"${newCoef}"` : ""
    const changeCode = codeChecked ? `код:"${newCode}"` : ""
    const changeId = idChecked ? `идентификатор:"${newId}"` : ""
    const message = `Обновить в материале ${caption}: ${changeCaption} ${changeCoef} ${changeCode} ${changeId}?`
    return message
}

