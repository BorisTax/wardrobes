import { useEffect, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { SpecificationData } from "../../types/server"
import { UnitCaptions } from "../../functions/materials"
import { loadSpecificationListAtom, specificationDataAtom, updateSpecificationListAtom } from "../../atoms/specification"
import TableData from "../TableData"
import EditDataSection, { EditDataItem } from "./EditDataSection"
import { InputType, PropertyType } from "../../types/property"
import EditContainer from "../EditContainer"
import { userAtom } from "../../atoms/users"
import { RESOURCE } from "../../types/user"
import messages from "../../server/messages"

export default function EditSpecificationDialog() {
    const loadSpecList = useSetAtom(loadSpecificationListAtom)
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.SPECIFICATION)
    const specList = useAtomValue(specificationDataAtom)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const def = { name: "", caption: "", coef: 1, price: "", code: "", id: "", markup: "" }
    const { caption, coef, code, id } = (specList && specList[selectedIndex]) ? ({ ...(specList[selectedIndex] || def) }) : def
    const updateSpecList = useSetAtom(updateSpecificationListAtom)
    const heads = ['Наименование', 'Ед', 'Коэф-т', 'Код', 'Идентификатор']
    const contents = specList.map((i: SpecificationData) => [i.caption || "", UnitCaptions.get(i.units || "") || "", `${i.coef}`, i.code || "", i.id || ""])
    const editItems: EditDataItem[] =  [
        { caption: "Наименование:", value: caption || "", message: messages.ENTER_CAPTION, type: InputType.TEXT },
        { caption: "Коэф-т:", value: `${coef}`, message: messages.ENTER_COEF, type: InputType.TEXT, propertyType: PropertyType.POSITIVE_NUMBER },
        { caption: "Код:", value: code || "", message: messages.ENTER_CODE, type: InputType.TEXT },
        { caption: "Идентификатор:", value: id || "", message: messages.ENTER_ID, type: InputType.TEXT },
    ]
    useEffect(() => {
        loadSpecList()
    }, [loadSpecList])
    useEffect(() => {
        if (!perm?.Read) window.location.replace('/')
    }, [perm])
    return <EditContainer>
        <TableData heads={heads} content={contents} onSelectRow={(index) => setSelectedIndex(index)} />
        {(perm?.Create || perm?.Update || perm?.Delete) ? <EditDataSection items={editItems} onUpdate={async (checked, values) => {
            const data: SpecificationData = { name: specList[selectedIndex].name }
            if (checked[0]) data.caption = values[0] as string
            if (checked[1]) data.coef = +values[1]
            if (checked[2]) data.code = values[2] as string
            if (checked[3]) data.id = values[3] as string
            const result = await updateSpecList(data)
            return result
        }} /> : <div></div>}
    </EditContainer>
}
