import { useEffect, useMemo, useRef, useState } from "react"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { editPriceDialogAtom } from "../../atoms/dialogs"
import useMessage from "../../custom-hooks/useMessage"
import useConfirm from "../../custom-hooks/useConfirm"
import { rusMessages } from "../../functions/messages"
import { loadPriceListAtom, priceListAtom, updatePriceListAtom } from "../../atoms/prices"
import { PriceData } from "../../types/server"
import { PropertyType } from "../../types/property"
import DialogWindow from "./DialogWindow"
import { MAT_PURPOSE } from "../../types/enums"
import TextBox from "../TextBox"
import { specificationDataAtom } from "../../atoms/specification"
type ExtPriceData = PriceData & { caption: string }
export default function EditPriceDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const [loading, setLoading] = useState(false)
    const [purpose, setPurpose] = useState(MAT_PURPOSE.FASAD)
    const loadPriceList = useSetAtom(loadPriceListAtom)
    const priceList = useAtomValue(priceListAtom)
    const specList = useAtomValue(specificationDataAtom)
    const extPriceList: ExtPriceData[] = useMemo(() => priceList.map(p => ({ ...p, caption: specList.find(s => s.name === p.name)?.caption || "" })), [priceList, specList]) 
    const [selectedIndex, setSelectedIndex] = useState(0)
    const def = { name: "", caption: "", price: "", markup: "" }
    const { name, caption, price, markup } = (extPriceList && extPriceList[selectedIndex]) ? ({ ...(extPriceList[selectedIndex] || def) }) : def
    const [, setPriceDialogRef] = useAtom(editPriceDialogAtom)
    const updatePriceList = useSetAtom(updatePriceListAtom)
    const [{ newPrice, newMarkup }, setNewValues] = useState({ newPrice: `${price}`, newMarkup: `${markup}` })
    useMemo(() => { setNewValues({ newPrice: `${price}`, newMarkup: `${markup}` || "" }) }, [selectedIndex, priceList])
    const [{ priceChecked, markupChecked }, setChecked] = useState({ priceChecked: false, markupChecked: false })
    const showMessage = useMessage()
    const showConfirm = useConfirm()
    const className = "p-1 border"
    const active = `${className} fw-bold`
    const contents = extPriceList?.map((i: ExtPriceData, index) => <tr key={index} onClick={() => setSelectedIndex(index)}>
                <td className="pricelist-cell">{i.caption}</td>
                <td className="pricelist-cell">{i.price}</td>
                <td className="pricelist-cell">{i.markup}</td>
            </tr>)
    useEffect(() => {
        loadPriceList()
        setPriceDialogRef(dialogRef)
    }, [setPriceDialogRef, dialogRef])
    return <DialogWindow dialogRef={dialogRef} title="Редактор цен">
        <div className="overflow-scroll">
            <div className="pricelist">
                <table>
                    <thead>
                        <tr>
                            <th className="priceheader">Наименование</th>
                            <th className="priceheader">Цена</th>
                            <th className="priceheader">Наценка</th>
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
                        <input type="text" value={caption} />
                    </div>
                    <span className="text-end text-nowrap">Цена:</span>
                    <div className="d-flex justify-content-start gap-2">
                        <input type="checkbox" checked={priceChecked} onChange={() => { setChecked(prev => ({ ...prev, priceChecked: !priceChecked })) }} />
                        <TextBox value={newPrice} disabled={!priceChecked} type={PropertyType.POSITIVE_NUMBER} setValue={(value) => { setNewValues(prev => ({ ...prev, newPrice: `${value}` })) }} />
                    </div>
                    <span className="text-end text-nowrap">Наценка:</span>
                    <div className="d-flex justify-content-start gap-2">
                        <input type="checkbox" checked={markupChecked} onChange={() => { setChecked(prev => ({ ...prev, markupChecked: !markupChecked })) }} />
                        <TextBox value={newMarkup} disabled={!markupChecked} type={PropertyType.POSITIVE_NUMBER} setValue={(value) => { setNewValues(prev => ({ ...prev, newMarkup: `${value}` })) }} />
                    </div>

                </div>
                <div className="editmaterial-buttons-container">
                    <input type="button" value="Обновить" disabled={!(priceChecked || markupChecked)} onClick={() => {
                        if (!checkFields({ priceChecked, markupChecked, newPrice, newMarkup }, showMessage)) return
                        const message = getMessage({ priceChecked, markupChecked, caption: caption || "", newPrice, newMarkup })
                        const data: PriceData = { name }
                        if (priceChecked) data.price = +newPrice
                        if (markupChecked) data.markup = +newMarkup
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

function checkFields({ priceChecked = true, markupChecked = true, newPrice = "", newMarkup = "" }: { priceChecked: boolean, markupChecked: boolean, newPrice: string, newMarkup: string }, showMessage: (message: string) => void) {
    if (priceChecked && newPrice.trim() === "") {
        showMessage("Введите корректную цену")
        return false
    }
    if (markupChecked && newMarkup.trim() === "") {
        showMessage("Введите наценку")
        return false
    }
    return true
}

function getMessage({ priceChecked, markupChecked, caption, newPrice, newMarkup }: { priceChecked: boolean, markupChecked: boolean, caption: string, newPrice: string, newMarkup: string }): string {
    const changePrice = priceChecked ? `цена:"${newPrice}"` : ""
    const changeMarkup = markupChecked ? `наценка:"${newMarkup}"` : ""
    const message = `Обновить в материале ${caption}: ${changePrice} ${changeMarkup} ?`
    return message
}

