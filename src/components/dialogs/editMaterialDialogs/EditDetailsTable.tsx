import { useEffect, useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import TableData, { TableDataRow } from "../../TableData"
import { InputType, PropertyType } from "../../../types/property"
import messages from "../../../server/messages"
import EditContainer from "../../EditContainer"
import { userAtom } from "../../../atoms/users"
import { RESOURCE } from "../../../types/user"
import { addWardrobeTableAtom, deleteWardrobeTableAtom, loadWardrobeTableAtom, updateWardrobeTableAtom, wardrobeTableAtom } from "../../../atoms/wardrobeTable"
import { detailNamesAtom, wardrobeAtom } from "../../../atoms/storage"
import ComboBox from "../../inputs/ComboBox"

export default function EditDetailsTable() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MATERIALS_DB)
    const loadDetails = useSetAtom(loadWardrobeTableAtom)
    const updateDetails = useSetAtom(updateWardrobeTableAtom)
    const addDetails = useSetAtom(addWardrobeTableAtom)
    const deleteDetails = useSetAtom(deleteWardrobeTableAtom)
    const wardrobes = useAtomValue(wardrobeAtom)
    const detailNames = useAtomValue(detailNamesAtom)
    const [wardrobeId, setWardrobeId] = useState([...wardrobes.keys()][0])
    const allDetails = useAtomValue(wardrobeTableAtom)
    const details = useMemo(() => allDetails.filter(d => d.wardrobeId === wardrobeId), [allDetails, wardrobeId])
    const [detailIndex, setDetailIndex] = useState(0)
    const detail = details[detailIndex]
    const heads = ['Деталь', 'Ширина от', 'Ширина до', 'Высота от', 'Высота до', 'Кол-во', 'Длина', 'Ширина']
    const contents: TableDataRow[] = details.map((d, index) => ({ key: index, data: [detailNames.get(d.detailId) || "", d.minWidth, d.maxWidth, d.minHeight, d.maxHeight, d.count, d.length, d.width] }))
    
    const editItems: EditDataItem[] = [
        { caption: "Деталь:", value: detail?.detailId || 0, valueCaption: value => detailNames.get(value as number) || "", message: messages.ENTER_CAPTION, type: InputType.LIST, list: [...detailNames.keys()], listWithEmptyRow: true },
        { caption: "Ширина от:", value: detail?.minWidth || 0,  type: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { caption: "Ширина до:", value: detail?.maxWidth || 0,  type: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { caption: "Высота от:", value: detail?.minHeight || 0,  type: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { caption: "Высота до:", value: detail?.maxHeight || 0,  type: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { caption: "Кол-во:", value: detail?.count || 0,  type: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { caption: "Длина:", value: detail?.length || "",  type: InputType.TEXT },
        { caption: "Ширина:", value: detail?.width || "",  type: InputType.TEXT },
    ]
    useEffect(() => {
        loadDetails()
    }, [])
    return <EditContainer>
        <div>
            <ComboBox<number> value={wardrobeId} displayValue={value => wardrobes.get(value)} items={[...wardrobes.keys()]} onChange={value => setWardrobeId(value)} />
            <TableData heads={heads} content={contents} onSelectRow={value => { setDetailIndex(value as number) }} />
        </div>
        {(perm?.Read) ? <EditDataSection name={detailNames.get(detail?.detailId)} items={editItems}
            onUpdate={perm?.Update ? async (checked, values) => {
                const detailId = checked[0] ? values[0] as number : detail.detailId
                const minWidth = checked[1] ? +values[1] : detail.minWidth
                const maxWidth = checked[2] ? +values[2] : detail.maxWidth
                const minHeight = checked[3] ? +values[3] : detail.minHeight
                const maxHeight = checked[4] ? +values[4] : detail.maxHeight
                const count = checked[5] ? +values[5] : detail.count
                const length = checked[6] ? values[6] as string : detail.length
                const width = checked[7] ? values[7] as string : detail.width
                const result = await updateDetails({ id: detail.id, wardrobeId: detail.wardrobeId, detailId, maxWidth, minWidth, minHeight, maxHeight, count, length, width })
                return result
            } : undefined}
            onDelete={perm?.Delete ? async () => {
                const result = await deleteDetails(detail.id)
                setDetailIndex(0)
                return result
            } : undefined}
            onAdd={perm?.Create ? async (checked, values) => {
                const detailId = checked[0] ? values[0] as number : detail.detailId
                const minWidth = checked[1] ? +values[1] : detail.minWidth || 0
                const maxWidth = checked[2] ? +values[2] : detail.maxWidth || 0
                const minHeight = checked[3] ? +values[3] : detail.minHeight || 0
                const maxHeight = checked[4] ? +values[4] : detail.maxHeight || 0
                const count = checked[5] ? +values[5] : detail.count || 0
                const length = checked[6] ? values[6] as string : detail.length || ""
                const width = checked[7] ? values[7] as string : detail.width || ""
                const result = await addDetails({ wardrobeId, detailId, maxWidth, minWidth, minHeight, maxHeight, count, length, width })
                return result
            } : undefined} /> : <div></div>}
    </EditContainer>
}
