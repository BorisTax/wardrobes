import { useEffect, useState } from "react"
import { useAtomValue } from "jotai"
import { userAtom } from "../../atoms/users"
import { RESOURCE } from "../../types/user"
import EditSpecificationDialog from "./EditSpecificationDialog"
import { useNavigate } from "react-router-dom"
import EditChars from "./editMaterialDialogs/EditChars"
import EditSpecToChars from "./editMaterialDialogs/EditSpecToChars"
import EditDSPKromkaZagl from "./editMaterialDialogs/EditDSPKromkaZagl"
import EditDetailsTable from "./editMaterialDialogs/EditDetailsTable"
import EditFurnitureTable from "./editMaterialDialogs/EditFurnitureTable"
enum MaterialGroup{
    SPECIFICATION = 1,
    CHARS = 2,
    SPEC_TO_CHAR = 3,
    DSP_EDGE = 4,
    DETAIL_TABLE = 5,
    FURNITURE_TABLE = 6,
}
const matGroup=new Map()
matGroup.set(MaterialGroup.SPECIFICATION, "Номенклатура")
matGroup.set(MaterialGroup.CHARS, "Характеристики")
matGroup.set(MaterialGroup.SPEC_TO_CHAR, "Характеристики номенклатур")
matGroup.set(MaterialGroup.DSP_EDGE, "ДСП - Кромка - Заглушка")
matGroup.set(MaterialGroup.DETAIL_TABLE, "Деталировки")
matGroup.set(MaterialGroup.FURNITURE_TABLE, "Фурнитура")

export default function EditMaterialDialog() {
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
    return groups.get(group) || <></>
}