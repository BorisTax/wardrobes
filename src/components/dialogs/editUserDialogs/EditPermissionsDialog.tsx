import { useEffect, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import messages from "../../../server/messages"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import { InputType } from "../../../types/property"
import TableData from "../../TableData"
import EditContainer from "../../EditContainer"
import { userAtom, userRolesAsMap } from "../../../atoms/users"
import { PERMISSIONS_SCHEMA, RESOURCE } from "../../../types/user"
import { addPermissionsAtom, deletePermissionsAtom, loadPermissionsAtom, loadResourceListAtom, permissionsAtom, resourceAsMap, updatePermissionsAtom } from "../../../atoms/permissions"
import ComboBox from "../../ComboBox"

export default function EditPermissionsDialog() {
    const loadPermissions = useSetAtom(loadPermissionsAtom)
    const loadResources = useSetAtom(loadResourceListAtom)
    const perm = useAtomValue(userAtom).permissions.get(RESOURCE.MATERIALS)
    const permData = useAtomValue(permissionsAtom)
    const userRoles = useAtomValue(userRolesAsMap)
    const [role, setRole] = useState(userRoles.keys().next().value)
    const resourceList = useAtomValue(resourceAsMap)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const { resource, read, create, update, remove } = permData[selectedIndex] || { resource: "", read: false, create: false, update: false, remove: false }
    const deletePermissions = useSetAtom(deletePermissionsAtom)
    const addPermissions = useSetAtom(addPermissionsAtom)
    const updatePermissions = useSetAtom(updatePermissionsAtom)
    const heads = ['Ресурс', 'Чтение', 'Создание', 'Обновление', 'Удаление']
    const contents = permData.map((p: PERMISSIONS_SCHEMA) => [resourceList.get(p.resource), p.read, p.create, p.update, p.remove])
    const editItems: EditDataItem[] = [
        { caption: "Роль:", value: role || "", message: "Выберите роль", type: InputType.LIST, list: userRoles },
        { caption: "Ресурс:", value: resource, message: "Выберите ресурс", type: InputType.LIST, list: resourceList },
        { caption: "Чтение:", value: read, message: "", type: InputType.CHECKBOX },
        { caption: "Создание:", value: create, message: "", type: InputType.CHECKBOX },
        { caption: "Обновление:", value: update, message: "", type: InputType.CHECKBOX },
        { caption: "Удаление:", value: remove, message: "", type: InputType.CHECKBOX },
    ]
    useEffect(() => {
        setSelectedIndex(0)
    }, [permData])
    useEffect(() => {
        loadPermissions(role)
    }, [role])
    useEffect(() => {
        loadResources()
    }, [])
    return <EditContainer>
        <div>
            <div className="d-flex flex-nowrap gap-2 align-items-start">
                <ComboBox title="Роль: " value={role} items={userRoles} onChange={(_, value: string) => { setRole(value); }} />
            </div>
            <hr />
            <TableData heads={heads} content={contents} onSelectRow={(index) => { setSelectedIndex(index) }} />
        </div>
        <EditDataSection name={role} items={editItems}
            onUpdate={perm?.update ? async (checked, values) => {
                const newRole = checked[0] ? values[0] : role
                const newResource = checked[1] ? values[1] : resource
                const newRead = checked[2] ? values[2] as boolean : read
                const newCreate = checked[3] ? values[3] as boolean : create
                const newUpdate = checked[4] ? values[4] as boolean : update
                const newRemove = checked[5] ? values[5] as boolean : remove
                const result = await updatePermissions(newRole as string, newResource as RESOURCE, { read: newRead, create: newCreate, update: newUpdate, remove: newRemove })
                return result
            } : undefined}
            onDelete={perm?.remove ? async (name) => {
                const result = await deletePermissions(role, resource)
                setSelectedIndex(0)
                return result
            } : undefined}
            onAdd={perm?.create ? async (checked, values) => {
                const newRole = checked[0] ? values[0] : role
                const newResource = checked[1] ? values[1] : resource
                const newRead = checked[2] ? values[2] as boolean : read
                const newCreate = checked[3] ? values[3] as boolean : create
                const newUpdate = checked[4] ? values[4] as boolean : update
                const newRemove = checked[5] ? values[5] as boolean : remove
                if (permData.find(p => p.role === newRole && p.resource === newResource)) { return { success: false, message: messages.PERMISSION_EXIST } }
                const result = await addPermissions(newRole as string, newResource as RESOURCE, { read: newRead, create: newCreate, update: newUpdate, remove: newRemove })
                return result
            } : undefined} />
    </EditContainer>
}
