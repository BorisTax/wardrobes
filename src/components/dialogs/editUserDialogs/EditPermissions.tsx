import { useEffect, useState } from "react"
import messages from "../../../server/messages"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import { InputType } from "../../../types/property"
import TableData from "../../inputs/TableData"
import EditContainer from "../../EditContainer"
import { PermissionSchema, RESOURCE } from "../../../types/user"
import ComboBox from "../../inputs/ComboBox"
import { boolToYesNo } from "../../../functions/messages"
import { DefaultMap } from "../../../atoms/storage"
import { addPermissions, deletePermissions, loadPermissions, updatePermissions } from "../../../atoms/users/permissions"
import { loadRoles } from "../../../atoms/users/roles"
import { loadResources } from "../../../atoms/users/resources"
import { useAtomValue } from "jotai"
import { userAtom } from "../../../atoms/users"

export default function EditPermissions() {
    const { permissions: userPermissions } = useAtomValue(userAtom)
    const userPerm = userPermissions.get(RESOURCE.USERS)
    const [roles, setRoles] = useState<DefaultMap>(new Map())
    const [roleId, setRoleId] = useState(0)
    const [resources, setResources] = useState<DefaultMap>(new Map())
    const [permissions, setPermissions] = useState<PermissionSchema[]>([])
    const [selectedIndex, setSelectedIndex] = useState(0)
    const permList = permissions.filter(p => p.roleId === roleId) || []
    const { resourceId, create: Create, read: Read, update: Update, delete: Delete } = permList[selectedIndex] || {}
    const heads = [{ caption: 'Роль' }, { caption: 'Ресурс' }, { caption: 'Чтение' }, { caption: 'Создание' }, { caption: 'Обновление' }, { caption: 'Удаление' }]
    const contents = permList.map((p: PermissionSchema, index) => ({ key: index, data: [roles.get(p.roleId), resources.get(p.resourceId), boolToYesNo(p.read), boolToYesNo(p.create), boolToYesNo(p.update), boolToYesNo(p.delete)] }))
    const editItems: EditDataItem[] = [
        { title: "Роль:", value: roles.get(roleId) || "", inputType: InputType.TEXT,  readonly: true },
        { title: "Ресурс:", value: resourceId, displayValue: (value) => { return resources.get(value as number) || ""}, message: messages.ENTER_RESOURCE, inputType: InputType.LIST, list: [...resources.keys()] },
        { title: "Чтение:", value: Read, displayValue: (value) => boolToYesNo(value as boolean), message: "", inputType: InputType.CHECKBOX },
        { title: "Создание:", value: Create, displayValue: (value) => boolToYesNo(value as boolean), message: "", inputType: InputType.CHECKBOX },
        { title: "Обновление:", value: Update, displayValue: (value) => boolToYesNo(value as boolean), message: "", inputType: InputType.CHECKBOX },
        { title: "Удаление:", value: Delete, displayValue: (value) => boolToYesNo(value as boolean), message: "", inputType: InputType.CHECKBOX },
    ]
    const loadData = (roleId: number) => loadPermissions(roleId).then(data => { setPermissions(data); setSelectedIndex(0) })
    useEffect(() => {
        loadRoles().then(data => { setRoles(data); setRoleId([...data.keys()][0] || 0) })
        loadResources().then(data => setResources(data))
    }, [])
    useEffect(() => {
        loadData(roleId)
    }, [roleId])
    return <EditContainer>
        <div>
                <ComboBox<number> title="Роль: " value={roleId} items={[...roles.keys()]} displayValue={value => roles.get(value)} onChange={value => { setRoleId(value); }} />
            <hr />
            <TableData header={heads} content={contents} onSelectRow={(index) => { setSelectedIndex(index as number) }} />
        </div>
        <EditDataSection items={editItems}
            onUpdate={userPerm?.Update ? {
                disabled: !roles.has(roleId) || !resources.has(resourceId),
                question: (values) => `Обновить:\nРоль: ${values[0]}\nРесурс: ${values[1]}\nЧтение: ${values[2]}\nСоздание: ${values[3]}\nОбновление: ${values[4]}\nУдаление: ${values[5]}`,
                onAction: async (values) => {
                    const resourceId = values[1] as RESOURCE
                    const Read = values[2] as boolean 
                    const Create = values[3] as boolean 
                    const Update = values[4] as boolean
                    const Delete = values[5] as boolean 
                    const result = await updatePermissions({ roleId, resourceId, read: Read ? 1 : 0, create: Create ? 1 : 0, update: Update ? 1 : 0, delete: Delete ? 1 : 0 })
                    if(result.success) loadData(roleId)
                    return result
                }
        } : undefined}
            onDelete={userPerm?.Delete ? {
                disabled: !roles.has(roleId) || !resources.has(resourceId),
                question: (values) => `Удалить:\nРоль: ${values[0]}\nРесурс: ${values[1]}`,
                onAction: async () => {
                    const result = await deletePermissions(roleId, resourceId)
                    if(result.success) loadData(roleId)
                    return result
                }
         }: undefined}
            onAdd={userPerm?.Create ? {
                question: (values) => `Добавить:\nРоль: ${values[0]}\nРесурс: ${values[1]}\nЧтение: ${values[2]}\nСоздание: ${values[3]}\nОбновление: ${values[4]}\nУдаление: ${values[5]}`,
                onAction: async (values) => {
                    const resourceId = values[1] as RESOURCE
                    const Read = values[2] as boolean 
                    const Create = values[3] as boolean 
                    const Update = values[4] as boolean
                    const Delete = values[5] as boolean 
                    const result = await addPermissions({ roleId, resourceId, read: Read ? 1 : 0, create: Create ? 1 : 0, update: Update ? 1 : 0, delete: Delete ? 1 : 0 })
                    if(result.success) loadData(roleId)
                    return result
                }
            } : undefined} />
    </EditContainer>
}
