import { useEffect, useRef, useState } from "react"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { editDetailDialogAtom } from "../../atoms/dialogs"
import DialogWindow from "./DialogWindow"
import TableData from "../inputs/TableData"
import { setWardrobeDataAtom, wardrobeDataAtom } from "../../atoms/wardrobe"
import { Detail, DETAIL_NAME, DRILL_TYPE, KROMKA_TYPE } from "../../types/wardrobe"
import { getEdgeDescripton } from "../../functions/wardrobe"
import EditContainer from "../EditContainer"
import EditDataSection, { EditDataItem } from "./EditDataSection"
import { InputType, PropertyType } from "../../types/property"
import messages from "../../server/messages"
import { calculateSpecificationsAtom } from "../../atoms/specification"
import { detailNamesAtom } from "../../atoms/storage"
const edges = new Map<KROMKA_TYPE, string>()
edges.set(KROMKA_TYPE.NONE, "нет")
edges.set(KROMKA_TYPE.THIN, "0,45мм")
edges.set(KROMKA_TYPE.THICK, "2мм")

const defaultDetail: Detail = {
    id: DETAIL_NAME.SHELF,
    length: 0,
    width: 0,
    count: 0,
    kromka: {
        L1: KROMKA_TYPE.NONE,
        L2: KROMKA_TYPE.NONE,
        W1: KROMKA_TYPE.NONE,
        W2: KROMKA_TYPE.NONE
    },
    confirmat: 0,
    minifix: 0
}
export default function EditDetailDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const details = useAtomValue(wardrobeDataAtom).details || []
    const calculate = useSetAtom(calculateSpecificationsAtom)
    const setData = useSetAtom(setWardrobeDataAtom)
    const detailNames = useAtomValue(detailNamesAtom)
    const [detIndex, setDetIndex] = useState(0)
    const detail = details[detIndex] || defaultDetail
    const [, setEditDetailDialogAtomRef] = useAtom(editDetailDialogAtom)
    const heads = [{ caption: "Деталь" }, { caption: "Длина" }, { caption: "Ширина" }, { caption: "Кол-во" }, { caption: "Кромка 2" }, { caption: "Кромка 0.45" }, { caption: "Конфирматы" }, { caption: "Минификсы" }]
    const contents = details.map((d, index) => ({ key: index, data: [detailNames.get(d.id) || "", d.length, d.width, d.count, getEdgeDescripton(d, KROMKA_TYPE.THICK), getEdgeDescripton(d, KROMKA_TYPE.THIN), d.confirmat, d.minifix] }))
    const editItems: EditDataItem[] = [
        { title: "Деталь:", value: detail.id || 0, displayValue: value => detailNames.get(value as number) || "", message: messages.ENTER_CAPTION, inputType: InputType.LIST, list: [...detailNames.keys()], optional: true },
        { title: "Длина:", value: `${detail.length}`, message: messages.ENTER_LENGTH, inputType: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { title: "Ширина:", value: `${detail.width}`, message: messages.ENTER_WIDTH, inputType: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { title: "Кол-во:", value: `${detail.count}`,message: messages.ENTER_COUNT, inputType: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { title: "Кромка по длине 1:", value: detail.kromka?.L1, list: [...edges.keys()], displayValue: value => edges.get(value as KROMKA_TYPE) || "", message: "", inputType: InputType.LIST },
        { title: "Кромка по длине 2:", value: detail.kromka?.L2, list: [...edges.keys()], displayValue: value => edges.get(value as KROMKA_TYPE) || "", message: "", inputType: InputType.LIST },
        { title: "Кромка по ширине 1:", value: detail.kromka?.W1, list: [...edges.keys()], displayValue: value => edges.get(value as KROMKA_TYPE) || "", message: "", inputType: InputType.LIST},
        { title: "Кромка по ширине 2:", value: detail.kromka?.W2, list: [...edges.keys()], displayValue: value => edges.get(value as KROMKA_TYPE) || "", message: "", inputType: InputType.LIST },
        { title: "Конфирматы:", value: detail.confirmat, message: "", inputType: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { title: "Минификсы:", value: detail.minifix, message: "", inputType: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
    ]
    useEffect(() => {
        setEditDetailDialogAtomRef(dialogRef)
    }, [setEditDetailDialogAtomRef, dialogRef])
    return <DialogWindow dialogRef={dialogRef} title={"Редактор деталей"} onClose={()=>{calculate()}}>
        <EditContainer>
            <TableData header={heads} content={contents} onSelectRow={key => setDetIndex(key as number)} />
            <EditDataSection name={""} items={editItems} dontAsk={true}
            onUpdate={async (checked, values) => {
                const newDetails = [...details]
                if (checked[0]) newDetails[detIndex].id = values[0] as number
                if (checked[1]) newDetails[detIndex].length = +values[1]
                if (checked[2]) newDetails[detIndex].width = +values[2]
                if (checked[3]) newDetails[detIndex].count = +values[3]
                if (checked[4] && newDetails[detIndex].kromka) newDetails[detIndex].kromka.L1 = values[4] as KROMKA_TYPE
                if (checked[5] && newDetails[detIndex].kromka) newDetails[detIndex].kromka.L2 = values[5] as KROMKA_TYPE
                if (checked[6] && newDetails[detIndex].kromka) newDetails[detIndex].kromka.W1 = values[6] as KROMKA_TYPE
                if (checked[7] && newDetails[detIndex].kromka) newDetails[detIndex].kromka.W2 = values[7] as KROMKA_TYPE
                if (checked[8]) newDetails[detIndex].confirmat = values[8] as number
                if (checked[9]) newDetails[detIndex].minifix = values[9] as number
                setData(prev => ({ ...prev, details: newDetails }))
                return { success: true, message: "" }
            }}
            onDelete={async () => {
                const newDetails = details.filter((_, i) => i !== detIndex)
                setData(prev => ({ ...prev, details: newDetails }))
                return { success: true, message: "" }
            }}
            onAdd={async (_, values) => {
                const newDetails = [...details]
                const detail: Detail = {
                    id: values[0] as number,
                    length: +values[1],
                    width: +values[2],
                    count: +values[3],
                    kromka: {
                        L1: values[4] as KROMKA_TYPE,
                        L2: values[5] as KROMKA_TYPE,
                        W1: values[6] as KROMKA_TYPE,
                        W2: values[7] as KROMKA_TYPE
                    },
                confirmat: values[8] as number,
                minifix: values[9] as number
                }
                newDetails.push(detail)
                setData(prev => ({ ...prev, details: newDetails }))
                return { success: true, message: "" }
            }} />
        </EditContainer>
    </DialogWindow>
}


