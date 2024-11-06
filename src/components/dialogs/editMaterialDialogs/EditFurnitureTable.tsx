import { useEffect, useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import TableData, { TableDataRow } from "../../TableData"
import { InputType, PropertyType } from "../../../types/property"
import messages from "../../../server/messages"
import EditContainer from "../../EditContainer"
import { userAtom } from "../../../atoms/users"
import { RESOURCE } from "../../../types/user"
import { wardrobeAtom } from "../../../atoms/storage"
import ComboBox from "../../inputs/ComboBox"
import { addvFurnitureTableAtom, deleteFurnitureTableAtom, furnitureTableAtom, loadFurnitureTableAtom, updateFurnitureTableAtom } from "../../../atoms/furniruteTable"
import { specListAtom } from "../../../atoms/specification"

export default function EditFurnitureTable() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MATERIALS_DB)
    const loadData = useSetAtom(loadFurnitureTableAtom)
    const updateData = useSetAtom(updateFurnitureTableAtom)
    const addData = useSetAtom(addvFurnitureTableAtom)
    const deleteData = useSetAtom(deleteFurnitureTableAtom)
    const wardrobes = useAtomValue(wardrobeAtom)
    const spec = useAtomValue(specListAtom)
    const [wardrobeId, setWardrobeId] = useState([...wardrobes.keys()][0])
    const furniruteTable = useAtomValue(furnitureTableAtom)
    const items = useMemo(() => furniruteTable.filter(d => d.wardrobeId === wardrobeId), [furniruteTable, wardrobeId])
    const [itemIndex, setItemIndex] = useState(0)
    const item = items[itemIndex]
    const heads = ['Фурнитура', 'Ширина от', 'Ширина до', 'Глубина от', 'Глубина до', 'Высота от', 'Высота до', 'Кол-во', 'Размер']
    const contents: TableDataRow[] = items.map((d, index) => ({ key: index, data: [spec.get(d.specId)?.name || "", d.minWidth, d.maxWidth,d.minDepth, d.maxDepth, d.minHeight, d.maxHeight, d.count, d.size] }))
    
    const editItems: EditDataItem[] = [
        { caption: "Фурнитура:", value: item?.specId || 0, valueCaption: value => spec.get(value as number)?.name || "", message: messages.ENTER_CAPTION, type: InputType.LIST, list: [...spec.keys()], listWithEmptyRow: true },
        { caption: "Ширина от:", value: item?.minWidth || 0,  type: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { caption: "Ширина до:", value: item?.maxWidth || 0,  type: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { caption: "Глубина от:", value: item?.minDepth || 0,  type: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { caption: "Глубина до:", value: item?.maxDepth || 0,  type: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { caption: "Высота от:", value: item?.minHeight || 0,  type: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { caption: "Высота до:", value: item?.maxHeight || 0,  type: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { caption: "Кол-во:", value: item?.count || 0,  type: InputType.TEXT, propertyType: PropertyType.POSITIVE_NUMBER },
        { caption: "Размер:", value: item?.size || "", type: InputType.TEXT, optional: true },
    ]
    useEffect(() => {
        loadData()
    }, [])
    useEffect(() => {
        setItemIndex(items.length && (items.length - 1))
    }, [furniruteTable])
    useEffect(() => {
        setItemIndex(0)
    }, [wardrobeId])
    return <EditContainer>
        <div>
            <ComboBox<number> value={wardrobeId} displayValue={value => wardrobes.get(value)} items={[...wardrobes.keys()]} onChange={value => setWardrobeId(value)} />
            <TableData heads={heads} content={contents} onSelectRow={value => { setItemIndex(value as number) }} />
        </div>
        {(perm?.Read) ? <EditDataSection name={spec.get(item?.specId)?.name || ""} items={editItems}
            onUpdate={perm?.Update ? async (checked, values) => {
                const specId = checked[0] ? values[0] as number : item.specId
                const minWidth = checked[1] ? +values[1] : item.minWidth
                const maxWidth = checked[2] ? +values[2] : item.maxWidth
                const minDepth = checked[3] ? +values[3] : item.minDepth
                const maxDepth = checked[4] ? +values[4] : item.maxDepth
                const minHeight = checked[5] ? +values[5] : item.minHeight
                const maxHeight = checked[6] ? +values[6] : item.maxHeight
                const count = checked[7] ? +values[7] : item.count
                const size = checked[8] ? values[8] as string : item.size
                const result = await updateData({ id: item.id, wardrobeId, specId, maxWidth, minWidth, maxDepth, minDepth, minHeight, maxHeight, count, size })
                return result
            } : undefined}
            onDelete={perm?.Delete ? async () => {
                const result = await deleteData(item.id)
                setItemIndex(0)
                return result
            } : undefined}
            onAdd={perm?.Create ? async (checked, values) => {
                const specId = checked[0] ? values[0] as number : item.specId
                const minWidth = checked[1] ? +values[1] : item.minWidth
                const maxWidth = checked[2] ? +values[2] : item.maxWidth
                const minDepth = checked[3] ? +values[3] : item.minDepth
                const maxDepth = checked[4] ? +values[4] : item.maxDepth
                const minHeight = checked[5] ? +values[5] : item.minHeight
                const maxHeight = checked[6] ? +values[6] : item.maxHeight
                const count = checked[7] ? +values[7] : item.count
                const size = checked[8] ? values[8] as string : item.size
                const result = await addData({ wardrobeId, specId, maxWidth, minWidth, maxDepth, minDepth, minHeight, maxHeight, count, size })
                return result
            } : undefined} /> : <div></div>}
    </EditContainer>
}
