import { useEffect, useRef, useState } from "react"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { editDetailDialogAtom } from "../../atoms/dialogs"
import DialogWindow from "./DialogWindow"
import TableData from "../TableData"
import { setWardrobeDataAtom, wardrobeDataAtom } from "../../atoms/wardrobe"
import { Detail, DETAIL_NAME, DRILL_TYPE, EDGE_TYPE } from "../../types/wardrobe"
import { getEdgeDescripton } from "../../functions/wardrobe"
import EditContainer from "../EditContainer"
import EditDataSection, { EditDataItem } from "./EditDataSection"
import { InputType, PropertyType } from "../../types/property"
import messages from "../../server/messages"
import { calculateSpecificationsAtom } from "../../atoms/specification"
const edges = new Map<string, string>()
edges.set(EDGE_TYPE.NONE, "нет")
edges.set(EDGE_TYPE.THIN, "0,45мм")
edges.set(EDGE_TYPE.THICK, "2мм")
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
    name: DETAIL_NAME.SHELF,
    caption: ``,
    length: 0,
    width: 0,
    count: 0,
    edge: {
        L1: EDGE_TYPE.NONE,
        L2: EDGE_TYPE.NONE,
        W1: EDGE_TYPE.NONE,
        W2: EDGE_TYPE.NONE
    }
}
export default function EditDetailDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const details = useAtomValue(wardrobeDataAtom).details
    const calculate = useSetAtom(calculateSpecificationsAtom)
    const setData = useSetAtom(setWardrobeDataAtom)
    const [detIndex, setDetIndex] = useState(0)
    const detail = details[detIndex] || defaultDetail
    const [, setEditDetailDialogAtomRef] = useAtom(editDetailDialogAtom)
    const heads = ["Деталь", "Длина", "Ширина", "Кол-во", "Кромка 2", "Кромка 0.45", "Крепеж"]
    const contents = details.map(d => [d.caption, d.length, d.width, d.count, getEdgeDescripton(d, EDGE_TYPE.THICK), getEdgeDescripton(d, EDGE_TYPE.THIN), drill.get(getDrillCaption(d)) || ""])
    const editItems: EditDataItem[] = [
        { caption: "Деталь:", value: detail.caption || "", message: messages.ENTER_CAPTION, type: InputType.TEXT, optional: true },
        { caption: "Длина:", value: `${detail.length}`, message: messages.ENTER_LENGTH, type: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { caption: "Ширина:", value: `${detail.width}`, message: messages.ENTER_WIDTH, type: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { caption: "Кол-во:", value: `${detail.count}`,message: messages.ENTER_COUNT, type: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER },
        { caption: "Кромка по длине 1:", value: `${detail.edge?.L1}`, list: edges, message: "", type: InputType.LIST, listWithoutEmptyRow: true },
        { caption: "Кромка по длине 2:", value: `${detail.edge?.L2}`, list: edges, message: "", type: InputType.LIST, listWithoutEmptyRow: true },
        { caption: "Кромка по ширине 1:", value: `${detail.edge?.W1}`, list: edges, message: "", type: InputType.LIST, listWithoutEmptyRow: true },
        { caption: "Кромка по ширине 2:", value: `${detail.edge?.W2}`, list: edges, message: "", type: InputType.LIST, listWithoutEmptyRow: true },
        { caption: "Крепеж:", value: getDrillCaption(detail), list: drill, message: "", type: InputType.LIST, listWithoutEmptyRow: true },
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
                if (checked[0]) newDetails[detIndex].caption = `${values[0]}`
                if (checked[1]) newDetails[detIndex].length = +values[1]
                if (checked[2]) newDetails[detIndex].width = +values[2]
                if (checked[3]) newDetails[detIndex].count = +values[3]
                if (checked[4] && newDetails[detIndex].edge) newDetails[detIndex].edge.L1 = values[4] as EDGE_TYPE
                if (checked[5] && newDetails[detIndex].edge) newDetails[detIndex].edge.L2 = values[5] as EDGE_TYPE
                if (checked[6] && newDetails[detIndex].edge) newDetails[detIndex].edge.W1 = values[6] as EDGE_TYPE
                if (checked[7] && newDetails[detIndex].edge) newDetails[detIndex].edge.W2 = values[7] as EDGE_TYPE
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
                    name: DETAIL_NAME.SHELF,
                    caption: `${values[0]}`,
                    length: +values[1],
                    width: +values[2],
                    count: +values[3],
                    edge: {
                        L1: values[4] as EDGE_TYPE,
                        L2: values[5] as EDGE_TYPE,
                        W1: values[6] as EDGE_TYPE,
                        W2: values[7] as EDGE_TYPE
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