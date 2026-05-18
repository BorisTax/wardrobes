import { useEffect, useState } from "react"
import TableData, { TableDataRow } from "../../inputs/TableData"
import { useNavigate } from "react-router-dom"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import { InputType } from "../../../types/property"
import messages from "../../../server/messages"
import EditContainer from "../../EditContainer"
import { UserSchema } from "../../../types/schemas/userSchemas"
import { ExtMap } from "../../../atoms/storage"
import { addUser, deleteUser, loadUsers, updateUser } from "../../../atoms/users/users"
import { useAtomValue } from "jotai"
import { userAtom } from "../../../atoms/users"
import { RESOURCE } from "../../../types/user"

export default function EditUsers() {
    const navigate = useNavigate()
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.USERS)
    const [data, setData] = useState<ExtMap<UserSchema>>(new Map())
    const [selectedId, setSelectedId] = useState(0)
    const userList = [...data.keys()]
    const header = [{ caption: "id" }, { caption: "Имя" }]
    const content: TableDataRow[] = userList.map(id => ({ key: id, data: [id, data.get(id)?.name] }))
    const edit: EditDataItem[] = [
        { title: "Имя:", inputType: InputType.TEXT, value: data.get(selectedId)?.name || "", checkValue: value => ({ success: (value as string).trim() !== "", message: "Введите имя" }) },
        { title: "Пароль:", inputType: InputType.TEXT, value: "", message: messages.ENTER_PASSWORD, checkValue: (value) => checkPassword(value as string) },
    ]
    const loadData = () => {
        loadUsers().then(data => {
            setData(() => data);
            setSelectedId([...data.keys()][0] || 0)
        })
    }
    useEffect(() => {
        loadData()
    }, [])
    useEffect(() => {
        if (!perm?.Read) navigate("/")
    }, [perm?.Read, navigate])
    return <EditContainer>
            <TableData header={header} content={content} onSelectRow={(id) => setSelectedId(id as number)} />
        <EditDataSection items={edit}
            onAdd={{
                question: (values) => `Добавить:\nПользователь: ${values[0]}`,
                onAction: async (values) => {
                    const name = values[0] as string
                    const password = values[1] as string
                    const result = await addUser({ name, password })
                    if (result.success) loadData()
                    return result
                }
            }}
            onUpdate={{
                question: (values) => `Обновить:\nid=${selectedId}\nПользователь: ${values[0]}`,
                disabled: !data.has(selectedId),
                onAction: async (values) => {
                    const name = values[0] as string
                    const password = values[1] as string
                    const result = await updateUser({ id: selectedId, name, password })
                    if (result.success) loadData()
                    return result
                }
            }}
            onDelete={{
                question: () => `Удалить:\nid=${selectedId}\nПользователь: ${data.get(selectedId)?.name}`,
                disabled: !data.has(selectedId),
                onAction: async () => {
                    const result = await deleteUser(selectedId)
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