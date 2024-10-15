import { useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { Profiles } from "../../../functions/materials"
import ComboBox from "../../inputs/ComboBox"
import { ProfileSchema } from "../../../types/materials"
import { ProfileType } from "../../../types/enums"
import { addProfileAtom, deleteProfileAtom, profileListAtom, updateProfileAtom } from "../../../atoms/materials/profiles"
import messages from "../../../server/messages"
import { brushListAtom } from "../../../atoms/materials/brush"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import { InputType } from "../../../types/property"
import TableData from "../../TableData"
import EditContainer from "../../EditContainer"
import { userAtom } from "../../../atoms/users"
import { RESOURCE } from "../../../types/user"
import { useMapValue } from "../../../custom-hooks/useMaterialMap"

export default function EditProfile() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MATERIALS)
    const profileAllList = useAtomValue(profileListAtom)
    const [{ type, profileIndex }, setState] = useState({ type: profileAllList[0].type, profileIndex: 0 })
    const profileList = profileAllList.filter(p => p.type === type)
    const bList = useAtomValue(brushListAtom)
    const brushList = useMemo(() => bList.toSorted((b1, b2) => b1.name > b2.name ? 1 : -1), [bList])
    const brushMap = useMapValue(brushList, value => value.name)
    const brushIdList = brushList.map(b => b.id)
    useMemo(() => { setState({ type: profileAllList[0].type, profileIndex: 0 }) }, [profileAllList])
    const deleteProfile = useSetAtom(deleteProfileAtom)
    const addProfile = useSetAtom(addProfileAtom)
    const updateProfile = useSetAtom(updateProfileAtom)
    const profile = profileList[profileIndex]
    const heads = ['Наименование', 'Код', 'Щетка']
    const contents = profileList.map((i: ProfileSchema) => [i.name, i.code, brushMap.get(i.brushId)])
    const editItems: EditDataItem[] = [
        { caption: "Наименование:", value: profile?.name, message: messages.ENTER_CAPTION, type: InputType.TEXT },
        { caption: "Код:", value: profile?.code, message: messages.ENTER_CODE, type: InputType.TEXT },
        { caption: "Щетка:", value: profile.brushId, valueCaption: value => brushMap.get(value), list: brushIdList, message: messages.ENTER_BRUSH, type: InputType.LIST },
    ]
    return <EditContainer>
        <div>
            <div className="d-flex flex-nowrap gap-2 align-items-start">
                <ComboBox<ProfileType> title="Тип: " value={type} items={[...Profiles.keys()]} displayValue={value => Profiles.get(value)} onChange={(_, value) => { setState({ type: value, profileIndex: 0 }); }} />
            </div>
            <hr />
            <TableData heads={heads} content={contents} onSelectRow={(index) => { setState((prev) => ({ ...prev, profileIndex: index })) }} />
        </div>
        {(perm?.Read) ? <EditDataSection name={profile.name} items={editItems}
            onUpdate={perm?.Update ? async (checked, values) => {
                const usedName = values[0] 
                const usedCode = values[1]
                const usedBrushId = values[2]
                const result = await updateProfile({ id: profile.id, type, name: usedName, code: usedCode, brushId: usedBrushId })
                return result
            } : undefined}
            onDelete={perm?.Delete ? async () => {
                const result = await deleteProfile(profile)
                if (result.success) setState((prev) => ({ ...prev, profileIndex: 0 }))
                return result
            } : undefined}
            onAdd={perm?.Create ? async (checked, values) => {
                const name = values[0] as string
                const code = values[1] as string
                const brushId = values[2] as number
                const result = await addProfile({ name, type, code, brushId })
                return result
            } : undefined} /> : <div></div>}
    </EditContainer>
}
