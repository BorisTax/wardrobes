import { useEffect, useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import TableData, { TableDataRow } from "../../inputs/TableData"
import { InputType, PropertyType } from "../../../types/property"
import messages from "../../../server/messages"
import EditContainer from "../../EditContainer"
import { userAtom } from "../../../atoms/users"
import { RESOURCE } from "../../../types/user"
import { addWardrobeTableAtom, deleteWardrobeTableAtom, loadWardrobeTableAtom, updateWardrobeTableAtom, wardrobeTableAtom } from "../../../atoms/wardrobeTable"
import { detailNamesAtom, wardrobeAtom } from "../../../atoms/storage"
import ComboBox from "../../inputs/ComboBox"
import { WardrobeDetailTableSchema } from "../../../types/schemas"
import ParameterLegend from "./ParametersLegend"
function emptyDetailItem(): WardrobeDetailTableSchema {
    return {
        detailId: 0,
        length: "",
        width: "",
        count: 0,
        id: 0,
        maxHeight: 0,
        maxWidth: 0,
        minHeight: 0,
        minWidth: 0,
        wardrobeId: 0,
    }
}
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
    const wardrobeDetails = useMemo(() => allDetails.filter(d => d.wardrobeId === wardrobeId), [allDetails, wardrobeId])
    const distinct = [...new Set(wardrobeDetails.map(d => d.detailId))]
    const [currentDetailId, setCurrentDetailId] = useState(0)
    const details = useMemo(() => wardrobeDetails.filter(d => !currentDetailId || (d.detailId === currentDetailId)), [wardrobeDetails, currentDetailId])
    const [detailId, setDetailId] = useState(details.at(0)?.id || 0)
    const detail = details.find(d => d.id === detailId) || emptyDetailItem()
    const heads = [{ caption: 'Деталь', sorted: true }, { caption: 'Ширина от', sorted: true }, { caption: 'Ширина до', sorted: true }, { caption: 'Высота от', sorted: true }, { caption: 'Высота до', sorted: true }, { caption: 'Кол-во', sorted: true }, { caption: 'Длина', sorted: true }, { caption: 'Ширина', sorted: true }]
    const contents: TableDataRow[] = details.map(d => ({ key: d.id, data: [detailNames.get(d.detailId) || "", d.minWidth, d.maxWidth, d.minHeight, d.maxHeight, d.count, d.length, d.width] }))
    
    const editItems: EditDataItem[] = [
        { title: "Деталь:", value: detail.detailId, displayValue: value => detailNames.get(value as number) || "", message: messages.ENTER_CAPTION, inputType: InputType.LIST, list: [...detailNames.keys()], listWithEmptyRow: true },
        { title: "Ширина от:", value: detail.minWidth,  inputType: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { title: "Ширина до:", value: detail.maxWidth,  inputType: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { title: "Высота от:", value: detail.minHeight,  inputType: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { title: "Высота до:", value: detail.maxHeight,  inputType: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { title: "Кол-во:", value: detail.count,  inputType: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { title: "Длина:", value: detail.length,  inputType: InputType.TEXT },
        { title: "Ширина:", value: detail.width,  inputType: InputType.TEXT },
    ]
    useEffect(() => {
        loadDetails()
    }, [])
    return <EditContainer>
        <div>
            <ComboBox<number> value={wardrobeId} displayValue={value => wardrobes.get(value)} items={[...wardrobes.keys()]} onChange={value => setWardrobeId(value)} />
                <hr/>
                <ComboBox<number> value={currentDetailId} displayValue={value => detailNames.get(value)} items={distinct} onChange={value => setCurrentDetailId(value)} withEmpty={true} />
                <hr/>
            <TableData header={heads} content={contents} onSelectRow={value => { setDetailId(value as number) }} />
        </div>
        <div>
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
                    setDetailId(details.at(0)?.id || 0)
                    return result
                } : undefined}
                onAdd={perm?.Create ? async (checked, values) => {
                    const detailId = checked[0] ? values[0] as number : detail.detailId
                    const minWidth = checked[1] ? +values[1] : detail.minWidth
                    const maxWidth = checked[2] ? +values[2] : detail.maxWidth
                    const minHeight = checked[3] ? +values[3] : detail.minHeight
                    const maxHeight = checked[4] ? +values[4] : detail.maxHeight
                    const count = checked[5] ? +values[5] : detail.count
                    const length = checked[6] ? values[6] as string : detail.length
                    const width = checked[7] ? values[7] as string : detail.width
                    const result = await addDetails({ wardrobeId, detailId, maxWidth, minWidth, minHeight, maxHeight, count, length, width })
                    return result
                } : undefined} /> : <div></div>
            }
            <ParameterLegend />
        </div>
    </EditContainer>
}
