import { useEffect, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import useMessage from "../../custom-hooks/useMessage"
import useConfirm from "../../custom-hooks/useConfirm"
import { rusMessages } from "../../functions/messages"
import { SpecificationData } from "../../types/server"
import { UnitCaptions } from "../../functions/materials"
import { loadSpecificationListAtom, specificationDataAtom, updateSpecificationListAtom } from "../../atoms/specification"
import TableData from "../TableData"
import EditDataSection, { EditDataItem } from "./EditDataSection"
import { InputType, PropertyType } from "../../types/property"

export default function EditSpecificationDialog() {
    const [loading, setLoading] = useState(false)
    const loadSpecList = useSetAtom(loadSpecificationListAtom)
    const specList = useAtomValue(specificationDataAtom)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const def = { name: "", caption: "", coef: 1, price: "", code: "", id: "", markup: "" }
    const { name, caption, coef, code, id } = (specList && specList[selectedIndex]) ? ({ ...(specList[selectedIndex] || def) }) : def
    const updateSpecList = useSetAtom(updateSpecificationListAtom)
    const showMessage = useMessage()
    const showConfirm = useConfirm()
    const heads = ['Наименование', 'Ед', 'Коэф-т', 'Код', 'Идентификатор']
    const contents = specList.map((i: SpecificationData) => [i.caption || "", UnitCaptions.get(i.units || "") || "", `${i.coef}`, i.code || "", i.id || ""])
    const editItems: EditDataItem[] = [
        { caption: "Наименование:", value: caption || "", message: "Введите наименование", type: InputType.TEXT },
        { caption: "Коэф-т:", value: `${coef}`, message: "Введите коэф-т", type: InputType.TEXT, propertyType: PropertyType.POSITIVE_NUMBER },
        { caption: "Код:", value: code || "", message: "Введите код", type: InputType.TEXT },
        { caption: "Идентификатор:", value: id || "", message: "Введите идентификатор", type: InputType.TEXT },
    ]
    useEffect(() => {
        loadSpecList()
    }, [])
    return <div className="container">
        <div className="row">
            <TableData heads={heads} content={contents} onSelectRow={(index) => setSelectedIndex(index)} />
            <EditDataSection items={editItems} onUpdate={async (checked, values) => {
                const data: SpecificationData = { name: specList[selectedIndex].name }
                if (checked[0]) data.caption = values[0]
                if (checked[1]) data.coef = +values[1]
                if (checked[2]) data.code = values[2]
                if (checked[3]) data.id = values[3]
                const result = await updateSpecList(data)
                return result
            }} />
        </div>
    </div>
}
