import { useEffect, useMemo, useState } from "react"
import ComboBox from "./inputs/ComboBox"
import PropertyGrid from "./PropertyGrid"
import { CONSOLE_TYPE, DETAIL_NAME, WARDROBE_TYPE } from "../types/wardrobe"
import { PropertyType } from "../types/property"
import { materialListAtom } from "../atoms/materials/materials"
import { useAtomValue, useSetAtom } from "jotai"
import { FASAD_TYPE, MAT_PURPOSE } from "../types/enums"
import { profileListAtom } from "../atoms/materials/profiles"
import TextBox from "./inputs/TextBox"
import { WARDROBE_KIND } from "../types/wardrobe"
import WardrobeSpecification from "./WardrobeSpecification"
import { consoleTypesAtom, getInitExtComplect, initFasades, setWardrobeDataAtom, wardrobeDataAtom, wardrobeKindsAtom, wardrobeTypesAtom } from "../atoms/wardrobe"
import { RESOURCE } from "../types/user"
import { userAtom } from "../atoms/users"
import CheckBox from "./inputs/CheckBox"
import { useDetail } from "../custom-hooks/useDetail"
import useConfirm from "../custom-hooks/useConfirm"
import { showDetailDialogAtom } from "../atoms/dialogs"
import EditDetailDialog from "./dialogs/EditDetailDialog"
import { FasadMaterial, Profile } from "../types/materials"
import { useMaterialMap, useProfileNamesMap } from "../custom-hooks/useMaterialMap"

const numbers = [0, 1, 2, 3, 4, 5, 6]
const styles = { fontStyle: "italic", color: "gray" }
const maxFasades = 6
const consoleWidth = [150, 200, 250, 300, 350, 400, 450, 500]
export default function WardrobeCalculator() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.SPECIFICATION)
    const wardTypes = useAtomValue(wardrobeTypesAtom)
    const wardKinds = useAtomValue(wardrobeKindsAtom)
    const consoleTypes = useAtomValue(consoleTypesAtom)
    const data = useAtomValue(wardrobeDataAtom)
    const setData = useSetAtom(setWardrobeDataAtom)
    const materialList = useAtomValue(materialListAtom)
    const materials = useMaterialMap(materialList)
    const [showExt, setShowExt] = useState(false)
    const { dspList, dsp10List, mirrorList, fmpList, sandList, lacobelGlassList, lacobelList } = useMaterials(materialList)
    const profileList = useAtomValue(profileListAtom)
    const profileNames  = useProfileNamesMap(profileList)
    const { wardKind, wardType, width, depth, height, dspId, fasades, profileId, extComplect } = data
    const dsp = dspList.find(d => d.id === dspId)
    const profile = profileList.find(p => p.id === profileId)
    const totalFasades = Object.values(fasades).reduce((a, f) => f.count + a, 0)
    const [{ consoleSameHeight, consoleSameDepth, standSameHeight }, setConsoles] = useState({ consoleSameHeight: true, consoleSameDepth: true, standSameHeight: true })
    const extStand = useDetail(DETAIL_NAME.INNER_STAND, data.wardType, data.wardKind, data.width, data.height) || { length: 0 }
    const confirm = useConfirm()
    const showEditDetails = useSetAtom(showDetailDialogAtom)
    useEffect(() => {
        if (standSameHeight) setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, stand: { ...prev.extComplect.stand, height: extStand.length } } }))
    }, [extStand.length, standSameHeight])
    useEffect(() => {
        const newHeight = consoleSameHeight? height: extComplect.console.height
        const newDepth = consoleSameDepth? depth: extComplect.console.depth
        setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, console: { ...prev.extComplect.console, height: newHeight, depth: newDepth } } }))
    }, [depth, height])
    return <div className="container">
        <div className="row">
            <div className={`container col-xs-12 col-sm-12 ${perm?.Read ? "col-md-6 col-lg-4" : "col-md-12 col-lg-12"}`}>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 wardrobe-param-container">
                        <div className="text-center">Основные параметры</div>
                        <PropertyGrid style={{ padding: "0.5em", border: "1px solid" }}>
                            <ComboBox<WARDROBE_KIND> disabled={data.schema} title="Серия шкафа:" value={wardKind} items={[...wardKinds.keys()]} displayValue={value => wardKinds.get(value)} onChange={(_, value) => { setData(prev => ({ ...prev, wardKind: value, fasades: initFasades })) }} />
                            <ComboBox<WARDROBE_TYPE> disabled={data.schema} title="Тип шкафа:" value={wardType} items={[...wardTypes.keys()]} displayValue={value => wardTypes.get(value)} onChange={(_, value) => { setData(prev => ({ ...prev, wardType: value, fasades: initFasades })) }} />
                            <CheckBox caption="схемный" checked={data.schema} disabled={data.wardType === WARDROBE_TYPE.SYSTEM} onChange={async () => {
                                if (data.schema) {
                                    if (await confirm("Все изменения в деталировке будут сброшены. Продолжить?")) setData(prev => ({ ...prev, schema: !data.schema }))
                                } else setData(prev => ({ ...prev, schema: !data.schema }));
                            }} />
                            {data.schema ? <input type="button" value="Редактор деталей" onClick={() => { showEditDetails() }} /> : <div></div>}
                            <div className="text-end">Ширина: </div>
                            <TextBox disabled={data.schema} value={width} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={800} max={5400} setValue={(value) => { setData(prev => ({ ...prev, width: +value })) }} submitOnLostFocus={true}/>
                            <div className="text-end">Глубина: </div>
                            <TextBox disabled={data.schema} value={depth} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={350} max={1000} setValue={(value) => { setData(prev => ({ ...prev, depth: +value })) }}  submitOnLostFocus={true}/>
                            <div className="text-end">Высота: </div>
                            <TextBox disabled={data.schema} value={height} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={1700} max={2700} setValue={(value) => { setData(prev => ({ ...prev, height: +value })) }}  submitOnLostFocus={true}/>
                            <ComboBox<FasadMaterial> title="Цвет ДСП:" value={dsp} items={dspList} displayValue={value => materials.get(value?.id)?.name} onChange={(_, value) => { setData(prev => ({ ...prev, dspId: value?.id })) }} />
                            {wardType !== WARDROBE_TYPE.GARDEROB && <ComboBox<Profile> title="Цвет профиля:" value={profile} items={profileList} displayValue={value => profileNames.get(value?.id)} onChange={(_, value) => { setData(prev => ({ ...prev, profileId: value?.id })) }} />}
                        </PropertyGrid>
                        {wardType !== WARDROBE_TYPE.GARDEROB && <PropertyGrid style={{ padding: "0.5em", border: "1px solid" }}>
                            <div className="text-end">Фасадов всего: </div>
                            <div className="d-flex align-items-center justify-content-between"><div>{totalFasades}</div><div className="small-button" role="button" onClick={() => { setData(prev => ({ ...prev, fasades: initFasades })) }}>Сбросить</div></div>
                            <ComboBox<number> title="ДСП:" value={fasades.dsp.count} items={numbers} displayValue={value => `${value}`}  onChange={(_, value) => { if (+value + totalFasades - fasades.dsp.count <= maxFasades) setData(prev => ({ ...prev, fasades: { ...fasades, dsp: { count: +value, matId: new Array(+value).fill(-1) } } })) }} />
                            {fasades.dsp.count > 0 && fasades.dsp.matId.map((m, i) => <ComboBox<FasadMaterial> withEmpty={true} styles={styles} key={"dsp" + i} title={`${i + 1}`} items={dsp10List} value={materials.get(fasades.dsp.matId[i])}  displayValue={value => materials.get(value?.id)?.name} onChange={(_, value) => { const matId = [...fasades.dsp.matId]; matId[i] = value?.id; setData(prev => ({ ...prev, fasades: { ...prev.fasades, dsp: { ...prev.fasades.dsp, matId } } })) }} />)}
                            <ComboBox<number> title="Зеркало:" value={fasades.mirror.count} items={numbers} displayValue={value => `${value}`} onChange={(_, value) => { if (+value + totalFasades - fasades.mirror.count <= maxFasades) setData(prev => ({ ...prev, fasades: { ...fasades, mirror: { count: +value, matId: new Array(+value).fill(-1) } } })) }} />
                            {fasades.mirror.count > 0 && fasades.mirror.matId.map((m, i) => <ComboBox<FasadMaterial> withEmpty={true} styles={styles} key={"mirror" + i} title={`${i + 1}`} items={mirrorList} value={materials.get(fasades.mirror.matId[i])} displayValue={value => materials.get(value?.id)?.name}  onChange={(_, value) => { const matId = [...fasades.mirror.matId]; matId[i] = value?.id; setData(prev => ({ ...prev, fasades: { ...prev.fasades, mirror: { ...prev.fasades.mirror, matId } } })) }} />)}
                            <ComboBox<number> title="ФМП:" value={fasades.fmp.count} items={numbers}displayValue={value => `${value}`}  onChange={(_, value) => { if (+value + totalFasades - fasades.fmp.count <= maxFasades) setData(prev => ({ ...prev, fasades: { ...fasades, fmp: { count: +value, matId: new Array(+value).fill("") } } })) }} />
                            {fasades.fmp.count > 0 && fasades.fmp.matId.map((m, i) => <ComboBox<FasadMaterial> withEmpty={true} styles={styles} key={"fmp" + i} title={`${i + 1}`} items={fmpList} value={materials.get(fasades.fmp.matId[i])} displayValue={value => materials.get(value?.id)?.name}  onChange={(_, value) => { const matId = [...fasades.fmp.matId]; matId[i] = value?.id; setData(prev => ({ ...prev, fasades: { ...prev.fasades, fmp: { ...prev.fasades.fmp, matId } } })) }} />)}
                            <ComboBox<number> title="Пескоструй:" value={fasades.sand.count} items={numbers}displayValue={value => `${value}`}  onChange={(_, value) => { if (+value + totalFasades - fasades.sand.count <= maxFasades) setData(prev => ({ ...prev, fasades: { ...fasades, sand: { count: +value, matId: new Array(+value).fill("") } } })) }} />
                            {fasades.sand.count > 0 && fasades.sand.matId.map((m, i) => <ComboBox<FasadMaterial> withEmpty={true} styles={styles} key={"sand" + i} title={`${i + 1}`} items={sandList} value={materials.get(fasades.sand.matId[i])} displayValue={value => materials.get(value?.id)?.name}  onChange={(_, value) => { const matId = [...fasades.sand.matId]; matId[i] = value?.id; setData(prev => ({ ...prev, fasades: { ...prev.fasades, sand: { ...prev.fasades.sand, matId } } })) }} />)}
                            <ComboBox<number> title="Лакобель:" value={fasades.lacobel.count} items={numbers} displayValue={value => `${value}`}  onChange={(_, value) => { if (+value + totalFasades - fasades.lacobel.count <= maxFasades) setData(prev => ({ ...prev, fasades: { ...fasades, lacobel: { count: +value, matId: new Array(+value).fill("") } } })) }} />
                            {fasades.lacobel.count > 0 && fasades.lacobel.matId.map((m, i) => <ComboBox<FasadMaterial> withEmpty={true} styles={styles} key={"lacobel" + i} title={`${i + 1}`} items={lacobelList} value={materials.get(fasades.lacobel.matId[i])} displayValue={value => materials.get(value?.id)?.name}  onChange={(_, value) => { const matId = [...fasades.lacobel.matId]; matId[i] = value?.id; setData(prev => ({ ...prev, fasades: { ...prev.fasades, lacobel: { ...prev.fasades.lacobel, matId } } })) }} />)}
                            <ComboBox<number> title="Лакобель (стекло):" value={fasades.lacobelGlass.count} items={numbers}displayValue={value => `${value}`}  onChange={(_, value) => { if (+value + totalFasades - fasades.lacobelGlass.count <= maxFasades) setData(prev => ({ ...prev, fasades: { ...fasades, lacobelGlass: { count: +value, matId: new Array(+value).fill("") } } })) }} />
                            {fasades.lacobelGlass.count > 0 && fasades.lacobelGlass.matId.map((m, i) => <ComboBox<FasadMaterial> withEmpty={true} styles={styles} key={"lacobelGlass" + i} title={`${i + 1}`} items={lacobelGlassList} value={materials.get(fasades.lacobelGlass.matId[i])} displayValue={value => materials.get(value?.id)?.name}  onChange={(_, value) => { const matId = [...fasades.lacobelGlass.matId]; matId[i] = value.id; setData(prev => ({ ...prev, fasades: { ...prev.fasades, lacobelGlass: { ...prev.fasades.lacobelGlass, matId } } })) }} />)}
                        </PropertyGrid>}
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 wardrobe-param-container">
                        <div className={`text-center ${showExt ? "toggle-section-button-show" : "toggle-section-button-hidden"}`} role="button" onClick={() => setShowExt(!showExt)}>Доп. комплектация</div>
                        <PropertyGrid hidden={!showExt} style={{ padding: "0.5em", border: "1px solid" }}>
                            <div></div><div className="d-flex align-items-center justify-content-between"><div></div><div className="small-button" role="button" onClick={() => { setData(prev => ({ ...prev, extComplect: getInitExtComplect(prev.height, prev.depth) })); setConsoles({ consoleSameDepth: true, consoleSameHeight: true, standSameHeight: true }) }}>Сбросить</div></div>
                            <div className="text-end">Телескоп: </div>
                            <TextBox value={extComplect.telescope} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={0} max={10} setValue={(value) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, telescope: +value } })) }} />
                            <hr /><hr />
                            <div className="text-end">Консоли кол-во: </div>
                            <TextBox value={extComplect.console.count} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={0} max={2} setValue={(value) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, console: { ...prev.extComplect.console, count: +value } } })) }} />
                            <div className="d-flex flex-column align-items-end">
                                <div className="text-end">Высота консоли: </div>
                                <CheckBox styles={{fontSize: "0.8em"}} checked={consoleSameHeight} caption="как у шкафа" onChange={() => { setConsoles(prev => ({ ...prev, consoleSameHeight: !consoleSameHeight })); if (!consoleSameHeight) setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, console: { ...prev.extComplect.console, height: prev.height } } })) }} />
                            </div>
                            <TextBox disabled={consoleSameHeight} value={extComplect.console.height} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={0} max={3000} setValue={(value) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, console: { ...prev.extComplect.console, height: +value } } })) }} />
                            <div className="d-flex flex-column align-items-end">
                                <div className="text-end">Глубина консоли: </div>
                                <CheckBox styles={{ fontSize: "0.8em" }} checked={consoleSameDepth} caption="как у шкафа" onChange={() => { setConsoles(prev => ({ ...prev, consoleSameDepth: !consoleSameDepth })); if (!consoleSameDepth) setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, console: { ...prev.extComplect.console, depth: prev.depth } } })) }} />
                            </div>
                            <TextBox disabled={consoleSameDepth} value={extComplect.console.depth} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={0} max={800} setValue={(value) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, console: { ...prev.extComplect.console, depth: +value } } })) }} />
                            <ComboBox<number> title="Ширина консоли:" items={consoleWidth} value={extComplect.console.width} displayValue={value => `${value}`} onChange={(_, value) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, console: { ...prev.extComplect.console, width: +value } } })) }} />
                            <ComboBox<CONSOLE_TYPE> title="Тип консоли:" value={extComplect.console.type} items={[...consoleTypes.keys()]} displayValue={value => consoleTypes.get(value)} onChange={(_, value) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, console: { ...prev.extComplect.console, type: value } } })) }} />
                            <hr /><hr />
                            <div className="text-end">Козырек: </div>
                            <TextBox value={extComplect.blinder} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={0} max={1} setValue={(value) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, blinder: +value } })) }} />
                            <div className="text-end">Полка доп (полочн): </div>
                            <TextBox value={extComplect.shelf} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={0} max={10} setValue={(value) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, shelf: +value } })) }} />
                            <div className="text-end">Полка доп (плат): </div>
                            <TextBox value={extComplect.shelfPlat} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={0} max={10} setValue={(value) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, shelfPlat: +value } })) }} />
                            <div className="text-end">Перемычка (доп): </div>
                            <TextBox value={extComplect.pillar} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={0} max={10} setValue={(value) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, pillar: +value } })) }} />
                            <hr /><hr />
                            <div className="text-end">Стойка (доп) кол-во: </div>
                            <TextBox value={extComplect.stand.count} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={0} max={10} setValue={(value) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, stand: { ...prev.extComplect.stand, count: +value } } })) }} />
                            <div className="d-flex flex-column align-items-end">
                                <div className="text-end">Стойка (доп) размер: </div>
                                <CheckBox styles={{ fontSize: "0.8em" }} checked={standSameHeight} caption="как у шкафа" onChange={() => { setConsoles(prev => ({ ...prev, standSameHeight: !standSameHeight })); }} />
                            </div>
                            <TextBox disabled={standSameHeight} value={standSameHeight ? extStand.length : extComplect.stand.height} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={0} max={2750} setValue={(value) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, stand: { ...prev.extComplect.stand, height: +value } } })) }} />
                            <hr /><hr />    
                            <div className="text-end">Труба (доп): </div>
                            <TextBox value={extComplect.truba} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={0} max={10} setValue={(value) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, truba: +value } })) }} />
                            <div className="text-end">Тремпель (доп): </div>
                            <TextBox value={extComplect.trempel} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={0} max={10} setValue={(value) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, trempel: +value } })) }} />
                            <div className="text-end">Точки света: </div>
                            <TextBox value={extComplect.light} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={0} max={10} setValue={(value) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, light: +value } })) }} />
                        </PropertyGrid>
                    </div>
                </div>
            </div>
            {perm?.Read && <div className="col-xs-12 col-sm-12 col-md-6 col-lg-8">
                <WardrobeSpecification />
            </div>}
        </div>
        <EditDetailDialog />
    </div>
}

function useMaterials(materialList: FasadMaterial[]){
    const dspList = useMemo(() => materialList.filter(m => m.purpose !== MAT_PURPOSE.FASAD).toSorted((m1, m2) => m1.name > m2.name ? 1 : -1), [materialList])
    const dsp10List = useMemo(() => materialList.filter(m => m.type === FASAD_TYPE.DSP && m.purpose !== MAT_PURPOSE.CORPUS).toSorted((m1, m2) => m1.name > m2.name ? 1 : -1), [materialList])
    const mirrorList = useMemo(() => materialList.filter(m => m.type === FASAD_TYPE.MIRROR), [materialList])
    const fmpList = useMemo(() => materialList.filter(m => m.type === FASAD_TYPE.FMP), [materialList])
    const sandList = useMemo(() => materialList.filter(m => m.type === FASAD_TYPE.SAND), [materialList])
    const lacobelList = useMemo(() => materialList.filter(m => m.type === FASAD_TYPE.LACOBEL), [materialList])
    const lacobelGlassList = useMemo(() => materialList.filter(m => m.type === FASAD_TYPE.LACOBELGLASS), [materialList])
    return {
        dspList,
        dsp10List,
        mirrorList,
        fmpList,
        sandList,
        lacobelGlassList,
        lacobelList
    }
}


