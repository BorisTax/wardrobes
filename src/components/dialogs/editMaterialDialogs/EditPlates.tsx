import { useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { MATPurpose, existMaterial } from "../../../functions/materials"
import ComboBox from "../../inputs/ComboBox"
import { FasadMaterial } from "../../../types/materials"
import { MAT_PURPOSE, FASAD_TYPE } from "../../../types/enums"
import { addMaterialAtom, deleteMaterialAtom, materialListAtom, materialTypesAtom, updateMaterialAtom, useImageUrl } from "../../../atoms/materials/materials"
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
    const materialTypes =  useAtomValue(materialTypesAtom)

    const [{ baseMaterial, materialIndex }, setState] = useState({ baseMaterial: [...materialTypes.keys()][0] || FASAD_TYPE.EMPTY, materialIndex: 0 })
    const deleteMaterial = useSetAtom(deleteMaterialAtom)
    const addMaterial = useSetAtom(addMaterialAtom)
    const updateMaterial = useSetAtom(updateMaterialAtom)
    const materials: FasadMaterial[] = useMemo(() => (materialList.filter(m => m.type === baseMaterial) || [{ name: "", type: "" }]).toSorted((m1, m2) => (m1.name > m2.name) ? 1 : -1), [materialList, baseMaterial]);
    const material = materials[materialIndex] || { name: "", code: "", image: "", type: FASAD_TYPE.DSP, purpose: MAT_PURPOSE.BOTH }
    const image = useImageUrl(material.id)
    const purposeEnabled = material?.type === FASAD_TYPE.DSP
    const heads = ['Наименование', 'Код', 'Назначение']
    const contents = materials.map((i: FasadMaterial) => [i.name, i.code, MATPurpose.get(i.purpose) || ""])
    const editItems: EditDataItem[] = [
        { caption: "Наименование:", value: material.name || "", message: messages.ENTER_CAPTION, type: InputType.TEXT },
        { caption: "Код:", value: material.code, message: messages.ENTER_CODE, type: InputType.TEXT },
        { caption: "Назначение:", value: material.purpose || "", valueCaption: (value) => MATPurpose.get(value as MAT_PURPOSE) || "", list: [...MATPurpose.keys()], message: messages.ENTER_PURPOSE, type: InputType.LIST, readonly: !purposeEnabled },
        { caption: "Изображение:", value: image || "", message: messages.ENTER_IMAGE, type: InputType.FILE },
    ]
    return <EditContainer>
        <div>
            <div className="d-flex flex-nowrap gap-2 align-items-start">
                <ComboBox<FASAD_TYPE> title="Материал: " value={baseMaterial} items={[...materialTypes.keys()]} displayValue={(value => materialTypes.get(value) || "")} 
                    onChange={(_, value) => { 
                        setState((prev) => ({ ...prev, baseMaterial: value, materialIndex: 0 }));
                         }} />
            </div>
            <hr />
            <TableData heads={heads} content={contents} onSelectRow={(index) => { setState((prev) => ({ ...prev, materialIndex: index })) }} />
        </div>
        {(perm?.Read) ? <EditDataSection name={material.name} items={editItems}
            onUpdate={perm?.Update ? async (checked, values) => {
                const usedName = checked[0] ? values[0] : ""
                const usedCode = checked[1] ? values[1] : ""
                const usedPurpose = checked[2] ? values[2] : MAT_PURPOSE.FASAD
                const usedFile = checked[3] ? values[3] as string : ""
                const result = await updateMaterial({ id: material.id, type: baseMaterial as FASAD_TYPE, name: usedName as string, code: usedCode as string, image: usedFile, purpose: usedPurpose as MAT_PURPOSE})
                return result
            } : undefined}
            onDelete={perm?.Delete ? async () => {
                const result = await deleteMaterial(material.id)
                setState((prev) => ({ ...prev, materialIndex: 0 }))
                return result
            } : undefined}
            onAdd={perm?.Create ? async (checked, values) => {
                const name = values[0] as string
                const code = values[1] as string
                const purpose = values[2] as MAT_PURPOSE
                const file = values[3] as string
                if (existMaterial(name, baseMaterial, materialList)) { return { success: false, message: messages.MATERIAL_EXIST } }
                const result = await addMaterial({ name, type: baseMaterial as FASAD_TYPE, code, image: "", purpose }, file)
                return result
            } : undefined} /> : <div></div>}
    </EditContainer>
}
