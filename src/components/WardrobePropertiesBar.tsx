import { PropertyType } from "../types/property"
import PropertyGrid from "./PropertyGrid"
import PropertyRow from "./PropertyRow"
import { useAtomValue, useSetAtom } from "jotai"
import { profileListAtom } from "../atoms/materials/profiles"
import { Profile } from "../types/materials"
import ComboBox from "./inputs/ComboBox"
import { appDataAtom, historyAppAtom, openStateAtom, redoAtom, resetAppDataAtom, saveStateAtom, setFasadCountAtom, setOrderAtom, setProfileAtom, setWardHeightAtom, setWardTypeAtom, setWardWidthAtom, undoAtom } from "../atoms/app"
import { WardTypes } from "../functions/wardrobe"
import useConfirm from "../custom-hooks/useConfirm"
import ImageButton from "./inputs/ImageButton"
import { userAtom } from "../atoms/users"
import TextBox from "./inputs/TextBox"
import { useMemo } from "react"
import { WARDROBE_TYPE } from "../types/wardrobe"
import { RESOURCE } from "../types/user"
const fasades = ["2", "3", "4", "5", "6"]
export default function WardrobePropertiesBar() {
    const user = useAtomValue(userAtom)
    const profileList = useAtomValue(profileListAtom)
    const profileNames = useMemo(() => profileList.map((p: Profile) => p.name), [profileList])
    const { order, profile, fasadCount, type, wardHeight, wardWidth } = useAtomValue(appDataAtom)
    const setOrder = useSetAtom(setOrderAtom)
    const setProfile = useSetAtom(setProfileAtom)
    const setFasadCount = useSetAtom(setFasadCountAtom)
    const setWardWidth = useSetAtom(setWardWidthAtom)
    const setWardHeight = useSetAtom(setWardHeightAtom)
    const setWardType = useSetAtom(setWardTypeAtom)
    const showConfirm = useConfirm()
    const resetAppData = useSetAtom(resetAppDataAtom)
    const saveState = useSetAtom(saveStateAtom)
    const openState = useSetAtom(openStateAtom)
    const { next, previous } = useAtomValue(historyAppAtom)
    const undo = useSetAtom(undoAtom)
    const redo = useSetAtom(redoAtom)
    const perm = user.permissions.get(RESOURCE.COMBIFASADES)
    const saveFileDisabled = !perm?.Create
    const readFileDisabled = !perm?.Read
    const wardTypes = useMemo(() => new Map([...WardTypes.entries()].filter(v => v[1] !== WARDROBE_TYPE.CORPUS)), [])
    const wardTypeChangeConfirm = async () => {
        return await showConfirm("При данном типе шкафа не получится сохранить все настройки фасадов и они будут сброшены. Продолжить?")
    }
    const wardHeightConfirm = async () => {
        return await showConfirm("При данной высоте шкафа не получится сохранить все настройки фасадов и они будут сброшены. Продолжить?")
    }
    const wardWidthConfirm = async () => {
        return await showConfirm("При данной ширине шкафа не получится сохранить все настройки фасадов и они будут сброшены. Продолжить?")
    }
    const wardProfileConfirm = async () => {
        return await showConfirm("При данном типе профиля не получится сохранить все настройки фасадов и они будут сброшены. Продолжить?")
    }
    const wardFasadCountConfirm = async () => {
        return await showConfirm("При данном кол-ве фасадов не получится сохранить все настройки фасадов и они будут сброшены. Продолжить?")
    }
    return <div className="properties-bar">
        <div className="d-flex flex-nowrap justify-content-between">
            <div>Параметры шкафа</div>
            <div className="d-flex flex-nowrap  align-self-center gap-2 h-100">
                <ImageButton title="Настройки по умолчанию" icon="new" onClick={async () => { if (await showConfirm("Сбросить в первоначальное состояние?")) resetAppData() }} />
                <ImageButton title="Открыть" icon="open" disabled={readFileDisabled} onClick={() => { openState() }} />
                <ImageButton title="Сохранить" icon="save" disabled={saveFileDisabled} onClick={() => { saveState() }} />
                <ImageButton title="Отменить" icon="undo" disabled={!previous} onClick={() => { undo() }} />
                <ImageButton title="Повторить" icon="redo" disabled={!next} onClick={() => { redo() }} />
            </div>
        </div>
        <hr />
        <PropertyGrid>
            <div className="text-end">Заказ: </div>
            <PropertyRow>
                <TextBox name="order" value={order} type={PropertyType.STRING} setValue={(value) => { setOrder(value as string) }} />
            </PropertyRow>
            <ComboBox title="Тип:" value={type} items={wardTypes} onChange={(_, value) => { 
                setWardType([value as WARDROBE_TYPE, wardTypeChangeConfirm])
            }} />
            <div className="text-end">Ширина: </div>
            <PropertyRow>
                <TextBox name="width" value={wardWidth} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={900} max={4000} setValue={(value) => { setWardWidth([+value, wardWidthConfirm]) }} submitOnLostFocus={true} />
            </PropertyRow>
            <div className="text-end">Высота: </div>
            <PropertyRow>
                <TextBox name="height" value={wardHeight} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={1800} max={2700} setValue={(value) => { setWardHeight([+value, wardHeightConfirm]) }} submitOnLostFocus={true} />
            </PropertyRow>
            <ComboBox title="Кол-во фасадов:" value={`${fasadCount}`} items={fasades} onChange={(_, value) => { setFasadCount([+value, wardFasadCountConfirm]) }} />
            <ComboBox title="Профиль:" value={profile?.name || ""} items={profileNames} onChange={(index) => { setProfile([profileList[index], wardProfileConfirm]); }} />
        </PropertyGrid>
    </div>
}