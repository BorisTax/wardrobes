import { useEffect, useMemo, useRef, useState } from "react"
import { useAtom, useSetAtom } from "jotai"
import { editPriceDialogAtom } from "../atoms/dialogs"
import useMessage from "../custom-hooks/useMessage"
import useConfirm from "../custom-hooks/useConfirm"
import { rusMessages } from "../functions/messages"
import { loadPriceListAtom, priceListAtom, updatePriceListAtom } from "../atoms/prices"
import { PriceListItem } from "../types/server"
import { UnitCaptions } from "../functions/materials"
import InputField from "./InputField"
import { PropertyType } from "../types/property"
import ImageButton from "./ImageButton"


export default function EditPriceDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const loadPriceList = useSetAtom(loadPriceListAtom)
    const [priceList] = useAtom(priceListAtom)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const { name, caption, price, code, id, markup } = (priceList && priceList[selectedIndex]) ? { ...priceList[selectedIndex] } : { name: "", caption: "", price: "", code: "", id: "", markup: "" }
    const closeDialog = () => { dialogRef.current?.close() }
    const [, setPriceDialogRef] = useAtom(editPriceDialogAtom)
    const updatePriceList = useSetAtom(updatePriceListAtom)
    const [{ newCaption, newPrice, newCode, newId, newMarkup }, setNewValues] = useState({ newCaption: caption || "", newPrice: `${price}`, newCode: code || "", newId: id || "", newMarkup: `${markup}` })
    useMemo(() => { setNewValues({ newCaption: caption || "", newPrice: `${price}`, newCode: code || "", newId: id || "", newMarkup: `${markup}` || "" }) }, [selectedIndex, priceList])
    const [{ captionChecked, priceChecked, codeChecked, idChecked, markupChecked }, setChecked] = useState({ captionChecked: false, priceChecked: false, codeChecked: false, idChecked: false, markupChecked: false })
    const showMessage = useMessage()
    const showConfirm = useConfirm()
    const contents = priceList?.map((i: PriceListItem, index) => <tr key={index} onClick={() => setSelectedIndex(index)}>
        <td className="pricelist-cell">{i.caption}</td>
        <td className="pricelist-cell">{UnitCaptions.get(i.units || "")}</td>
        <td className="pricelist-cell">{i.price}</td>
        <td className="pricelist-cell">{i.markup}</td>
        <td className="pricelist-cell">{i.code || ""}</td>
        <td className="pricelist-cell">{i.id || ""}</td>
    </tr>)
    useEffect(() => {
        loadPriceList()
        setPriceDialogRef(dialogRef)
    }, [setPriceDialogRef, dialogRef])
    return <dialog ref={dialogRef}>
        <div className="dialog-header-bar">
            <div>
            </div>
            <ImageButton title="Закрыть" icon='close' onClick={() => closeDialog()} />
        </div>
        <hr />
        <div className="overflow-scroll">
            <div className="pricelist">
                <table>
                    <thead>
                        <tr>
                            <th className="priceheader">Наименование</th>
                            <th className="priceheader">Ед</th>
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
                        <input type="text" value={newCaption} onChange={(e) => { setNewValues(prev => ({ ...prev, newCaption: e.target.value })) }} />
                    </div>
                    <span className="text-end text-nowrap">Цена:</span>
                    <div className="d-flex justify-content-start gap-2">
                        <input type="checkbox" checked={priceChecked} onChange={() => { setChecked(prev => ({ ...prev, priceChecked: !priceChecked })) }} />
                        <InputField value={newPrice} type={PropertyType.POSITIVE_NUMBER} setValue={(value) => { setNewValues(prev => ({ ...prev, newPrice: `${value}` })) }} />
                    </div>
                    <span className="text-end text-nowrap">Наценка:</span>
                    <div className="d-flex justify-content-start gap-2">
                        <input type="checkbox" checked={markupChecked} onChange={() => { setChecked(prev => ({ ...prev, markupChecked: !markupChecked })) }} />
                        <InputField value={newMarkup} type={PropertyType.POSITIVE_NUMBER} setValue={(value) => { setNewValues(prev => ({ ...prev, newMarkup: `${value}` })) }} />
                    </div>
                    <span className="text-end text-nowrap">Код:</span>
                    <div className="d-flex justify-content-start gap-2">
                        <input type="checkbox" checked={codeChecked} onChange={() => { setChecked(prev => ({ ...prev, codeChecked: !codeChecked })) }} />
                        <input type="text" value={newCode} onChange={(e) => { setNewValues(prev => ({ ...prev, newCode: e.target.value })) }} />
                    </div>
                    <span className="text-end text-nowrap">Идентификатор:</span>
                    <div className="d-flex justify-content-start gap-2">
                        <input type="checkbox" checked={idChecked} onChange={() => { setChecked(prev => ({ ...prev, idChecked: !idChecked })) }} />
                        <input type="text" value={newId} onChange={(e) => { setNewValues(prev => ({ ...prev, newId: e.target.value })) }} />
                    </div>
                </div>
                <div className="editmaterial-buttons-container">
                    <input type="button" value="Обновить" disabled={!(captionChecked || priceChecked || codeChecked || idChecked || markupChecked)} onClick={() => {
                        if (!checkFields({ captionChecked, priceChecked, codeChecked, idChecked, markupChecked, newCaption, newPrice, newCode, newId, newMarkup }, showMessage)) return
                        const message = getMessage({ captionChecked, codeChecked, priceChecked, idChecked, markupChecked, caption: caption || "", newCaption, newCode, newId, newPrice, newMarkup })
                        const data: PriceListItem = { name }
                        if (codeChecked) data.code = newCode
                        if (idChecked) data.id = newId
                        if (priceChecked) data.price = +newPrice
                        if (markupChecked) data.markup = +newMarkup
                        if (captionChecked) data.caption = newCaption
                        showConfirm(message, () => {
                            updatePriceList(data, (result) => {
                                showMessage(rusMessages[result.message])
                            })
                        })
                    }} />
                </div>
            </div>
        </div>
    </dialog>
}

function checkFields({ captionChecked = true, priceChecked = true, codeChecked = true, idChecked = true, markupChecked = true, newCaption = "", newPrice = "", newCode = "", newId = "", newMarkup = "" }: { captionChecked: boolean, priceChecked: boolean, codeChecked: boolean, idChecked: boolean, markupChecked: boolean, newCaption: string, newPrice: string, newCode: string, newId: string, newMarkup: string }, showMessage: (message: string) => void) {
    if (captionChecked && newCaption.trim() === "") {
        showMessage("Введите наименование")
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

function getMessage({ captionChecked, priceChecked, codeChecked, idChecked, markupChecked, caption, newCaption, newPrice, newCode, newId, newMarkup }: { captionChecked: boolean, priceChecked: boolean, codeChecked: boolean, idChecked: boolean, markupChecked: boolean, caption: string, newCaption: string, newPrice: string, newCode: string, newId: string, newMarkup: string }): string {
    const changeCaption = captionChecked ? `наименование: "${newCaption}"` : ""
    const changePrice = priceChecked ? `цена:"${newPrice}"` : ""
    const changeMarkup = markupChecked ? `наценка:"${newMarkup}"` : ""
    const changeCode = codeChecked ? `код:"${newCode}"` : ""
    const changeId = idChecked ? `идентификатор:"${newId}"` : ""
    const message = `Обновить в материале ${caption}: ${changeCaption} ${changePrice}${changeMarkup} ${changeCode} ${changeId}?`
    return message
}

function getAddMessage({ type, name, code }: { type: string, name: string, code: string }): string {
    const message = `Добавить профиль (Тип: ${type}) - ${name}, код: ${code} ?`
    return message
}