import { useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { Edge, ExtMaterial } from "../../../types/materials"
import useMessage from "../../../custom-hooks/useMessage"
import useConfirm from "../../../custom-hooks/useConfirm"
import { addEdgeAtom, deleteEdgeAtom, edgeListAtom, updateEdgeAtom } from "../../../atoms/materials/edges"
import { rusMessages } from "../../../functions/messages"
import messages from "../../../server/messages"
import { materialListAtom } from "../../../atoms/materials/materials"
import { FasadMaterial } from "../../../types/enums"
import { EditDialogProps } from "../EditMaterialDialog"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import TableData from "../TableData"
import { InputType } from "../../../types/property"

export default function EditEdge(props: EditDialogProps) {
    const edgeNotSortedList = useAtomValue(edgeListAtom)
    const edgeList = useMemo(() => edgeNotSortedList.toSorted((e1, e2) => e1.name > e2.name ? 1 : -1), [edgeNotSortedList])
    const materialList = useAtomValue(materialListAtom)
    const mList = useMemo(() => materialList.filter(mat => mat.material === FasadMaterial.DSP).map((m: ExtMaterial) => m.name), [materialList])
    const [selectedIndex, setSelectedIndex] = useState(0)
    const { name: edgeName, dsp, code } = { ...(edgeList[selectedIndex] || { name: "", dsp: "", code: "" }) }
    const deleteEdge = useSetAtom(deleteEdgeAtom)
    const addEdge = useSetAtom(addEdgeAtom)
    const updateEdge = useSetAtom(updateEdgeAtom)
    const showMessage = useMessage()
    const showConfirm = useConfirm()
    const heads = ['Наименование', 'Код', 'Соответствие ДСП']
    const contents = edgeList.map((i: Edge) => [i.name, i.code, i.dsp])
    const editItems: EditDataItem[] = [
        { caption: "Наименование:", value: edgeName || "", message: "Введите наименование", type: InputType.TEXT },
        { caption: "Код:", value: code, message: "Введите код", type: InputType.TEXT },
        { caption: "Соответствие ДСП:", value: dsp, list: mList, message: "Выберите ДСП", type: InputType.LIST },
    ]
    return <>
        <TableData heads={heads} content={contents} onSelectRow={(index) => { setSelectedIndex(index) }} />
        <EditDataSection name={edgeList[selectedIndex].name} items={editItems}
            onUpdate={(checked, values, message) => {
                showConfirm(message, () => {
                    props.setLoading(true)
                    const usedName = checked[0] ? values[0] : ""
                    const usedCode = checked[1] ? values[1] : ""
                    const usedDSP = checked[2] ? values[2] : ""
                    updateEdge({ name: edgeList[selectedIndex].name, newName: usedName, code: usedCode, dsp: usedDSP }, (result) => {
                        props.setLoading(false)
                        showMessage(rusMessages[result.message])
                    })
                })
            }}
            onDelete={(name, message) => {
                const index = edgeList.findIndex((p: Edge) => p.name === name)
                showConfirm(message, () => {
                    props.setLoading(true)
                    deleteEdge(edgeList[index], (result) => {
                        props.setLoading(false)
                        showMessage(rusMessages[result.message])
                    });
                    setSelectedIndex(0)
                })
            }}
            onAdd={(checked, values, message) => {
                const name = values[0]
                const code = values[1]
                const dsp = values[2]
                if (edgeList.find((p: Edge) => p.name === name)) { showMessage(rusMessages[messages.EDGE_EXIST]); return }
                showConfirm(message, () => {
                    props.setLoading(true)
                    addEdge({ name, dsp, code }, (result) => {
                        props.setLoading(false)
                        showMessage(rusMessages[result.message])
                    });
                })
            }} />

    </>
}


