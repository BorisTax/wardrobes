import { useEffect, useMemo, useRef, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import messages from "../../../server/messages"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import { InputType } from "../../../types/property"
import TableData from "../../TableData"
import EditContainer from "../../EditContainer"
import { deleteRoleAtom, userAtom, userRolesAtom } from "../../../atoms/users"
import { PERMISSIONS_SCHEMA, RESOURCE } from "../../../types/user"
import { addPermissionsAtom, deletePermissionsAtom, loadPermissionsAtom, loadResourceListAtom, permissionsAtom, resourceAsMap, updatePermissionsAtom } from "../../../atoms/permissions"
import ComboBox from "../../inputs/ComboBox"
import AddUserRoleDialog from "./AddUserRoleDialog"
import ImageButton from "../../inputs/ImageButton"
import { boolToYesNo, rusMessages } from "../../../functions/messages"
import useMessage from "../../../custom-hooks/useMessage"
import useConfirm from "../../../custom-hooks/useConfirm"

export default function EditPermissionsDialog() {
    const [loading, setLoading] = useState(false)
    const showMessage = useMessage()
    const showConfirm = useConfirm()
    const loadPermissions = useSetAtom(loadPermissionsAtom)
    const loadResources = useSetAtom(loadResourceListAtom)
    const addUserRoleDialogRef = useRef<HTMLDialogElement>(null)
    const perm = useAtomValue(userAtom).permissions.get(RESOURCE.USERS)
    const permData = useAtomValue(permissionsAtom)
    const roles = useAtomValue(userRolesAtom)
    const userRoles = useMemo(() => roles.map(r => r.name), [roles])
    const deleteRole = useSetAtom(deleteRoleAtom)
    const [roleIndex, setRoleIndex] = useState(0)
    const role = userRoles[roleIndex] || ""
    const resourceList = useAtomValue(resourceAsMap)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const { resource, read, create, update, remove } = permData[selectedIndex] || { resource: "", read: false, create: false, update: false, remove: false }
    const deletePermissions = useSetAtom(deletePermissionsAtom)
    const addPermissions = useSetAtom(addPermissionsAtom)
    const updatePermissions = useSetAtom(updatePermissionsAtom)
    const heads = ['Права', 'Чтение', 'Создание', 'Обновление', 'Удаление']
    const contents = permData.map((p: PERMISSIONS_SCHEMA) => [resourceList.get(p.resource), boolToYesNo(p.read as boolean), boolToYesNo(p.create as boolean), boolToYesNo(p.update as boolean), boolToYesNo(p.remove as boolean)])
    const editItems: EditDataItem[] = [
        { caption: "Роль:", value: role || "", message: "Выберите роль", type: InputType.TEXT, readonly: true },
        { caption: "Права:", value: resource, valueCaption: (value) => { return resourceList.get(value) }, message: "Выберите ресурс", type: InputType.LIST, list: resourceList },
        { caption: "Чтение:", value: read, valueCaption: (value) => boolToYesNo(value as boolean), message: "", type: InputType.CHECKBOX },
        { caption: "Создание:", value: create, valueCaption: (value) => boolToYesNo(value as boolean), message: "", type: InputType.CHECKBOX },
        { caption: "Обновление:", value: update, valueCaption: (value) => boolToYesNo(value as boolean), message: "", type: InputType.CHECKBOX },
        { caption: "Удаление:", value: remove, valueCaption: (value) => boolToYesNo(value as boolean), message: "", type: InputType.CHECKBOX },
    ]
    useEffect(() => {
        setRoleIndex(0)
    }, [roles])
    useEffect(() => {
        setSelectedIndex(0)
    }, [permData])
    useEffect(() => {
        loadPermissions(role)
    }, [role, loadPermissions])
    useEffect(() => {
        loadResources()
    }, [loadResources])
    return <EditContainer>
        <div>
            <div className="d-flex flex-nowrap gap-2 align-items-start position-relative">
                <ComboBox title="Роль: " value={role} items={userRoles} onChange={(index) => { setRoleIndex(index); }} />
                {perm?.create && <ImageButton title="Добавить" icon='add' onClick={() => { addUserRoleDialogRef.current?.showModal() }} />}
                {perm?.remove && <ImageButton title="Удалить" icon='delete' onClick={() => showConfirm("Удалить роль " + role, async () => {
                    setLoading(true)
                    const result = await deleteRole({ name: role })
                    setLoading(false)
                    showMessage(rusMessages[result.message as string])
                }
                )} />}
            </div>
            <hr />
            <TableData heads={heads} content={contents} onSelectRow={(index) => { setSelectedIndex(index) }} />
            <AddUserRoleDialog dialogRef={addUserRoleDialogRef} setLoading={(state: boolean) => setLoading(state)} />
            {loading && <div className="spinner-container" onClick={(e) => { e.stopPropagation() }}><div className="spinner"></div></div>}
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
            onDelete={perm?.remove ? async () => {
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
