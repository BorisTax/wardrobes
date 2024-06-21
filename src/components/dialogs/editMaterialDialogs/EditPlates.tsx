import { useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { MATPurpose, existMaterial, getFasadMaterial, getMATPurpose } from "../../../functions/materials"
import ComboBox from "../../inputs/ComboBox"
import { ExtMaterial } from "../../../types/materials"
import { MAT_PURPOSE, FasadMaterial } from "../../../types/enums"
import { Materials } from "../../../functions/materials"
import { addMaterialAtom, deleteMaterialAtom, materialListAtom, updateMaterialAtom } from "../../../atoms/materials/materials"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import TableData from "../../TableData"
import { InputType } from "../../../types/property"
import messages from "../../../server/messages"
import EditContainer from "../../EditContainer"
import { userAtom } from "../../../atoms/users"
import { RESOURCE } from "../../../types/user"

export default function EditPlates() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MATERIALS)
    const materialList = useAtomValue(materialListAtom)
    const [{ baseMaterial, extMaterialIndex }, setState] = useState({ baseMaterial: FasadMaterial.DSP, extMaterialIndex: 0 })
    const deleteMaterial = useSetAtom(deleteMaterialAtom)
    const addMaterial = useSetAtom(addMaterialAtom)
    const updateMaterial = useSetAtom(updateMaterialAtom)
    const extMaterials: ExtMaterial[] = useMemo(() => (materialList.filter(m => m.material === baseMaterial) || [{ name: "", material: "" }]).toSorted((m1, m2) => (m1.name > m2.name) ? 1 : -1), [materialList, baseMaterial]);
    const extMaterial = extMaterials[extMaterialIndex] || { name: "", code: "", image: "", material: FasadMaterial.DSP, purpose: MAT_PURPOSE.BOTH }
    const purposeEnabled = extMaterial?.material === FasadMaterial.DSP
    const heads = ['Наименование', 'Код', 'Назначение']
    const contents = extMaterials.map((i: ExtMaterial) => [i.name, i.code, MATPurpose.get(i.purpose) || ""])
    const editItems: EditDataItem[] = [
        { caption: "Наименование:", value: extMaterial.name || "", message: "Введите наименование", type: InputType.TEXT },
        { caption: "Код:", value: extMaterial.code, message: "Введите код", type: InputType.TEXT },
        { caption: "Назначение:", value: extMaterial.purpose || "", list: MATPurpose, message: "Выберите назначение", type: InputType.LIST, readonly: !purposeEnabled },
        { caption: "Изображение:", value: extMaterial.image || "", message: "Выберите изображение", type: InputType.FILE },
    ]
    return <EditContainer>
        <div>
            <div className="d-flex flex-nowrap gap-2 align-items-start">
                <ComboBox title="Материал: " value={baseMaterial} items={Materials} onChange={(_, value: string) => { setState((prev) => ({ ...prev, baseMaterial: getFasadMaterial(value), extMaterialIndex: 0 })); }} />
            </div>
            <hr />
            <TableData heads={heads} content={contents} onSelectRow={(index) => { setState((prev) => ({ ...prev, extMaterialIndex: index })) }} />
        </div>
        <EditDataSection name={extMaterial.name} items={editItems}
            onUpdate={perm?.update ? async (checked, values) => {
                const usedName = checked[0] ? values[0] : ""
                const usedCode = checked[1] ? values[1] : ""
                const usedPurpose = checked[2] ? values[2] : MAT_PURPOSE.FASAD
                const usedFile = checked[3] ? values[3] : ""
                const result = await updateMaterial({ name: extMaterial.name, material: baseMaterial, newName: usedName, newCode: usedCode, image: usedFile, purpose: usedPurpose })
                return result
            } : undefined}
            onDelete={perm?.remove ? async (name) => {
                const result = await deleteMaterial(extMaterial)
                setState((prev) => ({ ...prev, extMaterialIndex: 0 }))
                return result
            } : undefined}
            onAdd={perm?.create ? async (checked, values) => {
                const name = values[0] as string
                const code = values[1] as string
                const purpose = getMATPurpose(values[2] as string)
                const file = values[3] as string
                if (existMaterial(name, baseMaterial, materialList)) { return { success: false, message: messages.MATERIAL_EXIST } }
                const result = await addMaterial({ name, material: baseMaterial, code, image: "", purpose }, file)
                return result
            } : undefined} />
    </EditContainer>
}
