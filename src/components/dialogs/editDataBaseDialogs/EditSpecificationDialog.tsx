import { useEffect, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import TableData, { TableDataRow } from "../../inputs/TableData"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import { InputType, PropertyType } from "../../../types/property"
import EditContainer from "../../EditContainer"
import { userAtom } from "../../../atoms/users"
import { RESOURCE } from "../../../types/user"
import messages from "../../../server/messages"
import { unitsAtom } from "../../../atoms/storage"
import { specListAtom, updateSpecListAtom } from "../../../atoms/specification"
import { useNavigate } from "react-router-dom"
import { SpecSchema } from "../../../types/schemas"
import { OmitId } from "../../../types/materials"

export default function EditSpecificationDialog() {
    const { permissions } = useAtomValue(userAtom)
    const navigate = useNavigate()
    const perm = permissions.get(RESOURCE.SPECIFICATION)
    const units = useAtomValue(unitsAtom)
    const specList = useAtomValue(specListAtom)
    const updateSpecList = useSetAtom(updateSpecListAtom)
    const [selectedKey, setSelectedKey] = useState([...specList.keys()][0])
    const def = { name: "", caption: "", coef: 1, price: "", code: "", id: "", markup: "" }
    const heads = [{ caption: 'Код', sorted: true }, { caption: 'Наименование', sorted: true }, { caption: 'Ед', sorted: true }, { caption: 'Коэф-т', sorted: true }]
    const contents: TableDataRow[] = []
    specList.forEach((sp: OmitId<SpecSchema>, key) => (contents.push({ key, data: [sp.code, sp.name, units.get(sp.units), `${sp.coef}`] })))
    const editItems: EditDataItem[] =  [
        { title: "Наименование:", value: specList.get(selectedKey)?.name || "", message: messages.ENTER_CAPTION, inputType: InputType.TEXT },
        { title: "Коэф-т:", value: specList.get(selectedKey)?.coef || 0, message: messages.ENTER_COEF, inputType: InputType.TEXT, propertyType: PropertyType.POSITIVE_NUMBER },
        { title: "Код:", value: specList.get(selectedKey)?.code || "", message: messages.ENTER_CODE, inputType: InputType.TEXT },
    ]
    useEffect(() => {
        if (!perm?.Read) navigate('/')
    }, [perm])
    return <EditContainer>
        <TableData header={heads} content={contents} onSelectRow={key => setSelectedKey(key as number)} />
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
