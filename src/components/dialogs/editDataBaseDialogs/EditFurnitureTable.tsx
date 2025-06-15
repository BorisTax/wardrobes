import { useEffect, useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import TableData, { TableDataRow } from "../../inputs/TableData"
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
import { FurnitureTableSchema } from "../../../types/schemas"
import ParameterLegend from "./ParametersLegend"
function emptyFurnitureItem(): FurnitureTableSchema {
    return {
        charId: 0,
        count: 0,
        id: 0,
        maxDepth: 0,
        maxHeight: 0,
        maxWidth: 0,
        minDepth: 0,
        minHeight: 0,
        minWidth: 0,
        size: "",
        specId: 0,
        wardrobeId: 0,
    }
}
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
    const [itemId, setItemId] = useState(items[0]&&items[0].id)
    const item = items.find(i => i.id === itemId) || emptyFurnitureItem()
    const editCharList = useMemo(() => specToChar.filter(s => currentEditSpec ? s.id === currentEditSpec : s.id === item?.specId).map(s => s.charId), [specToChar, currentEditSpec, item?.specId])
    const heads = [{ caption: 'Фурнитура', sorted: true }, { caption: 'Ширина от', sorted: true }, { caption: 'Ширина до', sorted: true }, { caption: 'Глубина от', sorted: true }, { caption: 'Глубина до', sorted: true }, { caption: 'Высота от', sorted: true }, { caption: 'Высота до', sorted: true }, { caption: 'Кол-во', sorted: true }, { caption: 'Размер', sorted: true }, { caption: 'Характеристика', sorted: true }]
    const contents: TableDataRow[] = items.map(d => ({ key: d.id, data: [spec.get(d.specId)?.name || "", d.minWidth, d.maxWidth, d.minDepth, d.maxDepth, d.minHeight, d.maxHeight, d.count, d.size, chars.get(d.charId)?.name || ""] }))
    
    const editItems: EditDataItem[] = [
        { title: "Фурнитура:", value: item.specId, displayValue: value => spec.get(value as number)?.name || "", message: messages.ENTER_CAPTION, inputType: InputType.LIST, list: [...spec.keys()], listWithEmptyRow: true, onChange: value => setCurrentEditSpec(value as number) },
        { title: "Ширина от:", value: item.minWidth,  inputType: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { title: "Ширина до:", value: item.maxWidth,  inputType: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { title: "Глубина от:", value: item.minDepth,  inputType: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { title: "Глубина до:", value: item.maxDepth,  inputType: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { title: "Высота от:", value: item.minHeight,  inputType: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { title: "Высота до:", value: item.maxHeight,  inputType: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { title: "Кол-во:", value: item.count,  inputType: InputType.TEXT, propertyType: PropertyType.POSITIVE_NUMBER },
        { title: "Размер:", value: item.size, inputType: InputType.TEXT, optional: true },
        { title: "Характеристика:", value: item?.charId || 0, displayValue: value => chars.get(value as number)?.name || "", message: messages.ENTER_CAPTION, inputType: InputType.LIST, list: editCharList, listWithEmptyRow: true, optional: true },
    ]
    useEffect(() => {
        loadData()
    }, [])
    useEffect(() => {
        setItemId(items.at(-1)?.id || 0)
        setCurrentEditSpec(0)
    }, [furnitureTable])
    useEffect(() => {
        setItemId(items.at(0)?.id || 0)
        setCurrentSpec(0)
        setCurrentEditSpec(0)
    }, [wardrobeId])
    return <EditContainer>
        <div>
            <ComboBox<number> value={wardrobeId} displayValue={value => wardrobes.get(value)} items={[...wardrobes.keys()]} onChange={value => setWardrobeId(value)} />
                <hr/>
            <ComboBox<number> value={currentSpec} displayValue={value => spec.get(value)?.name} items={distinct} onChange={value => setCurrentSpec(value)} withEmpty={true} />
            <hr/>
            <TableData header={heads} content={contents} onSelectRow={key => { setItemId(key as number) }} />
        </div>
        <div>
            {(perm?.Read) ? <EditDataSection name={spec.get(item.specId)?.name || ""} items={editItems}
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
                    setItemId(items.at(0)?.id || 0)
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
                 <ParameterLegend />
        </div>
    </EditContainer>
}
