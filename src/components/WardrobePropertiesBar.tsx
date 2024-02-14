import InputField from "./InputField"
import { PropertyTypes } from "../types/propertyTypes"
import PropertyGrid from "./PropertyGrid"
import PropertyRow from "./PropertyRow"
import { useAtom, useSetAtom } from "jotai"
import { profileListAtom } from "../atoms/profiles"
import { Profile } from "../types/materials"
import ComboBox from "./ComboBox"
import { appDataAtom, setFasadCountAtom, setProfileAtom, setWardHeightAtom, setWardTypeAtom, setWardWidthAtom } from "../atoms/app"
import { WardType } from "../types/app"
import { WardTypes } from "../functions/wardrobe"
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
    return <div className="properties-bar">
        <div>Параметры шкафа</div>
        <hr />
        <PropertyGrid>
            <ComboBox title="Тип:" value={type} items={WardTypes} onChange={(_, value) => { setWardType(value as WardType) }} />
            <div className="text-end">Высота: </div>
            <PropertyRow>
                <InputField value={wardHeight} type={PropertyTypes.INTEGER_POSITIVE_NUMBER} min={1900} setValue={(value) => { setWardHeight(+value) }} />
            </PropertyRow>
            <div className="text-end">Ширина: </div>
            <PropertyRow>
                <InputField value={wardWidth} type={PropertyTypes.INTEGER_POSITIVE_NUMBER} min={900} setValue={(value) => { setWardWidth(+value) }} />
            </PropertyRow>
            <ComboBox title="Кол-во фасадов:" value={`${fasadCount}`} items={fasades} onChange={(_, value) => { setFasadCount(+value) }} />
            <ComboBox title="Профиль:" value={profile?.name || ""} items={profileList.map((p: Profile) => p.name)} onChange={(index) => { setProfile(profileList[index]); }} />
        </PropertyGrid>
    </div>
}