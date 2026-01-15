import { useState } from "react"
import { useSetAtom } from "jotai"
import SkladStol from "./SkladStol"
import SkladStolIncome from "./SkladStolIncome"
import ImageButtonBar from "../inputs/Image'ButtonBar"
import ImageButton from "../inputs/ImageButton"
import { saveStolToExcelAtom } from "../../atoms/export"
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
    const saveToExcel = useSetAtom(saveStolToExcelAtom)
    const [group, setGroup] = useState<SkladGroup>(SkladGroup.SKLAD)
    const header = [...matGroup.entries()].map((item, index) => <div key={index} className={(group === item[0] ? "tab-button-active" : "tab-button-inactive")} onClick={() => { setGroup(item[0] as SkladGroup) }} role="button">{item[1]}</div>)
    const content = getGroup(group)
    return <div className="database-edit-container">
            <ImageButtonBar justifyContent="flex-start">
                <ImageButton icon="excel" title="Сохранить в Excel" caption="Сохранить в Excel" onClick={() => saveToExcel()} />
            </ImageButtonBar>
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