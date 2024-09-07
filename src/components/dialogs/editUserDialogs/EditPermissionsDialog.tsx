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
    const role = roles[roleIndex] || {id: 0, name: ""}
    const resourceList = useAtomValue(resourceAsMap)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const { resource, read: Read, create: Create, update: Update, delete: Delete } = permData[selectedIndex] || { resource: "", read: false, create: false, update: false, remove: false }
    const deletePermissions = useSetAtom(deletePermissionsAtom)
    const addPermissions = useSetAtom(addPermissionsAtom)
    const updatePermissions = useSetAtom(updatePermissionsAtom)
    const heads = ['Права', 'Чтение', 'Создание', 'Обновление', 'Удаление']
    const contents = permData.map((p: PERMISSIONS_SCHEMA) => [resourceList.get(p.resource), boolToYesNo(p.read as boolean), boolToYesNo(p.create as boolean), boolToYesNo(p.update as boolean), boolToYesNo(p.delete as boolean)])
    const editItems: EditDataItem[] = [
        { caption: "Роль:", value: role.name, message: messages.ENTER_ROLE, type: InputType.TEXT, readonly: true },
        { caption: "Права:", value: resource, valueCaption: (value) => { return resourceList.get(value) }, message: messages.ENTER_RESOURCE, type: InputType.LIST, list: resourceList },
        { caption: "Чтение:", value: Read, valueCaption: (value) => boolToYesNo(value as boolean), message: "", type: InputType.CHECKBOX },
        { caption: "Создание:", value: Create, valueCaption: (value) => boolToYesNo(value as boolean), message: "", type: InputType.CHECKBOX },
        { caption: "Обновление:", value: Update, valueCaption: (value) => boolToYesNo(value as boolean), message: "", type: InputType.CHECKBOX },
        { caption: "Удаление:", value: Delete, valueCaption: (value) => boolToYesNo(value as boolean), message: "", type: InputType.CHECKBOX },
    ]
    useEffect(() => {
        setRoleIndex(0)
    }, [roles])
    useEffect(() => {
        setSelectedIndex(0)
    }, [permData])
    useEffect(() => {
        loadPermissions(role.id)
    }, [role, loadPermissions])
    useEffect(() => {
        loadResources()
    }, [loadResources])
    return <EditContainer>
        <div>
            <div className="d-flex flex-nowrap gap-2 align-items-start position-relative">
                <ComboBox title="Роль: " value={role.name} items={userRoles} onChange={(index) => { setRoleIndex(index); }} />
                {perm?.Create && <ImageButton title="Добавить" icon='add' onClick={() => { addUserRoleDialogRef.current?.showModal() }} />}
                {perm?.Delete && <ImageButton title="Удалить" icon='delete' onClick={async () => {
                    if (await showConfirm("Удалить роль " + role.name)) {
                        setLoading(true)
                        const result = await deleteRole({ id: role.id })
                        setLoading(false)
                        showMessage(rusMessages[result.message as string])
                    }
                }} />}
            </div>
            <hr />
            <TableData heads={heads} content={contents} onSelectRow={(index) => { setSelectedIndex(index) }} />
            <AddUserRoleDialog dialogRef={addUserRoleDialogRef} setLoading={(state: boolean) => setLoading(state)} />
            {loading && <div className="spinner-container" onClick={(e) => { e.stopPropagation() }}><div className="spinner"></div></div>}
        </div>
        <EditDataSection name={String(role.id)} items={editItems}
            onUpdate={perm?.Update ? async (checked, values) => {
                const newResource = checked[1] ? values[1] : resource
                const newRead = checked[2] ? values[2] as boolean : Read
                const newCreate = checked[3] ? values[3] as boolean : Create
                const newUpdate = checked[4] ? values[4] as boolean : Update
                const newRemove = checked[5] ? values[5] as boolean : Delete
                const result = await updatePermissions(role.id, newResource as RESOURCE, { Read: newRead, Create: newCreate, Update: newUpdate, Delete: newRemove })
                return result
            } : undefined}
            onDelete={perm?.Delete ? async () => {
                const result = await deletePermissions(role.id, resource)
                setSelectedIndex(0)
                return result
            } : undefined}
            onAdd={perm?.Create ? async (checked, values) => {
                const newResource = checked[1] ? values[1] : resource
                const newRead = checked[2] ? values[2] as boolean : Read
                const newCreate = checked[3] ? values[3] as boolean : Create
                const newUpdate = checked[4] ? values[4] as boolean : Update
                const newRemove = checked[5] ? values[5] as boolean : Delete
                if (permData.find(p => p.roleId === role.id && p.resource === newResource)) { return { success: false, message: messages.PERMISSION_EXIST } }
                const result = await addPermissions(role.id, newResource as RESOURCE, { Read: newRead, Create: newCreate, Update: newUpdate, Delete: newRemove })
                return result
            } : undefined} />
    </EditContainer>
}
