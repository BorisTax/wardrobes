import Fasad from "../classes/Fasad"
import ComboBox from "./ComboBox"
import { Division, FasadMaterial, SandBase } from "../types/enums"
import InputField from "./InputField"
import { PropertyType } from "../types/property"
import PropertyGrid from "./PropertyGrid"
import PropertyRow from "./PropertyRow"
import ToggleButton from "./ToggleButton"
import { ExtMaterial } from "../types/materials"
import ImageButton from "./ImageButton"
import { useAtom, useSetAtom } from "jotai"
import { activeFasadAtom, activeRootFasadIndexAtom, divideFasadAtom, setActiveFasadAtom, setExtMaterialAtom, setFixedHeightAtom, setFixedWidthAtom, setHeightAtom, setMaterialAtom, setProfileDirectionAtom, setSandBaseAtom, setWidthAtom } from "../atoms/fasades"
import { UserRoles, userAtom } from "../atoms/users"
import { materialListAtom } from "../atoms/materials"
import { editMaterialDialogAtom } from "../atoms/dialogs"
import { Materials, SandBases, SandBasesCaptions } from "../functions/materials"
import { appDataAtom } from "../atoms/app"
const sections = ["1", "2", "3", "4", "5", "6", "7", "8"]
export default function PropertiesBar() {
    const [fasad] = useAtom(activeFasadAtom)
    const { width, height, material, extmaterial, sandBase, materials, direction, directions, sectionCount, fixHeight, fixWidth, disabledWidth, disabledHeight, disabledFixHeight, disabledFixWidth } = getProperties(fasad)
    const [user] = useAtom(userAtom)
    const [materialList] = useAtom(materialListAtom)
    const [activeRootFasadIndex] = useAtom(activeRootFasadIndexAtom)
    const [{ rootFasades }] = useAtom(appDataAtom)
    const setHeight = useSetAtom(setHeightAtom)
    const setWidth = useSetAtom(setWidthAtom)
    const setFixedWidth = useSetAtom(setFixedWidthAtom)
    const setFixedHeight = useSetAtom(setFixedHeightAtom)
    const setMaterial = useSetAtom(setMaterialAtom)
    const setExtMaterial = useSetAtom(setExtMaterialAtom)
    const setSandBase = useSetAtom(setSandBaseAtom)
    const setProfileDirection = useSetAtom(setProfileDirectionAtom)
    const divideFasad = useSetAtom(divideFasadAtom)
    const setActiveFasad = useSetAtom(setActiveFasadAtom)
    const [editMaterialDialog] = useAtom(editMaterialDialogAtom)
    let extMaterials: ExtMaterial[] = materialList.get(material) || [{ name: "", material: "" }]
    if (user.role === UserRoles.GUEST) extMaterials = extMaterials.filter((_, index: number) => index === 0) || []
    return <div className="properties-bar" onClick={(e) => { e.stopPropagation() }}>
        <div>Параметры фасада<span>{` (${activeRootFasadIndex + 1} из ${rootFasades.length})`}</span></div>
        <hr />
        <PropertyGrid>
            <div className="text-end">Высота: </div>
            <PropertyRow>
                <InputField value={height} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={100} setValue={(value) => { setHeight(+value) }} disabled={disabledHeight} />
                <ToggleButton pressed={fixHeight} iconPressed="fix" iconUnPressed="unfix" title="Зафиксировать высоту" disabled={disabledFixHeight} onClick={() => { setFixedHeight(!fixHeight) }} />
            </PropertyRow>
            <div className="text-end">Ширина: </div>
            <PropertyRow>
                <InputField value={width} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={100} setValue={(value) => { setWidth(+value) }} disabled={disabledWidth} />
                <ToggleButton pressed={fixWidth} iconPressed="fix" iconUnPressed="unfix" title="Зафиксировать ширину" disabled={disabledFixWidth} onClick={() => { setFixedWidth(!fixWidth) }} />
            </PropertyRow>
            <ComboBox title="Материал:" value={material} items={materials} disabled={!fasad} onChange={(_, value: string) => { setMaterial(value as FasadMaterial) }} />
            <ComboBox title="Цвет/Рисунок:" value={extmaterial} items={extMaterials.map((m: ExtMaterial) => m.name)} disabled={!extMaterials} onChange={(_, value) => { setExtMaterial(value) }} />
            <ComboBox title="Основа:" value={sandBase || ""} items={sandBase ? SandBases : []} disabled={fasad?.Material !== FasadMaterial.SAND} onChange={(_, value) => { setSandBase(value as SandBase) }} />
            <ComboBox title="Направление профиля:" value={direction} items={directions} disabled={!fasad} onChange={(_, value) => { setProfileDirection(value) }} />
            <ComboBox title="Кол-во секций:" value={sectionCount} items={sections} disabled={!fasad} onChange={(_, value) => { divideFasad(+value) }} />
        </PropertyGrid>
        <hr />
        <ImageButton title="Выбрать секцию" icon="selectParent" disabled={!((fasad !== null) && (fasad.Parent !== null))} onClick={() => { setActiveFasad(fasad ? fasad.Parent : null) }} />
        {user.role === UserRoles.ADMIN || user.role === UserRoles.SUPERADMIN ?
            <ImageButton title="Редактор материалов" icon="editMaterials" onClick={() => { editMaterialDialog?.current?.showModal() }} /> : <></>}
    </div>
}

function getProperties(fasad: Fasad | null) {
    const width = fasad?.cutWidth || 0
    const height = fasad?.cutHeight || 0
    const material = fasad?.Material || ""
    const extmaterial = fasad?.ExtMaterial || ""
    const sandBase = (fasad?.Material === FasadMaterial.SAND && fasad?.SandBase) || ""
    const materials = fasad ? Materials : []
    const directions: Map<string, string> = new Map()
    directions.set("Вертикально", Division.WIDTH)
    directions.set("Горизонтально", Division.HEIGHT)
    const direction = fasad?.Division === Division.HEIGHT ? "Горизонтально" : "Вертикально"
    const sectionCount = (fasad && (fasad.Children.length > 1)) ? `${fasad.Children.length}` : "1"
    const fixWidth = fasad?.FixedWidth() || false
    const fixHeight = fasad?.FixedHeight() || false
    let disabledWidth = !fasad || !fasad.Parent || fasad.FixedWidth()
    let disabledHeight = !fasad || !fasad.Parent || fasad.FixedHeight()
    const disabledFixWidth = !fasad
    const disabledFixHeight = !fasad
    disabledWidth = disabledWidth || !!(fasad?.Parent && fasad.Level <= 1 && fasad.Parent.Division === Division.HEIGHT)
    disabledHeight = disabledHeight || !!(fasad?.Parent && fasad.Level <= 1 && fasad.Parent.Division === Division.WIDTH)
    return { width, height, material, extmaterial, sandBase, materials, direction, directions, sectionCount, fixHeight, fixWidth, disabledWidth, disabledHeight, disabledFixHeight, disabledFixWidth }
}