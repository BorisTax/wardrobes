import { useEffect, useRef, useState } from "react"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { editSpecificationDialogAtom } from "../../atoms/dialogs"
import useMessage from "../../custom-hooks/useMessage"
import useConfirm from "../../custom-hooks/useConfirm"
import { rusMessages } from "../../functions/messages"
import { updatePriceListAtom } from "../../atoms/prices"
import { SpecificationData } from "../../types/server"
import { UnitCaptions } from "../../functions/materials"
import DialogWindow from "./DialogWindow"
import { loadSpecificationListAtom, specificationDataAtom, updateSpecificationListAtom } from "../../atoms/specification"
import TableData from "./TableData"
import EditDataSection, { EditDataItem } from "./EditDataSection"
import { updateSpecList } from "../../server/routers/specification"

export default function EditSpecificationDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const [loading, setLoading] = useState(false)
    const loadSpecList = useSetAtom(loadSpecificationListAtom)
    const specList = useAtomValue(specificationDataAtom)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const def = { name: "", caption: "", coef: 1, price: "", code: "", id: "", markup: "" }
    const { name, caption, coef, code, id } = (specList && specList[selectedIndex]) ? ({ ...(specList[selectedIndex] || def) }) : def
    const [, setDialogRef] = useAtom(editSpecificationDialogAtom)
    const updateSpecList = useSetAtom(updateSpecificationListAtom)
    const showMessage = useMessage()
    const showConfirm = useConfirm()
    const heads = ['Наименование', 'Ед', 'Коэф-т', 'Код', 'Идентификатор']
    const contents = specList.map((i: SpecificationData) => [i.caption || "", UnitCaptions.get(i.units || "") || "", `${i.coef}`, i.code || "", i.id || ""])
    const editItems: EditDataItem[] = [
        { caption: "Наименование:", value: caption || "", message: "Введите наименование" },
        { caption: "Коэф-т:", value: `${coef}`, message: "Введите коэф-т" },
        { caption: "Код:", value: code || "", message: "Введите код" },
        { caption: "Идентификатор:", value: id || "", message: "Введите идентификатор" },
    ]
    useEffect(() => {
        loadSpecList()
        setDialogRef(dialogRef)
    }, [setDialogRef, dialogRef])
    return <DialogWindow dialogRef={dialogRef} title="Редактор спецификации">
        <TableData heads={heads} content={contents} onSelectRow={(index) => setSelectedIndex(index)} />
        <EditDataSection items={editItems} onUpdate={(checked, values, message) => {
            const data: SpecificationData = { name: specList[selectedIndex].name }
            if (checked[0]) data.caption = values[0]
            if (checked[1]) data.coef = +values[1]
            if (checked[2]) data.code = values[2]
            if (checked[3]) data.id = values[3]
            showConfirm(message, () => {
                setLoading(true)
                updateSpecList(data, (result) => {
                    setLoading(false)
                    showMessage(rusMessages[result.message])
                })
            })
        }} />
        {loading && <div className="spinner-container" onClick={(e) => { e.stopPropagation() }}><div className="spinner"></div></div>}
    </DialogWindow>
}
