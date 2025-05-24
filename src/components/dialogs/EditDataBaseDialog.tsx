import { useEffect, useState } from "react"
import { useAtomValue } from "jotai"
import { userAtom } from "../../atoms/users"
import { RESOURCE } from "../../types/user"
import EditSpecificationDialog from "./editDataBaseDialogs/EditSpecificationDialog"
import { useNavigate } from "react-router-dom"
import EditChars from "./editDataBaseDialogs/EditChars"
import EditSpecToChars from "./editDataBaseDialogs/EditSpecToChars"
import EditDSPKromkaZagl from "./editDataBaseDialogs/EditDSPKromkaZagl"
import EditDetailsTable from "./editDataBaseDialogs/EditDetailsTable"
import EditFurnitureTable from "./editDataBaseDialogs/EditFurnitureTable"
import EditFasadTypeToChars from "./editDataBaseDialogs/EditFasadTypeToChars"
import EditCharPurpose from "./editDataBaseDialogs/EditCharPurpose"
enum MaterialGroup{
    SPECIFICATION = 1,
    CHARS = 2,
    SPEC_TO_CHAR = 3,
    FASAD_TYPE_TO_CHAR = 4,
    CHAR_PURPOSE = 5,
    DSP_EDGE = 6,
    DETAIL_TABLE = 7,
    FURNITURE_TABLE = 8,
}
const matGroup=new Map()
matGroup.set(MaterialGroup.SPECIFICATION, "Номенклатура")
matGroup.set(MaterialGroup.CHARS, "Характеристики")
matGroup.set(MaterialGroup.SPEC_TO_CHAR, "Характеристики номенклатур")
matGroup.set(MaterialGroup.FASAD_TYPE_TO_CHAR, "Характеристики фасадов")
matGroup.set(MaterialGroup.CHAR_PURPOSE, "Назначение характеристик")
matGroup.set(MaterialGroup.DSP_EDGE, "ДСП - Кромка - Заглушка")
matGroup.set(MaterialGroup.DETAIL_TABLE, "Деталировки")
matGroup.set(MaterialGroup.FURNITURE_TABLE, "Фурнитура")

export default function EditDataBaseDialog() {
    const navigate = useNavigate()
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.SPECIFICATION)
    const [group, setGroup] = useState<MaterialGroup>(MaterialGroup.SPECIFICATION)
    const header = [...matGroup.entries()].map((item, index) => <div key={index} className={(group === item[0] ? "tab-button-active" : "tab-button-inactive")} onClick={() => { setGroup(item[0] as MaterialGroup) }} role="button">{item[1]}</div>)
    const content = getGroup(group)
    useEffect(() => {
        if (!perm?.Read) navigate('/')
    }, [perm])
    return <div className="database-edit-container">
        <div className="tab-header-container">{header}</div>
        {content}
    </div>
}


function getGroup(group: MaterialGroup) {
    const groups =new Map()
    groups.set(MaterialGroup.SPECIFICATION, <EditSpecificationDialog />)
    groups.set(MaterialGroup.CHARS, <EditChars />)
    groups.set(MaterialGroup.SPEC_TO_CHAR, <EditSpecToChars />)
    groups.set(MaterialGroup.DSP_EDGE, <EditDSPKromkaZagl />)
    groups.set(MaterialGroup.DETAIL_TABLE, <EditDetailsTable />)
    groups.set(MaterialGroup.FURNITURE_TABLE, <EditFurnitureTable />)
    groups.set(MaterialGroup.FASAD_TYPE_TO_CHAR, <EditFasadTypeToChars />)
    groups.set(MaterialGroup.CHAR_PURPOSE, <EditCharPurpose />)
    return groups.get(group) || <></>
}