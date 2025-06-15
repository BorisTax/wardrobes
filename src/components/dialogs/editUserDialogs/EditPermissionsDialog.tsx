import { useEffect, useRef, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import messages from "../../../server/messages"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import { InputType } from "../../../types/property"
import TableData from "../../inputs/TableData"
import EditContainer from "../../EditContainer"
import { deleteRoleAtom, userAtom, userRolesAtom } from "../../../atoms/users"
import { PermissionSchema, RESOURCE } from "../../../types/user"
import { addPermissionsAtom, deletePermissionsAtom, loadPermissionsAtom, permissionsAtom, resourceListAtom, updatePermissionsAtom } from "../../../atoms/permissions"
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
    const addUserRoleDialogRef = useRef<HTMLDialogElement>(null)
    const perm = useAtomValue(userAtom).permissions.get(RESOURCE.USERS)
    const permData = useAtomValue(permissionsAtom)
    const roles = useAtomValue(userRolesAtom)
    const deleteRole = useSetAtom(deleteRoleAtom)
    const [roleId, setRoleId] = useState([...roles.keys()][0] || 0)
    const resources = useAtomValue(resourceListAtom)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const { resourceId, read: Read, create: Create, update: Update, delete: Delete } = permData[selectedIndex] || { resourceId: 0, read: false, create: false, update: false, remove: false }
    const deletePermissions = useSetAtom(deletePermissionsAtom)
    const addPermissions = useSetAtom(addPermissionsAtom)
    const updatePermissions = useSetAtom(updatePermissionsAtom)
    const heads = [{ caption: 'Права' }, { caption: 'Чтение' }, { caption: 'Создание' }, { caption: 'Обновление' }, { caption: 'Удаление' }]
    const contents = permData.map((p: PermissionSchema, index) => ({ key: index, data: [resources.get(p.resourceId), boolToYesNo(p.read), boolToYesNo(p.create), boolToYesNo(p.update), boolToYesNo(p.delete)] }))
    const editItems: EditDataItem[] = [
        { title: "Роль:", value: roles.get(roleId) || "", message: messages.ENTER_ROLE, inputType: InputType.TEXT, readonly: true },
        { title: "Права:", value: resourceId, displayValue: (value) => { return resources.get(value as number) || ""}, message: messages.ENTER_RESOURCE, inputType: InputType.LIST, list: [...resources.keys()] },
        { title: "Чтение:", value: Read, displayValue: (value) => boolToYesNo(value as boolean), message: "", inputType: InputType.CHECKBOX },
        { title: "Создание:", value: Create, displayValue: (value) => boolToYesNo(value as boolean), message: "", inputType: InputType.CHECKBOX },
        { title: "Обновление:", value: Update, displayValue: (value) => boolToYesNo(value as boolean), message: "", inputType: InputType.CHECKBOX },
        { title: "Удаление:", value: Delete, displayValue: (value) => boolToYesNo(value as boolean), message: "", inputType: InputType.CHECKBOX },
    ]
    useEffect(() => {
        setRoleId([...roles.keys()][0] || 0)
    }, [roles])
    useEffect(() => {
        setSelectedIndex(0)
    }, [permData])
    useEffect(() => {
        loadPermissions(roleId)
    }, [roleId, loadPermissions])
    return <EditContainer>
        <div>
            <div className="d-flex flex-nowrap gap-2 align-items-start position-relative">
                <ComboBox<number> title="Роль: " value={roleId} items={[...roles.keys()]} displayValue={value => roles.get(value)} onChange={value => { setRoleId(value); }} />
                {perm?.Create && <ImageButton title="Добавить" icon='add' onClick={() => { addUserRoleDialogRef.current?.showModal() }} />}
                {perm?.Delete && <ImageButton title="Удалить" icon='delete' onClick={async () => {
                    if (await showConfirm("Удалить роль " + roles.get(roleId))) {
                        setLoading(true)
                        const result = await deleteRole({ id: roleId })
                        setLoading(false)
                        showMessage(rusMessages[result.message as string])
                    }
                }} />}
            </div>
            <hr />
            <TableData header={heads} content={contents} onSelectRow={(index) => { setSelectedIndex(index as number) }} />
            <AddUserRoleDialog dialogRef={addUserRoleDialogRef} setLoading={(state: boolean) => setLoading(state)} />
            {loading && <div className="spinner-container" onClick={(e) => { e.stopPropagation() }}><div className="spinner"></div></div>}
        </div>
        <EditDataSection name={resources.get(resourceId)} items={editItems}
            onUpdate={perm?.Update ? async (checked, values) => {
                const newResource = checked[1] ? values[1] : resourceId
                const newRead = checked[2] ? values[2] as boolean : Read
                const newCreate = checked[3] ? values[3] as boolean : Create
                const newUpdate = checked[4] ? values[4] as boolean : Update
                const newRemove = checked[5] ? values[5] as boolean : Delete
                const result = await updatePermissions({ roleId, resourceId: newResource as RESOURCE, read: newRead ? 1 : 0, create: newCreate ? 1 : 0, update: newUpdate ? 1 : 0, delete: newRemove ? 1 : 0 })
                return result
            } : undefined}
            onDelete={perm?.Delete ? async () => {
                const result = await deletePermissions(roleId, resourceId)
                setSelectedIndex(0)
                return result
            } : undefined}
            onAdd={perm?.Create ? async (checked, values) => {
                const newResource = checked[1] ? values[1] : resourceId
                const newRead = checked[2] ? values[2] as boolean : Read
                const newCreate = checked[3] ? values[3] as boolean : Create
                const newUpdate = checked[4] ? values[4] as boolean : Update
                const newRemove = checked[5] ? values[5] as boolean : Delete
                if (permData.find(p => p.roleId === roleId && p.resourceId === newResource)) { return { success: false, message: messages.PERMISSION_EXIST } }
                const result = await addPermissions({roleId, resourceId: newResource as RESOURCE,  read: newRead ? 1 : 0, create: newCreate ? 1 : 0, update: newUpdate ? 1 : 0, delete: newRemove ? 1 : 0 })
                return result
            } : undefined} />
    </EditContainer>
}
