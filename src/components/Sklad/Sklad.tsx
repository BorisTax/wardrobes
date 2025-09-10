import { useEffect, useState } from "react"
import { useAtomValue } from "jotai"
import { userAtom } from "../../atoms/users"
import { RESOURCE } from "../../types/user"
import { useNavigate } from "react-router-dom"
import SkladStol from "./SkladStol"
import SkladStolIncome from "./SkladStolIncome"
enum SkladGroup{
    SKLAD = 1,
    INCOME = 2,
    OUTCOME = 3,
}
const matGroup=new Map()
matGroup.set(SkladGroup.SKLAD, "Склад")
matGroup.set(SkladGroup.INCOME, "Приход")
matGroup.set(SkladGroup.OUTCOME, "Расход")


export default function EditDataBaseDialog() {
    const navigate = useNavigate()
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.SKLAD_STOL)
    const [group, setGroup] = useState<SkladGroup>(SkladGroup.SKLAD)
    const header = [...matGroup.entries()].map((item, index) => <div key={index} className={(group === item[0] ? "tab-button-active" : "tab-button-inactive")} onClick={() => { setGroup(item[0] as SkladGroup) }} role="button">{item[1]}</div>)
    const content = getGroup(group)
    useEffect(() => {
        if (!perm?.Read) navigate('/')
    }, [perm])
    return <div className="database-edit-container">
        <div className="tab-header-container">{header}</div>
        {content}
    </div>
}


function getGroup(group: SkladGroup) {
    const groups =new Map()
    groups.set(SkladGroup.SKLAD, <SkladStol />)
    groups.set(SkladGroup.INCOME, <SkladStolIncome income={true} />)
    groups.set(SkladGroup.OUTCOME, <SkladStolIncome income={false} />)
    return groups.get(group) || <></>
}