import { useEffect, useMemo, useState } from "react"
import ComboBox from "./inputs/ComboBox"
import PropertyGrid from "./inputs/PropertyGrid"
import { CONSOLE_TYPE, DETAIL_NAME, WARDROBE_TYPE } from "../types/wardrobe"
import { PropertyType } from "../types/property"
import { useAtomValue, useSetAtom } from "jotai"
import { CHAR_PURPOSE, FASAD_TYPE } from "../types/enums"
import TextBox from "./inputs/TextBox"
import { WARDROBE_KIND } from "../types/wardrobe"
import WardrobeSpecification from "./WardrobeSpecification"
import { getInitExtComplect, getInitFasades, initFasades, setWardrobeDataAtom, wardrobeDataAtom } from "../atoms/wardrobe"
import CheckBox from "./inputs/CheckBox"
import { useDetail } from "../custom-hooks/useDetail"
import useConfirm from "../custom-hooks/useConfirm"
import { showDetailDialogAtom } from "../atoms/dialogs"
import EditDetailDialog from "./dialogs/EditDetailDialog"
import { consoleTypesAtom, ExtMap, wardrobeAtom, wardrobesDimensionsAtom, wardrobesFasadCountAtom, wardrobeTypesAtom, wardrobeUseAtom } from "../atoms/storage"
import { fasadTypesToCharAtom } from "../atoms/materials/chars"
import { profileAtom } from "../atoms/materials/profiles"
import { charAtom, charPurposeAtom } from "../atoms/materials/chars"
import { CharsSchema } from "../types/schemas"
import { useDefaultFasadChars } from "../custom-hooks/materials"
import { getInitialWardrobeDimensions } from "../functions/wardrobe"
import Selector from "./inputs/Selector"

const numbers = [0, 1, 2, 3, 4, 5, 6]
const styles = { fontStyle: "italic", color: "gray" }
const maxFasades = 6
const consoleWidth = [150, 200, 250, 300, 350, 400, 450, 500]
export default function WardrobeCalculator() {
    const wardTypes = useAtomValue(wardrobeTypesAtom)
    const wardTypeUse = useAtomValue(wardrobeUseAtom)
    const wardKinds = useAtomValue(wardrobeAtom)
    const wardKindsKeys = [...wardKinds.keys()].filter(k => wardTypeUse.get(k))
    const consoleTypes = useAtomValue(consoleTypesAtom)
    const data = useAtomValue(wardrobeDataAtom)
    const wardrobesDimensions = useAtomValue(wardrobesDimensionsAtom)
    const wardrobesFasadCount = useAtomValue(wardrobesFasadCountAtom)
    const setData = useSetAtom(setWardrobeDataAtom)
    const chars = useAtomValue(charAtom)
    const { dspDefaultId, fmpDefaultId, lacobelDefaultId, mirrorDefaultId, sandDefaultId } = useDefaultFasadChars()
    const [showExt, setShowExt] = useState(false)
    const { dsp16List, dsp10List, mirrorList, fmpList, sandList, lacobelList } = useMaterials(chars)
    const profiles = useAtomValue(profileAtom)
    const { wardrobeId: wardKind, wardrobeTypeId: wardType, width, depth, height, dspId, fasades, profileId, extComplect } = data
    const { minWidth, maxWidth: maxPrevWidth, minHeight, maxHeight, minDepth, maxDepth, editDepth, editHeight, editWidth } = getInitialWardrobeDimensions(wardKind, wardrobesDimensions)
    const maxWidth = wardType === WARDROBE_TYPE.SYSTEM ? 5000: maxPrevWidth
    const totalFasades = Object.values(fasades).reduce((a, f) => f.count + a, 0)
    const [{ consoleSameHeight, consoleSameDepth, standSameHeight }, setConsoles] = useState({ consoleSameHeight: true, consoleSameDepth: true, standSameHeight: true })
    const extStand = useDetail(DETAIL_NAME.INNER_STAND, data.wardrobeTypeId, data.wardrobeId, data.width, data.height, data.depth) || { length: 0 }
    const confirm = useConfirm()
    const showEditDetails = useSetAtom(showDetailDialogAtom)
    useEffect(() => {
        if (standSameHeight) setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, stand: { ...prev.extComplect.stand, height: extStand.length } } }))
    }, [extStand.length, standSameHeight, setData])
    useEffect(() => {
        const newHeight = consoleSameHeight ? height : extComplect.console.height
        const newDepth = consoleSameDepth ? depth : extComplect.console.depth
        setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, console: { ...prev.extComplect.console, height: newHeight, depth: newDepth } } }))
    }, [depth, height, setData, consoleSameDepth, consoleSameHeight, extComplect.console.depth, extComplect.console.height])
    return <div className="wardrobe-calculator-container">
        <div>
            <div className="wardrobe-param-container">
                <div className="text-center">Основные параметры</div>
                <PropertyGrid style={{ padding: "0.5em", border: "1px solid" }}>
                    <ComboBox<WARDROBE_TYPE> disabled={data.schema} title="Тип шкафа:" value={wardType} items={[...wardTypes.keys()]} displayValue={value => wardTypes.get(value)} onChange={value => { setData(prev => ({ ...prev, wardrobeTypeId: value, fasades: getInitFasades({...prev, wardrobeTypeId: value}, wardrobesFasadCount, dspDefaultId), extComplect: getInitExtComplect(prev.height, prev.depth) })) }} />
                    {wardType !== WARDROBE_TYPE.SYSTEM && 
                        <ComboBox<WARDROBE_KIND> disabled={data.schema} title="Серия шкафа:" value={wardKind} items={wardKindsKeys} displayValue={value => wardKinds.get(value)} 
                            onChange={value => { 
                                const dims = getInitialWardrobeDimensions(value, wardrobesDimensions); 
                                setData(prev => ({ ...prev, 
                                                    wardrobeId: value, 
                                                    width: dims.defaultWidth, 
                                                    height: dims.defaultHeight, 
                                                    depth: dims.defaultDepth, 
                                                    fasades: getInitFasades({...prev, wardrobeId: value, width: dims.defaultWidth, height: dims.defaultHeight, depth: dims.defaultDepth}, wardrobesFasadCount, dspDefaultId), 
                                                    extComplect: getInitExtComplect(prev.height, prev.depth) })) }} 
                            />}
                    <CheckBox caption="схемный" checked={data.schema} disabled={data.wardrobeTypeId === WARDROBE_TYPE.SYSTEM} onChange={async () => {
                        if (data.schema) {
                            if (await confirm("Все изменения в деталировке будут сброшены. Продолжить?")) setData(prev => ({ ...prev, schema: !data.schema }))
                        } else setData(prev => ({ ...prev, schema: !data.schema }));
                    }} />
                    {data.schema ? <input type="button" value="Редактор деталей" onClick={() => { showEditDetails() }} /> : <div></div>}
                    <div className="text-end">Ширина: </div>
                    <TextBox disabled={data.schema || !editWidth} value={width} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={minWidth} max={maxWidth} setValue={(value) => { setData(prev => ({ ...prev, width: +value, fasades: getInitFasades({...prev, width: +value}, wardrobesFasadCount, dspDefaultId) })) }} submitOnLostFocus={true} />
                    {wardType !== WARDROBE_TYPE.SYSTEM && wardKind !== WARDROBE_KIND.CORNER && <>
                        <div className="text-end">Глубина: </div>
                        <TextBox disabled={data.schema || !editDepth} value={depth} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={minDepth} max={maxDepth} setValue={(value) => { setData(prev => ({ ...prev, depth: +value })) }} submitOnLostFocus={true} />

                    </>}
                    <div className="text-end">Высота: </div>
                    <TextBox disabled={data.schema || !editHeight} value={height} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={minHeight} max={maxHeight} setValue={(value) => { setData(prev => ({ ...prev, height: +value })) }} submitOnLostFocus={true} />
                    {wardType !== WARDROBE_TYPE.SYSTEM && <ComboBox<number> title="Цвет ДСП:" value={dspId} items={dsp16List} displayValue={value => chars.get(value)?.name} onChange={value => { setData(prev => ({ ...prev, dspId: value })) }} />}
                    {wardType !== WARDROBE_TYPE.GARDEROB && <ComboBox<number> title="Цвет профиля:" value={profileId} items={[...profiles.keys()]} displayValue={value => chars.get(profiles.get(value)?.charId || 0)?.name || ""} onChange={value => { setData(prev => ({ ...prev, profileId: value })) }} />}
                </PropertyGrid>
                {wardType !== WARDROBE_TYPE.GARDEROB && <PropertyGrid style={{ padding: "0.5em", border: "1px solid" }}>
                    <div className="text-end">Фасадов всего: </div>
                    <div className="d-flex align-items-center justify-content-between"><div>{totalFasades}</div><div className="small-button" role="button" onClick={() => { setData(prev => ({ ...prev, fasades: initFasades })) }}>Сбросить</div></div>
                    <Selector<number> title="ДСП:" value={fasades.dsp.count} items={numbers} displayValue={value => `${value}`} onChange={value => { if (+value + totalFasades - fasades.dsp.count <= maxFasades) setData(prev => ({ ...prev, fasades: { ...fasades, dsp: { count: +value, matId: new Array(+value).fill(dspDefaultId) } } })) }} />
                    {fasades.dsp.count > 0 && fasades.dsp.matId.map((m, i) => <ComboBox<number> styles={styles} key={"dsp" + i} title={`${i + 1}`} items={dsp10List} value={fasades.dsp.matId[i]} displayValue={value => chars.get(value)?.name} onChange={value => { const matId = [...fasades.dsp.matId]; matId[i] = value; setData(prev => ({ ...prev, fasades: { ...prev.fasades, dsp: { ...prev.fasades.dsp, matId } } })) }} />)}
                    <Selector<number> title="Зеркало:" value={fasades.mirror.count} items={numbers} displayValue={value => `${value}`} onChange={value => { if (+value + totalFasades - fasades.mirror.count <= maxFasades) setData(prev => ({ ...prev, fasades: { ...fasades, mirror: { count: +value, matId: new Array(+value).fill(mirrorDefaultId) } } })) }} />
                    {fasades.mirror.count > 0 && fasades.mirror.matId.map((m, i) => <ComboBox<number> styles={styles} key={"mirror" + i} title={`${i + 1}`} items={mirrorList} value={fasades.mirror.matId[i]} displayValue={value => chars.get(value)?.name} onChange={value => { const matId = [...fasades.mirror.matId]; matId[i] = value; setData(prev => ({ ...prev, fasades: { ...prev.fasades, mirror: { ...prev.fasades.mirror, matId } } })) }} />)}
                    <Selector<number> title="ФМП:" value={fasades.fmp.count} items={numbers} displayValue={value => `${value}`} onChange={value => { if (+value + totalFasades - fasades.fmp.count <= maxFasades) setData(prev => ({ ...prev, fasades: { ...fasades, fmp: { count: +value, matId: new Array(+value).fill(fmpDefaultId) } } })) }} />
                    {fasades.fmp.count > 0 && fasades.fmp.matId.map((m, i) => <ComboBox<number> styles={styles} key={"fmp" + i} title={`${i + 1}`} items={fmpList} value={fasades.fmp.matId[i]} displayValue={value => chars.get(value)?.name} onChange={value => { const matId = [...fasades.fmp.matId]; matId[i] = value; setData(prev => ({ ...prev, fasades: { ...prev.fasades, fmp: { ...prev.fasades.fmp, matId } } })) }} />)}
                    <Selector<number> title="Пескоструй:" value={fasades.sand.count} items={numbers} displayValue={value => `${value}`} onChange={value => { if (+value + totalFasades - fasades.sand.count <= maxFasades) setData(prev => ({ ...prev, fasades: { ...fasades, sand: { count: +value, matId: new Array(+value).fill(sandDefaultId) } } })) }} />
                    {fasades.sand.count > 0 && fasades.sand.matId.map((m, i) => <ComboBox<number> styles={styles} key={"sand" + i} title={`${i + 1}`} items={sandList} value={fasades.sand.matId[i]} displayValue={value => chars.get(value)?.name} onChange={value => { const matId = [...fasades.sand.matId]; matId[i] = value; setData(prev => ({ ...prev, fasades: { ...prev.fasades, sand: { ...prev.fasades.sand, matId } } })) }} />)}
                    <Selector<number> title="Лакобель:" value={fasades.lacobel.count} items={numbers} displayValue={value => `${value}`} onChange={value => { if (+value + totalFasades - fasades.lacobel.count <= maxFasades) setData(prev => ({ ...prev, fasades: { ...fasades, lacobel: { count: +value, matId: new Array(+value).fill(lacobelDefaultId) } } })) }} />
                    {fasades.lacobel.count > 0 && fasades.lacobel.matId.map((m, i) => <ComboBox<number> styles={styles} key={"lacobel" + i} title={`${i + 1}`} items={lacobelList} value={fasades.lacobel.matId[i]} displayValue={value => chars.get(value)?.name} onChange={value => { const matId = [...fasades.lacobel.matId]; matId[i] = value; setData(prev => ({ ...prev, fasades: { ...prev.fasades, lacobel: { ...prev.fasades.lacobel, matId } } })) }} />)}
                </PropertyGrid>}
            </div>
            {wardType !== WARDROBE_TYPE.SYSTEM && <div className="wardrobe-param-container">
                <div className={`text-center ${showExt ? "toggle-section-button-show" : "toggle-section-button-hidden"}`} role="button" onClick={() => setShowExt(!showExt)}>Доп. комплектация</div>
                <PropertyGrid hidden={!showExt} style={{ padding: "0.5em", border: "1px solid" }}>
                    <div></div><div className="d-flex align-items-center justify-content-between"><div></div><div className="small-button" role="button" onClick={() => { setData(prev => ({ ...prev, extComplect: getInitExtComplect(prev.height, prev.depth) })); setConsoles({ consoleSameDepth: true, consoleSameHeight: true, standSameHeight: true }) }}>Сбросить</div></div>
                    <div className="text-end">Телескоп: </div>
                    <CheckBox checked={extComplect.telescope ? true : false} onChange={() => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, telescope: 1 - extComplect.telescope } })) }} />
                    <hr /><hr />
                    <div className="text-end">Консоль: </div>
                    <CheckBox checked={extComplect.console.count ? true : false} onChange={() => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, console: { ...prev.extComplect.console, count: 1 - extComplect.console.count } } })) }} />
                    {extComplect.console.count ? <>
                        <div className="d-flex flex-column align-items-end">
                            <div className="text-end">Высота консоли: </div>
                            <CheckBox styles={{ fontSize: "0.8em" }} checked={consoleSameHeight} caption="как у шкафа" onChange={() => { setConsoles(prev => ({ ...prev, consoleSameHeight: !consoleSameHeight })); if (!consoleSameHeight) setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, console: { ...prev.extComplect.console, height: prev.height } } })) }} />
                        </div>
                        <TextBox disabled={consoleSameHeight} value={extComplect.console.height} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={0} max={3000} setValue={(value) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, console: { ...prev.extComplect.console, height: +value } } })) }} />
                        <div className="d-flex flex-column align-items-end">
                            <div className="text-end">Глубина консоли: </div>
                            <CheckBox styles={{ fontSize: "0.8em" }} checked={consoleSameDepth} caption="как у шкафа" onChange={() => { setConsoles(prev => ({ ...prev, consoleSameDepth: !consoleSameDepth })); if (!consoleSameDepth) setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, console: { ...prev.extComplect.console, depth: prev.depth } } })) }} />
                        </div>
                        <TextBox disabled={consoleSameDepth} value={extComplect.console.depth} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={0} max={800} setValue={(value) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, console: { ...prev.extComplect.console, depth: +value } } })) }} />
                        <ComboBox<number> title="Ширина консоли:" items={consoleWidth} value={extComplect.console.width} displayValue={value => `${value}`} onChange={value => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, console: { ...prev.extComplect.console, width: +value } } })) }} />
                        <ComboBox<CONSOLE_TYPE> title="Тип консоли:" value={extComplect.console.typeId} items={[...consoleTypes.keys()]} displayValue={value => consoleTypes.get(value)} onChange={value => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, console: { ...prev.extComplect.console, typeId: value } } })) }} />
                    <hr /><hr />
                    </> : <></>}
                    <div className="text-end">Козырек: </div>
                    <CheckBox checked={extComplect.blinder ? true : false} onChange={() => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, blinder: 1 - extComplect.blinder } })) }} />
                    <div className="text-end">Полка доп (плат) </div>
                    <CheckBox checked={extComplect.shelfPlat ? true : false} onChange={() => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, shelfPlat: 1 - extComplect.shelfPlat } })) }} />
                    <hr /><hr />
                    <div className="text-end">Стойка (доп) </div>
                    <CheckBox checked={extComplect.stand.count ? true : false} onChange={() => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, stand: { ...prev.extComplect.stand, count: 1 - extComplect.stand.count } } })) }} />
                    {extComplect.stand.count ? <>
                        <div className="d-flex flex-column align-items-end">
                            <div className="text-end">Размер: </div>
                            <CheckBox styles={{ fontSize: "0.8em" }} checked={standSameHeight} caption="как у шкафа" onChange={() => { setConsoles(prev => ({ ...prev, standSameHeight: !standSameHeight })); }} />
                        </div>
                        <TextBox disabled={standSameHeight} value={standSameHeight ? extStand.length : extComplect.stand.height} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={0} max={2750} setValue={(value) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, stand: { ...prev.extComplect.stand, height: +value } } })) }} />
                        <hr /><hr />
                    </> : <></>}
                </PropertyGrid>
            </div>}
        </div>
        <WardrobeSpecification />
        <EditDetailDialog />
    </div>
}

function useMaterials(chars: ExtMap<CharsSchema>) {
    const fasadTypeToChar = useAtomValue(fasadTypesToCharAtom)
    const charPurpose = useAtomValue(charPurposeAtom)
    const dsp16List = useMemo(() => charPurpose.filter(c => c.purposeId !== CHAR_PURPOSE.FASAD).map(s => s.charId).toSorted((d1, d2) => (chars.get(d1)?.name || "") > (chars.get(d2)?.name || "") ? 1 : -1), [chars, charPurpose])
    const dsp10List = useMemo(() => charPurpose.filter(c => c.purposeId !== CHAR_PURPOSE.CORPUS).map(s => s.charId).toSorted((d1, d2) => (chars.get(d1)?.name || "") > (chars.get(d2)?.name || "") ? 1 : -1), [chars, charPurpose])
    const mirrorList = useMemo(() => fasadTypeToChar.filter(f => f.id === FASAD_TYPE.MIRROR).map(f => f.charId).toSorted((d1, d2) => (chars.get(d1)?.name || "") > (chars.get(d2)?.name || "") ? 1 : -1), [chars, fasadTypeToChar])
    const fmpList = useMemo(() => fasadTypeToChar.filter(f => f.id === FASAD_TYPE.FMP).map(f => f.charId).toSorted((d1, d2) => (chars.get(d1)?.name || "") > (chars.get(d2)?.name || "") ? 1 : -1), [chars, fasadTypeToChar])
    const sandList = useMemo(() => fasadTypeToChar.filter(f => f.id === FASAD_TYPE.SAND).map(f => f.charId).toSorted((d1, d2) => (chars.get(d1)?.name || "") > (chars.get(d2)?.name || "") ? 1 : -1), [chars, fasadTypeToChar])
    const lacobelList = useMemo(() => fasadTypeToChar.filter(f => f.id === FASAD_TYPE.LACOBEL).map(f => f.charId).toSorted((d1, d2) => (chars.get(d1)?.name || "") > (chars.get(d2)?.name || "") ? 1 : -1), [chars, fasadTypeToChar])
    return {
        dsp16List,
        dsp10List,
        mirrorList,
        fmpList,
        sandList,
        lacobelList
    }
}


