import { useEffect, useState } from "react"
import TableData, { TableDataRow } from "../../inputs/TableData"
import { useNavigate } from "react-router-dom"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import { InputType } from "../../../types/property"
import messages from "../../../server/messages"
import EditContainer from "../../EditContainer"
import { DefaultMap, ExtMap } from "../../../atoms/storage"
import { useAtomValue } from "jotai"
import { userAtom } from "../../../atoms/users"
import { RESOURCE } from "../../../types/user"
import { loadRoles } from "../../../atoms/users/roles"
import { UserRolesSchema } from "../../../types/schemas/userSchemas"
import { addUserRole, deleteUserRole, loadUserRoles, updateUserRole } from "../../../atoms/users/userroles"
import { useUsers } from "../../../custom-hooks/users"

export default function EditUserRoles() {
    const navigate = useNavigate()
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.USERS)
    const users = useUsers()
    const [roles, setRoles] = useState<DefaultMap>(new Map())
    const [data, setData] = useState<ExtMap<UserRolesSchema>>(new Map())
    const [selectedId, setSelectedId] = useState(0)
    const { userId, roleId } = data.get(selectedId) || { userId: 0, roleId: 0 }
    const dataList = [...data.keys()]
    const header = [{ caption: "id" }, { caption: "Пользователь" }, { caption: "Роль" }]
    const content: TableDataRow[] = dataList.map(id => ({ key: id, data: [id, users.get(data.get(id)?.userId || 0)?.name, roles.get(data.get(id)?.roleId || 0)] }))
    const edit: EditDataItem[] = [
        { title: "Пользователь:", inputType: InputType.LIST, list: [...users.keys()], value: userId, displayValue: value => users.get(value as number)?.name || "", checkValue: value => ({ success: (value as number) !== 0, message: "Выберите пользователя" }) },
        { title: "Роль:", inputType: InputType.LIST, list: [...roles.keys()], value: roleId, displayValue: value => roles.get(value as number) || "", checkValue: value => ({ success: (value as number) !== 0, message: "Выберите роль" }) },
    ]
    const loadData = () => {
        loadUserRoles().then(data => {
            setData(() => data);
            setSelectedId([...data.keys()][0] || 0)
        })
    }
    useEffect(() => {
        loadRoles().then(data => setRoles(data))
        loadData()
    }, [])
    useEffect(() => {
        if (!perm?.Read) navigate("/")
    }, [perm?.Read, navigate])
    return <EditContainer>
            <TableData header={header} content={content} onSelectRow={(id) => setSelectedId(id as number)} />
        <EditDataSection items={edit}
            onAdd={{
                question: (values) => `Добавить:\nПользователь: ${values[0]}\nРоль: ${values[1]}`,
                onAction: async (values) => {
                    const userId = values[0] as number
                    const roleId = values[1] as number
                    const result = await addUserRole({ userId, roleId })
                    if (result.success) loadData()
                    return result
                }
            }}
            onUpdate={{
                question: (values) => `Обновить:\nid=${selectedId}\nПользователь: ${values[0]}\nРоль: ${values[1]}`,
                disabled: !data.has(selectedId),
                onAction: async (values) => {
                    const userId = values[0] as number
                    const roleId = values[1] as number
                    const result = await updateUserRole({ id: selectedId, userId, roleId })
                    if (result.success) loadData()
                    return result
                }
            }}
            onDelete={{
                question: () => `Удалить:\nid=${selectedId}\nПользователь: ${users.get(userId)?.name}\nРоль: ${roles.get(roleId)}`,
                disabled: !data.has(selectedId),
                onAction: async () => {
                    const result = await deleteUserRole(selectedId)
                    if (result.success) loadData()
                    return result
                }
            }
            } />
    </EditContainer>
}

function checkPassword(pass: string): {success: boolean, message: string}{
    if(pass.match("[^a-zA-Z0-9]")) return {success: false, message: messages.PASSWORD_INCORRECT}
    if(pass.length<=3) return {success: false, message: messages.PASSWORD_SHORT}
    return { success: true, message: "" }
}