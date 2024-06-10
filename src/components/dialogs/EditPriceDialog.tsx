import { useEffect, useMemo, useRef, useState } from "react"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { editPriceDialogAtom } from "../../atoms/dialogs"
import useMessage from "../../custom-hooks/useMessage"
import useConfirm from "../../custom-hooks/useConfirm"
import { rusMessages } from "../../functions/messages"
import { loadPriceListAtom, priceListAtom, updatePriceListAtom } from "../../atoms/prices"
import { PriceListItem } from "../../types/server"
import { MATPurpose, UnitCaptions } from "../../functions/materials"
import { PropertyType } from "../../types/property"
import DialogWindow from "./DialogWindow"
import { MAT_PURPOSE } from "../../types/enums"
import TextBox from "../TextBox"

export default function EditPriceDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const [loading, setLoading] = useState(false)
    const [purpose, setPurpose] = useState(MAT_PURPOSE.FASAD)
    const loadPriceList = useSetAtom(loadPriceListAtom)
    const priceList = useAtomValue(priceListAtom)
    const filteredList = priceList.filter(p => p.purpose === purpose || p.purpose === MAT_PURPOSE.BOTH)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const def = { name: "", caption: "", coef: 1, price: "", code: "", id: "", markup: "" }
    const { name, caption, coef, price, code, id, markup } = (priceList && priceList[selectedIndex]) ? ({ ...(priceList.find(p => p.name === filteredList[selectedIndex].name) || def)}) : def
    const [, setPriceDialogRef] = useAtom(editPriceDialogAtom)
    const updatePriceList = useSetAtom(updatePriceListAtom)
    const [{ newCaption, newPrice, newCoef, newCode, newId, newMarkup }, setNewValues] = useState({ newCaption: caption || "", newCoef: `${coef}`, newPrice: `${price}`, newCode: code || "", newId: id || "", newMarkup: `${markup}` })
    useMemo(() => { setNewValues({ newCaption: caption || "", newCoef: `${coef}`, newPrice: `${price}`, newCode: code || "", newId: id || "", newMarkup: `${markup}` || "" }) }, [selectedIndex, priceList])
    const [{ captionChecked, priceChecked, coefChecked, codeChecked, idChecked, markupChecked }, setChecked] = useState({ captionChecked: false, coefChecked: false, priceChecked: false, codeChecked: false, idChecked: false, markupChecked: false })
    const showMessage = useMessage()
    const showConfirm = useConfirm()
    const className = "p-1 border"
    const active = `${className} fw-bold`
    const header = [MAT_PURPOSE.FASAD, MAT_PURPOSE.CORPUS].map(item => <div key={item} className={(purpose === item ? active : className)} onClick={() => { setPurpose(item) }} role="button">{MATPurpose.get(item)}</div>)
    const contents = filteredList?.map((i: PriceListItem, index) => <tr key={index} onClick={() => setSelectedIndex(index)}>
                <td className="pricelist-cell">{i.caption}</td>
                <td className="pricelist-cell">{UnitCaptions.get(i.units || "")}</td>
                <td className="pricelist-cell">{i.coef}</td>
                <td className="pricelist-cell">{i.price}</td>
                <td className="pricelist-cell">{i.markup}</td>
                <td className="pricelist-cell">{i.code || ""}</td>
                <td className="pricelist-cell">{i.id || ""}</td>
            </tr>)
    useEffect(() => {
        loadPriceList()
        setPriceDialogRef(dialogRef)
    }, [setPriceDialogRef, dialogRef])
    return <DialogWindow dialogRef={dialogRef} title="Редактор спецификации">
        <div className="d-flex">{header}</div>
        <div className="overflow-scroll">
            <div className="pricelist">
                <table>
                    <thead>
                        <tr>
                            <th className="priceheader">Наименование</th>
                            <th className="priceheader">Ед</th>
                            <th className="priceheader">Коэф-т</th>
                            <th className="priceheader">Цена</th>
                            <th className="priceheader">Наценка</th>
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
                    <span className="text-end text-nowrap">Цена:</span>
                    <div className="d-flex justify-content-start gap-2">
                        <input type="checkbox" checked={priceChecked} onChange={() => { setChecked(prev => ({ ...prev, priceChecked: !priceChecked })) }} />
                        <TextBox value={newPrice} disabled={!priceChecked} type={PropertyType.POSITIVE_NUMBER} setValue={(value) => { setNewValues(prev => ({ ...prev, newPrice: `${value}` })) }} />
                    </div>
                    <span className="text-end text-nowrap">Коэф-т:</span>
                    <div className="d-flex justify-content-start gap-2">
                        <input type="checkbox" checked={coefChecked} onChange={() => { setChecked(prev => ({ ...prev, coefChecked: !coefChecked })) }} />
                        <TextBox value={`${newCoef}`} disabled={!coefChecked} type={PropertyType.POSITIVE_NUMBER} setValue={(value) => { setNewValues(prev => ({ ...prev, newCoef: `${value}` })) }} />
                    </div>
                    <span className="text-end text-nowrap">Наценка:</span>
                    <div className="d-flex justify-content-start gap-2">
                        <input type="checkbox" checked={markupChecked} onChange={() => { setChecked(prev => ({ ...prev, markupChecked: !markupChecked })) }} />
                        <TextBox value={newMarkup} disabled={!markupChecked} type={PropertyType.POSITIVE_NUMBER} setValue={(value) => { setNewValues(prev => ({ ...prev, newMarkup: `${value}` })) }} />
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
                    <input type="button" value="Обновить" disabled={!(captionChecked || coefChecked || priceChecked || codeChecked || idChecked || markupChecked)} onClick={() => {
                        if (!checkFields({ captionChecked, priceChecked, coefChecked, codeChecked, idChecked, markupChecked, newCaption, newCoef, newPrice, newCode, newId, newMarkup }, showMessage)) return
                        const message = getMessage({ captionChecked, coefChecked, codeChecked, priceChecked, idChecked, markupChecked, caption: caption || "", newCaption, newCoef, newCode, newId, newPrice, newMarkup })
                        const data: PriceListItem = { name }
                        if (codeChecked) data.code = newCode
                        if (idChecked) data.id = newId
                        if (coefChecked) data.coef = +newCoef
                        if (priceChecked) data.price = +newPrice
                        if (markupChecked) data.markup = +newMarkup
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

function checkFields({ captionChecked = true, coefChecked = true, priceChecked = true, codeChecked = true, idChecked = true, markupChecked = true, newCaption = "", newCoef = "", newPrice = "", newCode = "", newId = "", newMarkup = "" }: { captionChecked: boolean, coefChecked: boolean, priceChecked: boolean, codeChecked: boolean, idChecked: boolean, markupChecked: boolean, newCaption: string, newCoef: string, newPrice: string, newCode: string, newId: string, newMarkup: string }, showMessage: (message: string) => void) {
    if (captionChecked && newCaption.trim() === "") {
        showMessage("Введите наименование")
        return false
    }
    if (coefChecked && newCoef.trim() === "") {
        showMessage("Введите корректный коэф-т")
        return false
    }
    if (priceChecked && newPrice.trim() === "") {
        showMessage("Введите корректную цену")
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
    if (markupChecked && newMarkup.trim() === "") {
        showMessage("Введите наценку")
        return false
    }
    return true
}

function getMessage({ captionChecked, priceChecked, coefChecked, codeChecked, idChecked, markupChecked, caption, newCaption, newCoef, newPrice, newCode, newId, newMarkup }: { captionChecked: boolean, coefChecked: boolean,  priceChecked: boolean, codeChecked: boolean, idChecked: boolean, markupChecked: boolean, caption: string, newCaption: string, newCoef: string, newPrice: string, newCode: string, newId: string, newMarkup: string }): string {
    const changeCaption = captionChecked ? `наименование: "${newCaption}"` : ""
    const changePrice = priceChecked ? `цена:"${newPrice}"` : ""
    const changeCoef = coefChecked ? `коэф-т:"${newCoef}"` : ""
    const changeMarkup = markupChecked ? `наценка:"${newMarkup}"` : ""
    const changeCode = codeChecked ? `код:"${newCode}"` : ""
    const changeId = idChecked ? `идентификатор:"${newId}"` : ""
    const message = `Обновить в материале ${caption}: ${changeCaption} ${changeCoef} ${changePrice}${changeMarkup} ${changeCode} ${changeId}?`
    return message
}

