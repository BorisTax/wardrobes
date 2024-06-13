import { useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { Profiles } from "../../../functions/materials"
import ComboBox from "../../ComboBox"
import { Profile, ProfileType } from "../../../types/materials"
import useMessage from "../../../custom-hooks/useMessage"
import useConfirm from "../../../custom-hooks/useConfirm"
import { addProfileAtom, deleteProfileAtom, profileListAtom, updateProfileAtom } from "../../../atoms/materials/profiles"
import { rusMessages } from "../../../functions/messages"
import messages from "../../../server/messages"
import { EditDialogProps } from "../EditMaterialDialog"
import { brushListAtom } from "../../../atoms/materials/brush"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import { InputType } from "../../../types/property"
import TableData from "../TableData"

export default function EditProfile(props: EditDialogProps) {
    const profileAllList = useAtomValue(profileListAtom)
    const [{ type, profileIndex }, setState] = useState({ type: profileAllList[0].type, profileIndex: 0 })
    const profileList = profileAllList.filter(p => p.type === type)
    const bList = useAtomValue(brushListAtom)
    const brushList = useMemo(() => bList.map(b => b.name).toSorted(), bList)
    useMemo(() => { setState({ type: profileAllList[0].type, profileIndex: 0 }) }, [profileAllList])
    const deleteProfile = useSetAtom(deleteProfileAtom)
    const addProfile = useSetAtom(addProfileAtom)
    const updateProfile = useSetAtom(updateProfileAtom)
    const showMessage = useMessage()
    const showConfirm = useConfirm()
    const profile = profileList[profileIndex]
    const heads = ['Наименование', 'Код', 'Щетка']
    const contents = profileList.map((i: Profile) => [i.name, i.code, i.brush])
    const editItems: EditDataItem[] = [
        { caption: "Наименование:", value: profile.name, message: "Введите наименование", type: InputType.TEXT },
        { caption: "Код:", value: profile.code, message: "Введите код", type: InputType.TEXT  },
        { caption: "Щетка:", value: profile.brush, list: brushList, message: "Выберите щетку", type: InputType.LIST },
    ]
    return <>
        <div className="d-flex flex-nowrap gap-2 align-items-start">
            <ComboBox title="Тип: " value={type || ""} items={Profiles} onChange={(_, value: string) => { setState({ type: value as ProfileType, profileIndex: 0 }); }} />
        </div>
        <hr />
        <TableData heads={heads} content={contents} onSelectRow={(index) => { setState((prev) => ({ ...prev, profileIndex: index })) }} />
        <EditDataSection name={profile.name} items={editItems}
            onUpdate={(checked, values, message) => {
                showConfirm(message, () => {
                    props.setLoading(true)
                    const usedName = checked[0] ? values[0] : ""
                    const usedCode = checked[1] ? values[1] : ""
                    const usedBrush = checked[2] ? values[2] : ""
                    updateProfile({ name, type, newName: usedName, newCode: usedCode, newBrush: usedBrush }, (result) => {
                        props.setLoading(false)
                        showMessage(rusMessages[result.message])
                    })
                })
            }}
            onDelete={(name, message) => {
                showConfirm(message, () => {
                    props.setLoading(true)
                    deleteProfile(profile, (result) => {
                        props.setLoading(false)
                        showMessage(rusMessages[result.message])
                    });
                    setState((prev) => ({ ...prev, profileIndex: 0 }))
                })
            }}
            onAdd={(checked, values, message) => {
                const name = values[0]
                const code = values[1]
                const brush = values[2]
                if (profileList.find((p: Profile) => p.name === name && p.type === type)) { showMessage(rusMessages[messages.PROFILE_EXIST]); return }
                showConfirm(message, () => {
                    props.setLoading(true)
                    addProfile({ name, type, code, brush }, (result) => {
                        props.setLoading(false)
                        showMessage(rusMessages[result.message])
                    });
                })
            }} />
    </>
}
