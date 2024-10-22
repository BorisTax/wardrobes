import { useEffect, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import TableData, { TableDataRow } from "../TableData"
import EditDataSection, { EditDataItem } from "./EditDataSection"
import { InputType, PropertyType } from "../../types/property"
import EditContainer from "../EditContainer"
import { userAtom } from "../../atoms/users"
import { RESOURCE } from "../../types/user"
import messages from "../../server/messages"
import { unitsAtom } from "../../atoms/storage"
import { specListAtom, updateSpecListAtom } from "../../atoms/specification"
import { useNavigate } from "react-router-dom"
import { SpecSchema } from "../../types/schemas"
import { OmitId } from "../../types/materials"

export default function EditSpecificationDialog() {
    const { permissions } = useAtomValue(userAtom)
    const navigate = useNavigate()
    const perm = permissions.get(RESOURCE.SPECIFICATION)
    const units = useAtomValue(unitsAtom)
    const specList = useAtomValue(specListAtom)
    const updateSpecList = useSetAtom(updateSpecListAtom)
    const [selectedKey, setSelectedKey] = useState([...specList.keys()][0])
    const def = { name: "", caption: "", coef: 1, price: "", code: "", id: "", markup: "" }
    const heads = ['Код', 'Наименование', 'Ед', 'Коэф-т' ]
    const contents: TableDataRow[] = []
    specList.forEach((sp: OmitId<SpecSchema>, key) => (contents.push({ key, data: [sp.code, sp.name, units.get(sp.units), `${sp.coef}`] })))
    const editItems: EditDataItem[] =  [
        { caption: "Наименование:", value: specList.get(selectedKey)?.name || "", message: messages.ENTER_CAPTION, type: InputType.TEXT },
        { caption: "Коэф-т:", value: specList.get(selectedKey)?.coef || 0, message: messages.ENTER_COEF, type: InputType.TEXT, propertyType: PropertyType.POSITIVE_NUMBER },
        { caption: "Код:", value: specList.get(selectedKey)?.code || "", message: messages.ENTER_CODE, type: InputType.TEXT },
    ]
    useEffect(() => {
        if (!perm?.Read) navigate('/')
    }, [perm])
    return <EditContainer>
        <TableData heads={heads} content={contents} onSelectKey={key => setSelectedKey(key as number)} />
        {(perm?.Create || perm?.Update || perm?.Delete) ? <EditDataSection items={editItems} onUpdate={async (checked, values) => {
            const { units, charType, ...data } = specList.get(selectedKey) as OmitId<SpecSchema>
            if (checked[0]) data.name = values[0] as string
            if (checked[1]) data.coef = +values[1]
            if (checked[2]) data.code = values[2] as string
            const result = await updateSpecList({ id: selectedKey, units, charType, ...data })
            return result
        }} /> : <div></div>}

    </EditContainer>
}
