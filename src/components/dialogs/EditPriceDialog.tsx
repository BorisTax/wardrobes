import { useEffect, useMemo, useRef, useState } from "react"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { editPriceDialogAtom } from "../../atoms/dialogs"
import useMessage from "../../custom-hooks/useMessage"
import useConfirm from "../../custom-hooks/useConfirm"
import { rusMessages } from "../../functions/messages"
import { loadPriceListAtom, priceListAtom, updatePriceListAtom } from "../../atoms/prices"
import { PriceData } from "../../types/server"
import DialogWindow from "./DialogWindow"
import { specificationDataAtom } from "../../atoms/specification"
import EditDataSection, { EditDataItem } from "./EditDataSection"
import { UnitCaptions } from "../../functions/materials"
import TableData from "./TableData"
import { SpecificationItem } from "../../types/specification"
import { InputType, PropertyType } from "../../types/property"
type ExtPriceData = PriceData & { units: string, caption: string }
export default function EditPriceDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const [loading, setLoading] = useState(false)
    const loadPriceList = useSetAtom(loadPriceListAtom)
    const priceList = useAtomValue(priceListAtom)
    const specList = useAtomValue(specificationDataAtom)
    const extPriceList: ExtPriceData[] = useMemo(() => priceList.map(p => ({ ...p, units: specList.find(s => s.name === p.name)?.units || "", caption: specList.find(s => s.name === p.name)?.caption || "" })), [priceList, specList]) 
    const [selectedIndex, setSelectedIndex] = useState(0)
    const def = { name: "", caption: "", price: "", markup: "" }
    const { name, caption, price, markup } = (extPriceList && extPriceList[selectedIndex]) ? ({ ...(extPriceList[selectedIndex] || def) }) : def
    const [, setPriceDialogRef] = useAtom(editPriceDialogAtom)
    const updatePriceList = useSetAtom(updatePriceListAtom)
    const showMessage = useMessage()
    const showConfirm = useConfirm()
    const heads = ['Наименование', 'Ед', 'Цена', 'Наценка']
    const contents = extPriceList.map((i: ExtPriceData) => [i.caption || "", UnitCaptions.get(i.units || "") || "", `${i.price || ""}`, `${i.markup || ""}`])
    const editItems: EditDataItem[] = [
        { caption: "Наименование:", value: caption || "", message: "Введите наименование", type: InputType.TEXT, readonly: true },
        { caption: "Цена:", value: `${price}`, message: "Введите цену", type: InputType.TEXT, propertyType: PropertyType.POSITIVE_NUMBER },
        { caption: "Наценка:", value: `${markup}`, message: "Введите наценку", type: InputType.TEXT, propertyType: PropertyType.POSITIVE_NUMBER },
    ]
    useEffect(() => {
        loadPriceList()
        setPriceDialogRef(dialogRef)
    }, [setPriceDialogRef, dialogRef])
    return <DialogWindow dialogRef={dialogRef} title="Редактор цен">
        <div className="overflow-scroll">
            <TableData heads={heads} content={contents} onSelectRow={(index) => setSelectedIndex(index)} />
            <EditDataSection items={editItems} onUpdate={(checked, values, message) => {
                const data: PriceData = { name: name as SpecificationItem }
                if (checked[1]) data.price = +values[1]
                if (checked[2]) data.markup = +values[2]
                showConfirm(message, () => {
                    setLoading(true)
                    updatePriceList(data, (result) => {
                        setLoading(false)
                        showMessage(rusMessages[result.message])
                    })
                })
            }} />
        </div>
        {loading && <div className="spinner-container" onClick={(e) => { e.stopPropagation() }}><div className="spinner"></div></div>}
    </DialogWindow>
}
