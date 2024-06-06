import { PropertyType } from "../types/property"
import PropertyGrid from "./PropertyGrid"
import PropertyRow from "./PropertyRow"
import { useAtomValue, useSetAtom } from "jotai"
import { profileListAtom } from "../atoms/materials/profiles"
import { Profile } from "../types/materials"
import ComboBox from "./ComboBox"
import { appDataAtom, historyAppAtom, openStateAtom, redoAtom, resetAppDataAtom, saveStateAtom, setFasadCountAtom, setOrderAtom, setProfileAtom, setWardHeightAtom, setWardTypeAtom, setWardWidthAtom, undoAtom } from "../atoms/app"
import { WardType } from "../types/app"
import { WardTypes } from "../functions/wardrobe"
import useConfirm from "../custom-hooks/useConfirm"
import ImageButton from "./ImageButton"
import { userAtom } from "../atoms/users"
import { isClientAtLeast } from "../server/functions/user"
import TextBox from "./TextBox"
import { useMemo } from "react"
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
    const disabledFiles = !isClientAtLeast(user.role)
    const wardTypeChangeConfirm = () => new Promise<boolean>((resolve) => {
        showConfirm("При данном типе шкафа не получится сохранить все настройки фасадов и они будут сброшены. Продолжить?", () => { resolve(true) }, () => { resolve(false) })
    })
    const wardHeightConfirm = () => new Promise<boolean>((resolve) => {
        showConfirm("При данной высоте шкафа не получится сохранить все настройки фасадов и они будут сброшены. Продолжить?", () => { resolve(true) }, () => { resolve(false) })
    })
    const wardWidthConfirm = () => new Promise<boolean>((resolve) => {
        showConfirm("При данной ширине шкафа не получится сохранить все настройки фасадов и они будут сброшены. Продолжить?", () => { resolve(true) }, () => { resolve(false) })
    })
    const wardProfileConfirm = () => new Promise<boolean>((resolve) => {
        showConfirm("При данном типе профиля не получится сохранить все настройки фасадов и они будут сброшены. Продолжить?", () => { resolve(true) }, () => { resolve(false) })
    })
    const wardFasadCountConfirm = () => new Promise<boolean>((resolve) => {
        showConfirm("При данном кол-ве фасадов не получится сохранить все настройки фасадов и они будут сброшены. Продолжить?", () => { resolve(true) }, () => { resolve(false) })
    })
    return <div className="properties-bar">
        <div className="d-flex flex-nowrap justify-content-between">
            <div>Параметры шкафа</div>
            <div className="d-flex flex-nowrap  align-self-center gap-2 h-100">
                <ImageButton title="Настройки по умолчанию" icon="new" onClick={() => { showConfirm("Сбросить в первоначальное состояние?", () => resetAppData()) }} />
                <ImageButton title="Открыть" icon="open" disabled={disabledFiles} onClick={() => { openState() }} />
                <ImageButton title="Сохранить" icon="save" disabled={disabledFiles} onClick={() => { saveState() }} />
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
            <ComboBox title="Тип:" value={type} items={WardTypes} onChange={(_, value) => { setWardType([value as WardType, wardTypeChangeConfirm]) }} />
            <div className="text-end">Высота: </div>
            <PropertyRow>
                <TextBox name="height" value={wardHeight} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={1900} max={2700} setValue={(value) => { setWardHeight([+value, wardHeightConfirm]) }} />
            </PropertyRow>
            <div className="text-end">Ширина: </div>
            <PropertyRow>
                <TextBox name="width" value={wardWidth} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={900} max={3000} setValue={(value) => { setWardWidth([+value, wardWidthConfirm]) }} />
            </PropertyRow>
            <ComboBox title="Кол-во фасадов:" value={`${fasadCount}`} items={fasades} onChange={(_, value) => { setFasadCount([+value, wardFasadCountConfirm]) }} />
            <ComboBox title="Профиль:" value={profile?.name || ""} items={profileNames} onChange={(index) => { setProfile([profileList[index], wardProfileConfirm]); }} />
        </PropertyGrid>
    </div>
}