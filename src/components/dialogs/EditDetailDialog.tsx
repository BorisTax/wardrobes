import { useEffect, useRef, useState } from "react"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { editDetailDialogAtom } from "../../atoms/dialogs"
import DialogWindow from "./DialogWindow"
import TableData from "../TableData"
import { setWardrobeDataAtom, wardrobeDataAtom } from "../../atoms/wardrobe"
import { Detail, DETAIL_NAME, DRILL_TYPE, KROMKA_TYPE } from "../../types/wardrobe"
import { getEdgeDescripton } from "../../functions/wardrobe"
import EditContainer from "../EditContainer"
import EditDataSection, { EditDataItem } from "./EditDataSection"
import { InputType, PropertyType } from "../../types/property"
import messages from "../../server/messages"
import { calculateSpecificationsAtom } from "../../atoms/specification"
import { detailNamesAtom } from "../../atoms/storage"
const edges = new Map<string, string>()
edges.set(KROMKA_TYPE.NONE, "нет")
edges.set(KROMKA_TYPE.THIN, "0,45мм")
edges.set(KROMKA_TYPE.THICK, "2мм")
enum DRILL_CAPTIONS {
    CONF = "CONF",
    MINIF = "MINIF",
    BOTH = "BOTH",
    NONE = "NONE"
}
const drill = new Map<string, string>()
drill.set(DRILL_CAPTIONS.CONF, "Конфирмат")
drill.set(DRILL_CAPTIONS.MINIF, "Минификс")
drill.set(DRILL_CAPTIONS.BOTH, "Конф. и миниф.")
drill.set(DRILL_CAPTIONS.NONE, "нет")
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
    }
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
    const heads = ["Деталь", "Длина", "Ширина", "Кол-во", "Кромка 2", "Кромка 0.45", "Крепеж"]
    const contents = details.map((d, index) => ({ key: index, data: [detailNames.get(d.id) || "", d.length, d.width, d.count, getEdgeDescripton(d, KROMKA_TYPE.THICK), getEdgeDescripton(d, KROMKA_TYPE.THIN), drill.get(getDrillCaption(d)) || ""] }))
    const editItems: EditDataItem[] = [
        { caption: "Деталь:", value: detail.id || 0, valueCaption: value => detailNames.get(value as number) || "", message: messages.ENTER_CAPTION, type: InputType.LIST, list: [...detailNames.keys()], optional: true },
        { caption: "Длина:", value: `${detail.length}`, message: messages.ENTER_LENGTH, type: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { caption: "Ширина:", value: `${detail.width}`, message: messages.ENTER_WIDTH, type: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { caption: "Кол-во:", value: `${detail.count}`,message: messages.ENTER_COUNT, type: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { caption: "Кромка по длине 1:", value: `${detail.kromka?.L1}`, list: [...edges.keys()], valueCaption: value => edges.get(value as string) || "", message: "", type: InputType.LIST },
        { caption: "Кромка по длине 2:", value: `${detail.kromka?.L2}`, list: [...edges.keys()], valueCaption: value => edges.get(value as string) || "", message: "", type: InputType.LIST },
        { caption: "Кромка по ширине 1:", value: `${detail.kromka?.W1}`, list: [...edges.keys()], valueCaption: value => edges.get(value as string) || "", message: "", type: InputType.LIST},
        { caption: "Кромка по ширине 2:", value: `${detail.kromka?.W2}`, list: [...edges.keys()], valueCaption: value => edges.get(value as string) || "", message: "", type: InputType.LIST },
        { caption: "Крепеж:", value: getDrillCaption(detail), list: [...drill.keys()], valueCaption: value => drill.get(value as string) || "", message: "", type: InputType.LIST },
    ]
    useEffect(() => {
        setEditDetailDialogAtomRef(dialogRef)
    }, [setEditDetailDialogAtomRef, dialogRef])
    return <DialogWindow dialogRef={dialogRef} title={"Редактор деталей"} onClose={()=>{calculate()}}>
        <EditContainer>
            <TableData heads={heads} content={contents} onSelectRow={(index) => setDetIndex(index)} />
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
                if (checked[8]) newDetails[detIndex].drill = getDrillByCaption(values[8] as DRILL_CAPTIONS)
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
                    id: DETAIL_NAME.SHELF,
                    length: +values[1],
                    width: +values[2],
                    count: +values[3],
                    kromka: {
                        L1: values[4] as KROMKA_TYPE,
                        L2: values[5] as KROMKA_TYPE,
                        W1: values[6] as KROMKA_TYPE,
                        W2: values[7] as KROMKA_TYPE
                    },
                    drill: getDrillByCaption(values[8] as DRILL_CAPTIONS)
                }
                newDetails.push(detail)
                setData(prev => ({ ...prev, details: newDetails }))
                return { success: true, message: "" }
            }} />
        </EditContainer>
    </DialogWindow>
}


function getDrillCaption(detail: Detail): DRILL_CAPTIONS {
    let conf = false
    let min = false
    detail.drill?.forEach(d => {
        if (d === DRILL_TYPE.CONFIRMAT2) conf = true
        if (d === DRILL_TYPE.MINIFIX2) min = true
    })
    if (conf && min) return DRILL_CAPTIONS.BOTH
    if (conf) return DRILL_CAPTIONS.CONF
    if (min) return DRILL_CAPTIONS.MINIF
    return DRILL_CAPTIONS.NONE
}

function getDrillByCaption(drill: DRILL_CAPTIONS): DRILL_TYPE[] {
    if (drill === DRILL_CAPTIONS.BOTH) return [DRILL_TYPE.CONFIRMAT2, DRILL_TYPE.MINIFIX2]
    if (drill === DRILL_CAPTIONS.CONF) return [DRILL_TYPE.CONFIRMAT2, DRILL_TYPE.CONFIRMAT2]
    if (drill === DRILL_CAPTIONS.MINIF) return [DRILL_TYPE.MINIFIX2, DRILL_TYPE.MINIFIX2]
    return []
}