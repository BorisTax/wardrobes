import { useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { Profiles } from "../../../functions/materials"
import ComboBox from "../../inputs/ComboBox"
import { Profile, ProfileType } from "../../../types/materials"
import { addProfileAtom, deleteProfileAtom, profileListAtom, updateProfileAtom } from "../../../atoms/materials/profiles"
import messages from "../../../server/messages"
import { brushListAtom } from "../../../atoms/materials/brush"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import { InputType } from "../../../types/property"
import TableData from "../../TableData"
import EditContainer from "../../EditContainer"
import { userAtom } from "../../../atoms/users"
import { RESOURCE } from "../../../types/user"

export default function EditProfile() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MATERIALS)
    const profileAllList = useAtomValue(profileListAtom)
    const [{ type, profileIndex }, setState] = useState({ type: profileAllList[0].type, profileIndex: 0 })
    const profileList = profileAllList.filter(p => p.type === type)
    const bList = useAtomValue(brushListAtom)
    const brushList = useMemo(() => bList.map(b => b.name).toSorted(), [bList])
    useMemo(() => { setState({ type: profileAllList[0].type, profileIndex: 0 }) }, [profileAllList])
    const deleteProfile = useSetAtom(deleteProfileAtom)
    const addProfile = useSetAtom(addProfileAtom)
    const updateProfile = useSetAtom(updateProfileAtom)
    const profile = profileList[profileIndex]
    const heads = ['Наименование', 'Код', 'Щетка']
    const contents = profileList.map((i: Profile) => [i.name, i.code, i.brush])
    const editItems: EditDataItem[] = [
        { caption: "Наименование:", value: profile.name, message: "Введите наименование", type: InputType.TEXT },
        { caption: "Код:", value: profile.code, message: "Введите код", type: InputType.TEXT },
        { caption: "Щетка:", value: profile.brush, list: brushList, message: "Выберите щетку", type: InputType.LIST },
    ]
    return <EditContainer>
        <div>
            <div className="d-flex flex-nowrap gap-2 align-items-start">
                <ComboBox title="Тип: " value={type || ""} items={Profiles} onChange={(_, value: string) => { setState({ type: value as ProfileType, profileIndex: 0 }); }} />
            </div>
            <hr />
            <TableData heads={heads} content={contents} onSelectRow={(index) => { setState((prev) => ({ ...prev, profileIndex: index })) }} />
        </div>
        {(perm?.create || perm?.update || perm?.remove) ? <EditDataSection name={profile.name} items={editItems}
            onUpdate={perm?.update ? async (checked, values) => {
                const usedName = checked[0] ? values[0] : ""
                const usedCode = checked[1] ? values[1] : ""
                const usedBrush = checked[2] ? values[2] : ""
                const result = await updateProfile({ name, type, newName: usedName, newCode: usedCode, newBrush: usedBrush })
                return result
            } : undefined}
            onDelete={perm?.remove ? async () => {
                const result = await deleteProfile(profile)
                setState((prev) => ({ ...prev, profileIndex: 0 }))
                return result
            } : undefined}
            onAdd={perm?.create ? async (checked, values) => {
                const name = values[0] as string
                const code = values[1] as string
                const brush = values[2] as string
                if (profileList.find((p: Profile) => p.name === name && p.type === type)) { return { success: false, message: messages.MATERIAL_EXIST } }
                const result = await addProfile({ name, type, code, brush })
                return result
            } : undefined} /> : <div></div>}
    </EditContainer>
}
