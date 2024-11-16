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
import { specListAtom, specToCharAtom } from "../../../atoms/specification"
import { charAtom } from "../../../atoms/materials/chars"

export default function EditFurnitureTable() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MATERIALS_DB)
    const loadData = useSetAtom(loadFurnitureTableAtom)
    const updateData = useSetAtom(updateFurnitureTableAtom)
    const addData = useSetAtom(addvFurnitureTableAtom)
    const deleteData = useSetAtom(deleteFurnitureTableAtom)
    const wardrobes = useAtomValue(wardrobeAtom)
    const spec = useAtomValue(specListAtom)
    const specToChar = useAtomValue(specToCharAtom)
    const chars = useAtomValue(charAtom)
    const [wardrobeId, setWardrobeId] = useState([...wardrobes.keys()][0])
    const furnitureTable = useAtomValue(furnitureTableAtom)
    const allItems = useMemo(() => furnitureTable.filter(d => d.wardrobeId === wardrobeId), [furnitureTable, wardrobeId])
    const distinct = [...new Set(allItems.map(i => i.specId))]
    const [currentSpec, setCurrentSpec] = useState(0)
    const [currentEditSpec, setCurrentEditSpec] = useState(0)
    const items = useMemo(() => allItems.filter(i => !currentSpec || (i.specId === currentSpec)), [allItems, currentSpec])
    const [itemIndex, setItemIndex] = useState(0)
    const item = items[itemIndex]
    const editCharList = useMemo(() => specToChar.filter(s => currentEditSpec ? s.id === currentEditSpec : s.id === item?.specId).map(s => s.charId), [specToChar, currentEditSpec, item?.specId])
    const heads = ['Фурнитура', 'Ширина от', 'Ширина до', 'Глубина от', 'Глубина до', 'Высота от', 'Высота до', 'Кол-во', 'Размер', 'Характеристика']
    const contents: TableDataRow[] = items.map((d, index) => ({ key: index, data: [spec.get(d.specId)?.name || "", d.minWidth, d.maxWidth, d.minDepth, d.maxDepth, d.minHeight, d.maxHeight, d.count, d.size, chars.get(d.charId)?.name || ""] }))
    
    const editItems: EditDataItem[] = [
        { caption: "Фурнитура:", value: item?.specId || 0, valueCaption: value => spec.get(value as number)?.name || "", message: messages.ENTER_CAPTION, type: InputType.LIST, list: [...spec.keys()], listWithEmptyRow: true, onChange: value => setCurrentEditSpec(value as number) },
        { caption: "Ширина от:", value: item?.minWidth || 0,  type: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { caption: "Ширина до:", value: item?.maxWidth || 0,  type: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { caption: "Глубина от:", value: item?.minDepth || 0,  type: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { caption: "Глубина до:", value: item?.maxDepth || 0,  type: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { caption: "Высота от:", value: item?.minHeight || 0,  type: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { caption: "Высота до:", value: item?.maxHeight || 0,  type: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { caption: "Кол-во:", value: item?.count || 0,  type: InputType.TEXT, propertyType: PropertyType.POSITIVE_NUMBER },
        { caption: "Размер:", value: item?.size || "", type: InputType.TEXT, optional: true },
        { caption: "Характеристика:", value: item?.charId || 0, valueCaption: value => chars.get(value as number)?.name || "", message: messages.ENTER_CAPTION, type: InputType.LIST, list: editCharList, listWithEmptyRow: true, optional: true },
    ]
    useEffect(() => {
        loadData()
    }, [])
    useEffect(() => {
        setItemIndex(items.length && (items.length - 1))
        setCurrentEditSpec(0)
    }, [furnitureTable])
    useEffect(() => {
        setItemIndex(0)
        setCurrentSpec(0)
        setCurrentEditSpec(0)
    }, [wardrobeId])
    return <EditContainer>
        <div>
            <ComboBox<number> value={wardrobeId} displayValue={value => wardrobes.get(value)} items={[...wardrobes.keys()]} onChange={value => setWardrobeId(value)} />
            <ComboBox<number> value={currentSpec} displayValue={value => spec.get(value)?.name} items={distinct} onChange={value => setCurrentSpec(value)} withEmpty={true} />
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
                const charId = checked[9] ? +values[9] : item.charId
                const result = await updateData({ id: item.id, wardrobeId, specId, maxWidth, minWidth, maxDepth, minDepth, minHeight, maxHeight, count, size, charId })
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
                const charId = checked[9] ? +values[9] : item.charId
                const result = await addData({ wardrobeId, specId, maxWidth, minWidth, maxDepth, minDepth, minHeight, maxHeight, count, size, charId })
                return result
            } : undefined} /> : <div></div>}
    </EditContainer>
}
