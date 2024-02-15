import InputField from "./InputField"
import { PropertyType } from "../types/property"
import PropertyGrid from "./PropertyGrid"
import PropertyRow from "./PropertyRow"
import { useAtom, useSetAtom } from "jotai"
import { profileListAtom } from "../atoms/profiles"
import { Profile } from "../types/materials"
import ComboBox from "./ComboBox"
import { appDataAtom, setFasadCountAtom, setProfileAtom, setWardHeightAtom, setWardTypeAtom, setWardWidthAtom } from "../atoms/app"
import { WardType } from "../types/app"
import { WardTypes } from "../functions/wardrobe"
import useConfirm from "../custom-hooks/useConfirm"
const fasades = ["2", "3", "4", "5", "6"]
export default function WardrobePropertiesBar() {
    //const [activeProfileIndex, setActiveProfileIndex] = useAtom(activeProfileIndexAtom)
    const [profileList] = useAtom(profileListAtom)
    const [{ profile, fasadCount, type, wardHeight, wardWidth }] = useAtom(appDataAtom)
    const setProfile = useSetAtom(setProfileAtom)
    const setFasadCount = useSetAtom(setFasadCountAtom)
    const setWardWidth = useSetAtom(setWardWidthAtom)
    const setWardHeight = useSetAtom(setWardHeightAtom)
    const setWardType = useSetAtom(setWardTypeAtom)
    const showConfirm = useConfirm()
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
        <div>Параметры шкафа</div>
        <hr />
        <PropertyGrid>
            <ComboBox title="Тип:" value={type} items={WardTypes} onChange={(_, value) => { setWardType([value as WardType, wardTypeChangeConfirm]) }} />
            <div className="text-end">Высота: </div>
            <PropertyRow>
                <InputField value={wardHeight} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={1900} max={2700} setValue={(value) => { setWardHeight([+value, wardHeightConfirm]) }} />
            </PropertyRow>
            <div className="text-end">Ширина: </div>
            <PropertyRow>
                <InputField value={wardWidth} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={900} max={3000} setValue={(value) => { setWardWidth([+value, wardWidthConfirm]) }} />
            </PropertyRow>
            <ComboBox title="Кол-во фасадов:" value={`${fasadCount}`} items={fasades} onChange={(_, value) => { setFasadCount([+value, wardFasadCountConfirm]) }} />
            <ComboBox title="Профиль:" value={profile?.name || ""} items={profileList.map((p: Profile) => p.name)} onChange={(index) => { setProfile([profileList[index], wardProfileConfirm]); }} />
        </PropertyGrid>
    </div>
}