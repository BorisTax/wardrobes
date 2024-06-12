import { useMemo, useRef, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { MATPurpose, existMaterial, getFasadMaterial } from "../../../functions/materials"
import ComboBox from "../../ComboBox"
import { ExtMaterial } from "../../../types/materials"
import { MAT_PURPOSE, FasadMaterial } from "../../../types/enums"
import { Materials } from "../../../functions/materials"
import { addMaterialAtom, deleteMaterialAtom, materialListAtom, updateMaterialAtom } from "../../../atoms/materials/materials"
import useMessage from "../../../custom-hooks/useMessage"
import useConfirm from "../../../custom-hooks/useConfirm"
import Button from "../../Button"
import { rusMessages } from "../../../functions/messages"
import { EditDialogProps } from "../EditMaterialDialog"

export default function EditPlates(props: EditDialogProps) {
    const materialList = useAtomValue(materialListAtom)
    const [{ baseMaterial, extMaterialIndex }, setState] = useState({ baseMaterial: FasadMaterial.DSP, extMaterialIndex: 0 })
    const deleteMaterial = useSetAtom(deleteMaterialAtom)
    const addMaterial = useSetAtom(addMaterialAtom)
    const updateMaterial = useSetAtom(updateMaterialAtom)
    const extMaterials: ExtMaterial[] = useMemo(() => materialList.filter(m => m.material === baseMaterial) || [{ name: "", material: "", imageurl: "" }], [materialList, baseMaterial]);
    const imageSrc = extMaterials[extMaterialIndex]?.image || ""
    const purpose = extMaterials[extMaterialIndex]?.purpose
    const [{ newName, newCode, newImageSrc, newPurpose }, setNewValues] = useState({ newName: extMaterials[extMaterialIndex]?.name || "", newCode: extMaterials[extMaterialIndex]?.code || "", newImageSrc: imageSrc, newPurpose: purpose })
    const [{ nameChecked, codeChecked, imageChecked, purposeChecked }, setChecked] = useState({ nameChecked: false, codeChecked: false, imageChecked: false, purposeChecked: false })
    const purposeEnabled = extMaterials[extMaterialIndex]?.material === FasadMaterial.DSP
    const [imageFileName, setImageFileName] = useState("???")
    const extMaterialNames = useMemo(() => extMaterials.map((m: ExtMaterial) => m.name), [extMaterials])
    useMemo(() => {
        setNewValues({ newName: extMaterials[extMaterialIndex]?.name || "", newCode: extMaterials[extMaterialIndex]?.code || "", newImageSrc: imageSrc, newPurpose: purpose })
        if (!purposeEnabled) setChecked(prev => ({ ...prev, purposeChecked: false }))
    }, [extMaterials, extMaterialIndex, imageSrc])
    const nameRef = useRef<HTMLInputElement>(null)
    const codeRef = useRef<HTMLInputElement>(null)
    const imageRef = useRef<HTMLInputElement>(null)
    const showMessage = useMessage()
    const showConfirm = useConfirm()
    return <>
    <div className="d-flex flex-nowrap gap-2 align-items-start">
            <div>
                <div className="table-grid">
                    <ComboBox title="Материал: " value={baseMaterial} items={Materials} onChange={(_, value: string) => { setState((prev) => ({ ...prev, baseMaterial: getFasadMaterial(value), extMaterialIndex: 0 })); }} />
                    <ComboBox title="Цвет/Рисунок: " value={extMaterials[extMaterialIndex]?.name} items={extMaterialNames} onChange={(index) => { setState((prev) => ({ ...prev, extMaterialIndex: index })) }} />
                </div>
                <br />
                <input style={{ width: "200px", height: "200px", border: "1px solid black" }} name="image" type="image" alt="Нет изображения" src={newImageSrc} onClick={() => imageRef.current?.click()} />
            </div>
        </div>
        <hr />
        <div className="editmaterial-container">
            <hr />
            <div className="table-grid">
                <span className="text-end text-nowrap">Наименование:</span>
                <div className="d-flex justify-content-start gap-2">
                    <input type="checkbox" checked={nameChecked} onChange={() => { setChecked(prev => ({ ...prev, nameChecked: !nameChecked })) }} />
                    <input type="text" ref={nameRef} value={newName} onChange={(e) => { setNewValues(prev => ({ ...prev, newName: e.target.value })) }} disabled={!nameChecked}/>
                </div>
                <span className="text-end text-nowrap">Код:</span>
                <div className="d-flex justify-content-start gap-2">
                    <input type="checkbox" checked={codeChecked} onChange={() => { setChecked(prev => ({ ...prev, codeChecked: !codeChecked })) }} />
                    <input type="text" ref={codeRef} value={newCode} onChange={(e) => { setNewValues(prev => ({ ...prev, newCode: e.target.value })) }} disabled={!codeChecked}/>
                </div>
                <span className="text-end text-nowrap">Назначение:</span>
                <div className="d-flex justify-content-start gap-2">
                    <input type="checkbox" checked={purposeChecked} disabled={!purposeEnabled} onChange={() => { setChecked(prev => ({ ...prev, purposeChecked: !purposeChecked })) }} />
                    <ComboBox value={MATPurpose.get(newPurpose) || ""} disabled={!purposeEnabled || !purposeChecked} items={MATPurpose} 
                            onChange={(_, value: string) => { 
                                setNewValues(prev => ({ ...prev, newPurpose: value as MAT_PURPOSE })); 
                                }} />
                </div>
                <span className="text-end text-nowrap">Изображение:</span>
                <div className="d-flex justify-content-start gap-2">
                    <input type="checkbox" checked={imageChecked} onChange={() => { setChecked(prev => ({ ...prev, imageChecked: !imageChecked })) }} />
                    <input style={{ display: "none" }} type="file" ref={imageRef} accept="image/jpg, image/png, image/jpeg" src={newImageSrc} onChange={(e) => {
                        const file = e.target.files && e.target.files[0]
                        let reader = new FileReader();
                        reader.onload = function () {
                            setNewValues(prev => ({ ...prev, newImageSrc: reader?.result as string || "" }))
                            setImageFileName(file?.name || "")
                        }
                        reader.readAsDataURL(file as Blob);
                    }}
                    />
                    <span className="text-start text-wrap">{imageFileName}</span>
                </div>
            </div>
            <div className="editmaterial-buttons-container">
                <input type="button" value="Удалить" onClick={() => {
                    const name = extMaterials[extMaterialIndex].name
                    const message = `Удалить материал: "${Materials.get(baseMaterial)} - ${name}" ?`
                    showConfirm(message, () => {
                        props.setLoading(true)
                        deleteMaterial(extMaterials[extMaterialIndex], (result) => {
                            props.setLoading(false)
                            showMessage(rusMessages[result.message])
                        });
                        setState((prev) => ({ ...prev, extMaterialIndex: 0 }))
                    })
                }} />
                <Button caption="Добавить" disabled={!(nameChecked && codeChecked && purposeChecked)} onClick={() => {
                    const name = newName
                    const code = newCode
                    const file = newImageSrc
                    const purpose = newPurpose
                    if (!checkFields({ imageChecked, newName, newCode, file }, showMessage)) return
                    if (existMaterial(name, baseMaterial, materialList)) { showMessage("Материал уже существует"); return }
                    const message = getAddMessage({ material: Materials.get(baseMaterial) || "", name: newName, code: newCode, purpose: MATPurpose.get(purpose) as string })
                    showConfirm(message, () => {
                        props.setLoading(true)
                        addMaterial({ name, material: baseMaterial, code, image: "", purpose }, file, (result) => {
                            props.setLoading(false)
                            showMessage(rusMessages[result.message])
                        });
                    })
                }} />
                <input type="button" value="Заменить" disabled={!(nameChecked || codeChecked || imageChecked || purposeChecked)} onClick={() => {
                    const name = extMaterials[extMaterialIndex].name
                    const file = newImageSrc
                    if (!checkFields({ nameChecked, codeChecked, imageChecked, newName, newCode, file }, showMessage)) return
                    const material = baseMaterial
                    const message = getMessage({ nameChecked, codeChecked, imageChecked, purposeChecked, name, code: extMaterials[extMaterialIndex].code, purpose: MATPurpose.get(purpose) as string, newName, newCode, newPurpose: MATPurpose.get(newPurpose) as string })
                    showConfirm(message, () => {
                        const usedName = nameChecked ? newName : ""
                        const usedCode = codeChecked ? newCode : ""
                        const usedFile = imageChecked ? file : null
                        const usedPurpose = purposeChecked ? newPurpose : MAT_PURPOSE.FASAD
                        props.setLoading(true)
                        updateMaterial({ name, material, newName: usedName, newCode: usedCode, image: usedFile, purpose: usedPurpose }, (result) => {
                            props.setLoading(false)
                            showMessage(rusMessages[result.message])
                        })
                    })
                }} />
            </div>
        </div>
        </>
}

function checkFields({ nameChecked = true, codeChecked = true, imageChecked, newName, newCode, file }: { nameChecked?: boolean, codeChecked?: boolean, imageChecked: boolean, newName: string, newCode: string, file: string }, showMessage: (message: string) => void) {
    if (nameChecked && newName.trim() === "") {
        showMessage("Введите наименование")
        return false
    }
    if (codeChecked && newCode.trim() === "") {
        showMessage("Введите код")
        return false
    }
    if (imageChecked && !file) {
        showMessage("Выберите изображение")
        return false
    }
    return true
}

function getMessage({ nameChecked, codeChecked, imageChecked, purposeChecked, name, code, purpose, newName, newCode, newPurpose }: { nameChecked: boolean, codeChecked: boolean, imageChecked: boolean, purposeChecked: boolean, name: string, code: string, purpose: string, newName: string, newCode: string, newPurpose: string }): string {
    const changeName = nameChecked ? `материал: "${name}"` : ""
    const changeCode = codeChecked ? `код:"${code}"` : ""
    const changePurpose = purposeChecked ? `назначение: "${purpose}"` : ""
    const changeImage = imageChecked ? `изображение` : ""
    
    const changeName2 = nameChecked ? `"${newName}"` : ""
    const changeCode2 = codeChecked ? `код:"${newCode}"` : ""
    const changePurpose2 = purposeChecked ? `назначение:"${newPurpose}"` : ""
    const sub1 = (nameChecked || codeChecked) && imageChecked ? "и" : ""
    const sub2 = nameChecked || codeChecked ? "на" : ""
    const message = `Заменить ${changeName} ${changeCode} ${changePurpose} ${sub2} ${changeName2} ${changeCode2} ${changePurpose2} ${sub1} ${changeImage} ?`
    return message
}

function getAddMessage({ material, name, code, purpose }: { material: string, name: string, code: string, purpose: string }): string {
    const message = `Добавить материал ${material} - ${name}, код: ${code} ?`
    return message
}