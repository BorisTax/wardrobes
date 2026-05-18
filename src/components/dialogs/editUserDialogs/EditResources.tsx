import { useEffect, useState } from "react"
import { useAtomValue } from "jotai"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import { InputType, PropertyType } from "../../../types/property"
import TableData from "../../inputs/TableData"
import EditContainer from "../../EditContainer"
import { userAtom } from "../../../atoms/users"
import { RESOURCE } from "../../../types/user"
import { addResource, deleteResource, loadResources, updateResource } from "../../../atoms/users/resources"
import { DefaultMap } from "../../../atoms/storage"

export default function EditResources() {
    const perm = useAtomValue(userAtom).permissions.get(RESOURCE.USERS)
    const [resources, setResources] = useState(new Map())
    const resList = [...resources.keys()]
    const [selectedId, setSelectedId] = useState(resList[0] || 0)
    const heads = [{ caption: 'id' }, { caption: 'Ресурс' }]
    const contents = resList.map(k => ({ key: k, data: [k, resources.get(k)] }))
    const editItems: EditDataItem[] = [
        { title: "id:", value: selectedId, inputType: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER, checkValue: value => ({ success: value !== 0, message: "Введите ID" }) },
        { title: "Ресурс:", value: resources.get(selectedId) || "", inputType: InputType.TEXT, checkValue: value => ({ success: (value as string).trim() !== "", message: "Введите ресурс" }) },
    ]
    const loadData = () => {
        loadResources().then(resources => setResources(resources as DefaultMap))
    }
    useEffect(() => {
        loadData()
    }, [])
    return <EditContainer>
        <div>
            <hr />
            <TableData rowNumbers={false} header={heads} content={contents} onSelectRow={(index) => { setSelectedId(index as number) }} />
        </div>
        <EditDataSection items={editItems}
            onUpdate={perm?.Update ? {
                question: (values)=>`Обновить ресурс:\nid=${values[0]}\n${values[1]}`,
                disabled: !resources.has(selectedId),
                onAction: async (values) => {
                    const id = values[0] as number
                    const name = values[1] as string
                    const result = await updateResource({ id, name })
                    if(result.success) loadData()
                    return result
                }
        } : undefined}
            onDelete={perm?.Delete ? {
                question: (values)=>`Удалить ресурс:\nid=${selectedId}\n${resources.get(selectedId)}`,
                disabled: !resources.has(selectedId),
                onAction: async () => {
                    const result = await deleteResource(selectedId)
                    if(result.success) loadData()
                    return result
                }
        } : undefined}
            onAdd={perm?.Create ? {
                question: (values)=>`Добавить ресурс:\nid=${values[0]}\n${values[1]}`,
                onAction: async (values) => {
                    const id = values[0] as number
                    const name = values[1] as string
                    const result = await addResource({ id, name })
                    if(result.success) loadData()
                    return result
                } 
            }: undefined} />
    </EditContainer>
}
