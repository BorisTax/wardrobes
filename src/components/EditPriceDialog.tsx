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


export default function EditPriceDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const loadPriceList = useSetAtom(loadPriceListAtom)
    const [priceList] = useAtom(priceListAtom)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const { name, caption, price, code, id } = (priceList && priceList[selectedIndex]) ? { ...priceList[selectedIndex] } : { name: "", caption: "", price: "", code: "", id: "" }
    const closeDialog = () => { dialogRef.current?.close() }
    const [, setPriceDialogRef] = useAtom(editPriceDialogAtom)
    const updatePriceList = useSetAtom(updatePriceListAtom)
    const [{ newCaption, newPrice, newCode, newId }, setNewValues] = useState({ newCaption: caption || "", newPrice: `${price}`, newCode: code || "", newId: id || "" })
    useMemo(() => { setNewValues({ newCaption: caption || "", newPrice: `${price}`, newCode: code || "", newId: id || "" }) }, [selectedIndex, priceList])
    const [{ captionChecked, priceChecked, codeChecked, idChecked }, setChecked] = useState({ captionChecked: false, priceChecked: false, codeChecked: false, idChecked: false })
    const showMessage = useMessage()
    const showConfirm = useConfirm()
    const contents = priceList?.map((i: PriceListItem, index) => <tr key={index} onClick={() => setSelectedIndex(index)}>
        <td className="pricelist-cell">{i.caption}</td>
        <td className="pricelist-cell">{UnitCaptions.get(i.units || "")}</td>
        <td className="pricelist-cell">{i.price}</td>
        <td className="pricelist-cell">{i.code || ""}</td>
        <td className="pricelist-cell">{i.id || ""}</td>
    </tr>)
    useEffect(() => {
        loadPriceList()
        setPriceDialogRef(dialogRef)
    }, [setPriceDialogRef, dialogRef])
    return <dialog ref={dialogRef}>
        <div className="pricelist">
            <table>
                <thead>
                    <th className="priceheader">Наименование</th>
                    <th className="priceheader">Ед</th>
                    <th className="priceheader">Цена</th>
                    <th className="priceheader">Код</th>
                    <th className="priceheader">Идентификатор</th>
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
                <input type="button" value="Обновить" disabled={!(captionChecked || priceChecked || codeChecked || idChecked)} onClick={() => {
                    if (!checkFields({ captionChecked, priceChecked, codeChecked, idChecked, newCaption, newPrice, newCode, newId }, showMessage)) return
                    const message = getMessage({ captionChecked, codeChecked, priceChecked, idChecked, caption: caption || "", newCaption, newCode, newId, newPrice })
                    const data: PriceListItem = { name }
                    if (codeChecked) data.code = newCode
                    if (idChecked) data.id = newId
                    if (priceChecked) data.price = +newPrice
                    if (captionChecked) data.caption = newCaption
                    showConfirm(message, () => {
                        updatePriceList(data, (result) => {
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

function checkFields({ captionChecked = true, priceChecked = true, codeChecked = true, idChecked = true, newCaption = "", newPrice = "", newCode = "", newId = "" }: { captionChecked: boolean, priceChecked: boolean, codeChecked: boolean, idChecked: boolean, newCaption: string, newPrice: string, newCode: string, newId: string }, showMessage: (message: string) => void) {
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
    return true
}

function getMessage({ captionChecked, priceChecked, codeChecked, idChecked, caption, newCaption, newPrice, newCode, newId }: { captionChecked: boolean, priceChecked: boolean, codeChecked: boolean, idChecked: boolean, caption: string, newCaption: string, newPrice: string, newCode: string, newId: string }): string {
    const changeCaption = captionChecked ? `наименование: "${newCaption}"` : ""
    const changePrice = priceChecked ? `цена:"${newPrice}"` : ""
    const changeCode = codeChecked ? `код:"${newCode}"` : ""
    const changeId = idChecked ? `идентификатор:"${newId}"` : ""
    const message = `Обновить в материале ${caption}: ${changeCaption} ${changePrice} ${changeCode} ${changeId}?`
    return message
}

function getAddMessage({ type, name, code }: { type: string, name: string, code: string }): string {
    const message = `Добавить профиль (Тип: ${type}) - ${name}, код: ${code} ?`
    return message
}