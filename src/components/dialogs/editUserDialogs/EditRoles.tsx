import { useEffect, useState } from "react"
import TableData, { TableDataRow } from "../../inputs/TableData"
import { useNavigate } from "react-router-dom"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import { InputType } from "../../../types/property"
import messages from "../../../server/messages"
import EditContainer from "../../EditContainer"
import { DefaultMap } from "../../../atoms/storage"
import { useAtomValue } from "jotai"
import { userAtom } from "../../../atoms/users"
import { RESOURCE } from "../../../types/user"
import { addRole, deleteRole, loadRoles, updateRole } from "../../../atoms/users/roles"

export default function EditRoles() {
    const navigate = useNavigate()
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.USERS)
    const [data, setData] = useState<DefaultMap>(new Map())
    const [selectedId, setSelectedId] = useState(0)
    const userList = [...data.keys()]
    const header = [{ caption: "id" }, { caption: "Роль" }]
    const content: TableDataRow[] = userList.map(id => ({ key: id, data: [id, data.get(id)] }))
    const edit: EditDataItem[] = [
        { title: "Роль:", inputType: InputType.TEXT, value: data.get(selectedId) || "", checkValue: value => ({ success: (value as string).trim() !== "", message: "Введите имя" }) },
    ]
    const loadData = () => {
        loadRoles().then(data => {
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
                question: (values) => `Добавить:\nРоль: ${values[0]}`,
                onAction: async (values) => {
                    const name = values[0] as string
                    const result = await addRole({ name })
                    if (result.success) loadData()
                    return result
                }
            }}
            onUpdate={{
                question: (values) => `Обновить:\nid=${selectedId}\nРоль: ${values[0]}`,
                disabled: !data.has(selectedId),
                onAction: async (values) => {
                    const name = values[0] as string
                    const result = await updateRole({ id: selectedId, name })
                    if (result.success) loadData()
                    return result
                }
            }}
            onDelete={{
                question: () => `Удалить:\nid=${selectedId}\nРоль: ${data.get(selectedId)}`,
                disabled: !data.has(selectedId),
                onAction: async () => {
                    const result = await deleteRole(selectedId)
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