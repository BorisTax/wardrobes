import { useEffect, useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { userAtom } from "../../atoms/users"
import { RESOURCE } from "../../types/user"
import EditContainer from "../EditContainer"
import TableData, { TableDataRow } from "../inputs/TableData"
import EditDataSection, { EditDataItem } from "../dialogs/EditDataSection"
import { InputType } from "../../types/property"
import ComboBox from "../inputs/ComboBox"
import { addMatSkladColor, deleteMatSkladColor, loadMatSkladColorsAtom, loadMatSkladThickAtom, matSkladColorsAtom, matSkladThickAtom, updateMatSkladColor } from "../../atoms/skladMat"


export default function EditMatSkladColor() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.SKLAD_MAT)
    const loadData = useSetAtom(loadMatSkladColorsAtom)
    const loadThick = useSetAtom(loadMatSkladThickAtom)
    const thick = useAtomValue(matSkladThickAtom)
    const colors = useAtomValue(matSkladColorsAtom)
    const thickList = [...thick.keys()].filter(k => k !== 0)
    const [selectedThickId, setSelectedThickId] = useState(thickList[0])
    const colorList = [...colors.keys()].filter(k => colors.get(k)?.thickId === selectedThickId)
    const initialId = useMemo(() => colorList[0] || 0, [colorList])
    const [selectedId, setSelectedId] = useState(initialId)
    const heads = [{ caption: 'id', sorted: true }, { caption: 'Цеет', sorted: true }]
    const contents: TableDataRow[] = []
    colorList.forEach((key) => contents.push({ key, data: [key, colors.get(key)?.name] }))
    const editItems: EditDataItem[] = [
        { title: "Цвет:", value: colors.get(selectedId)?.name || "", inputType: InputType.TEXT, checkValue: (value) => ({ success: (value as string).trim() !== "", message: "Введите цвет" }) },
    ]
    useEffect(() => {
        loadThick()
        loadData()
    }, [])
    return <EditContainer>
        <div>
            <ComboBox title="Толщина" value={selectedThickId} displayValue={(value) => thick.get(value)} items={thickList} onChange={(value) => setSelectedThickId(value)} />
            <hr/>
            <TableData rowNumbers={false} header={heads} content={contents} onSelectRow={value => { setSelectedId(value as number) }} />
        </div>
        {(perm?.Read) ? <EditDataSection items={editItems}
            onUpdate={perm?.Update ? {
                question: (values)=>`Обновить:\nid=${selectedId}\nЦвет: ${values[0]}\nТолщина ${thick.get(selectedThickId)}`,
                disabled: !colorList.includes(selectedId),
                onAction: async (values) => {
                    const name = values[0] as string 
                    const result = await updateMatSkladColor({id: selectedId, name, thickId: selectedThickId})
                    if (result.success) loadData()
                    return result
                }
            } : undefined}
            onDelete={perm?.Delete ? {
                question: () => `Удалить цвет:\nid=${selectedId}\n${colors.get(selectedId)?.name}\nТолщина ${thick.get(selectedThickId)}`,
                disabled: !colorList.includes(selectedId),
                onAction: async () => {
                    const result = await deleteMatSkladColor(selectedId)
                    if (result.success) loadData()
                    return result
                }
            } : undefined}
            onAdd={perm?.Create ? {
                question: (values)=>`Добавить:\nЦвет: ${values[0]}\nТолщина: ${thick.get(selectedThickId)}`,
                onAction: async (values) => {
                    const name = values[0] as string 
                    const result = await addMatSkladColor({ name, thickId: selectedThickId })
                    if (result.success) loadData()
                    return result
                }
            } : undefined} /> : <div></div>}
    </EditContainer>
}
