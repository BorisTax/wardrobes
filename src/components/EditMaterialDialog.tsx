import { useEffect, useMemo, useRef, useState } from "react"
import { useAtom, useSetAtom } from "jotai"
import { editMaterialDialogAtom } from "../atoms/dialogs"
import { existMaterial, getFasadMaterial } from "../functions/materials"
import ComboBox from "./ComboBox"
import { ExtMaterial } from "../server/types/materials"
import { FasadMaterial } from "../types/enums"
import { MaterialCaptions, Materials } from "../functions/materials"
import { imagesSrcUrl } from "../options"
import { addMaterialAtom, deleteMaterialAtom, materialListAtom, updateMaterialAtom } from "../atoms/materials"
import useMessage from "../custom-hooks/useMessage"
import useConfirm from "../custom-hooks/useConfirm"
import Button from "./Button"
import { rusMessages } from "../functions/messages"
import ImageButton from "./ImageButton"
import DialogWindow from "./DialogWindow"

export default function EditMaterialDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const [materialList] = useAtom(materialListAtom)
    const [{ baseMaterial, extMaterialIndex }, setState] = useState({ baseMaterial: FasadMaterial.DSP, extMaterialIndex: 0 })
    const [, setMaterialDialogRef] = useAtom(editMaterialDialogAtom)
    const deleteMaterial = useSetAtom(deleteMaterialAtom)
    const addMaterial = useSetAtom(addMaterialAtom)
    const updateMaterial = useSetAtom(updateMaterialAtom)
    const extMaterials: ExtMaterial[] = useMemo(() => materialList.get(baseMaterial) || [{ name: "", material: "", imageurl: "" }], [materialList, baseMaterial]);
    const imageSrc = `${imagesSrcUrl}${extMaterials[extMaterialIndex].image || ""}`
    const [{ newName, newCode, newImageSrc }, setNewValues] = useState({ newName: extMaterials[extMaterialIndex].name || "", newCode: extMaterials[extMaterialIndex].code || "", newImageSrc: imageSrc })
    const [{ nameChecked, codeChecked, imageChecked }, setChecked] = useState({ nameChecked: false, codeChecked: false, imageChecked: false })
    const [imageFileName, setImageFileName] = useState("???")
    useMemo(() => {
        setNewValues({ newName: extMaterials[extMaterialIndex].name || "", newCode: extMaterials[extMaterialIndex].code || "", newImageSrc: imageSrc })
    }, [extMaterials, extMaterialIndex, imageSrc])
    const nameRef = useRef<HTMLInputElement>(null)
    const codeRef = useRef<HTMLInputElement>(null)
    const imageRef = useRef<HTMLInputElement>(null)
    const showMessage = useMessage()
    const showConfirm = useConfirm()
    useEffect(() => {
        setMaterialDialogRef(dialogRef)
    }, [setMaterialDialogRef, dialogRef])
    return <DialogWindow dialogRef={dialogRef}>
        <div className="d-flex flex-nowrap gap-2 align-items-start">
            <div>
                <div className="property-grid">
                    <ComboBox title="Материал: " value={baseMaterial} items={Materials} onChange={(_, value: string) => { setState((prev) => ({ ...prev, baseMaterial: getFasadMaterial(value), extMaterialIndex: 0 })); }} />
                    <ComboBox title="Цвет/Рисунок: " value={extMaterials[extMaterialIndex].name} items={extMaterials.map((m: ExtMaterial) => m.name)} onChange={(index) => { setState((prev) => ({ ...prev, extMaterialIndex: index })) }} />
                </div>
                <br />
                <input style={{ width: "200px", height: "200px", border: "1px solid black" }} name="image" type="image" alt="Нет изображения" src={newImageSrc} onClick={() => imageRef.current?.click()} />
            </div>
        </div>
        <hr />
        <div className="editmaterial-container">
            <hr />
            <div className="property-grid">
                <span className="text-end text-nowrap">Наименование:</span>
                <div className="d-flex justify-content-start gap-2">
                    <input type="checkbox" checked={nameChecked} onChange={() => { setChecked(prev => ({ ...prev, nameChecked: !nameChecked })) }} />
                    <input type="text" ref={nameRef} value={newName} onChange={(e) => { setNewValues(prev => ({ ...prev, newName: e.target.value })) }} />
                </div>
                <span className="text-end text-nowrap">Код:</span>
                <div className="d-flex justify-content-start gap-2">
                    <input type="checkbox" checked={codeChecked} onChange={() => { setChecked(prev => ({ ...prev, codeChecked: !codeChecked })) }} />
                    <input type="text" ref={codeRef} value={newCode} onChange={(e) => { setNewValues(prev => ({ ...prev, newCode: e.target.value })) }} />
                </div>
                <span className="text-end text-nowrap">Изображение:</span>
                <div className="d-flex justify-content-start gap-2">
                    <input type="checkbox" checked={imageChecked} onChange={() => { setChecked(prev => ({ ...prev, imageChecked: !imageChecked })) }} />
                    <input style={{ display: "none" }} type="file" ref={imageRef} accept="image/jpg, image/png, image/jpeg" src={newImageSrc} onChange={(e) => {
                        const file = e.target.files && e.target.files[0]
                        const url = file ? URL.createObjectURL(file) : ""
                        setNewValues(prev => ({ ...prev, newImageSrc: url || "" }))
                        setImageFileName(file?.name || "")
                    }} />
                    <span className="text-start text-wrap">{imageFileName}</span>
                </div>
            </div>
            <div className="editmaterial-buttons-container">
                <input type="button" value="Удалить" onClick={() => {
                    const name = extMaterials[extMaterialIndex].name
                    const message = `Удалить материал: "${MaterialCaptions.get(baseMaterial)} - ${name}" ?`
                    showConfirm(message, () => {
                        deleteMaterial(extMaterials[extMaterialIndex], (result) => {
                            showMessage(rusMessages[result.message])
                        });
                        setState((prev) => ({ ...prev, extMaterialIndex: 0 }))
                    })
                }} />
                <Button caption="Добавить" disabled={!(nameChecked && codeChecked)} onClick={() => {
                    const name = newName
                    const code = newCode
                    const file = imageRef.current && imageRef.current.files && imageRef.current.files[0]
                    if (!checkFields({ imageChecked, newName, newCode, file }, showMessage)) return
                    if (existMaterial(name, baseMaterial, materialList)) { showMessage("Материал уже существует"); return }
                    const message = getAddMessage({ material: MaterialCaptions.get(baseMaterial) || "", name: newName, code: newCode })
                    showConfirm(message, () => {
                        addMaterial({ name, material: baseMaterial, code, image: "" }, file, (result) => {
                            showMessage(rusMessages[result.message])
                        });
                    })
                }} />
                <input type="button" value="Заменить" disabled={!(nameChecked || codeChecked || imageChecked)} onClick={() => {
                    const name = extMaterials[extMaterialIndex].name
                    const file = imageRef.current && imageRef.current.files && imageRef.current.files[0]
                    if (!checkFields({ nameChecked, codeChecked, imageChecked, newName, newCode, file }, showMessage)) return
                    const material = baseMaterial
                    const message = getMessage({ nameChecked, codeChecked, imageChecked, name, code: extMaterials[extMaterialIndex].code, newName, newCode })
                    showConfirm(message, () => {
                        const usedName = nameChecked ? newName : ""
                        const usedCode = codeChecked ? newCode : ""
                        const usedFile = imageChecked ? file : null
                        updateMaterial({ name, material, newName: usedName, newCode: usedCode, image: usedFile }, (result) => {
                            showMessage(rusMessages[result.message])
                        })
                    })
                }} />
            </div>
        </div>
        </DialogWindow>        
}

function checkFields({ nameChecked = true, codeChecked = true, imageChecked, newName, newCode, file }: { nameChecked?: boolean, codeChecked?: boolean, imageChecked: boolean, newName: string, newCode: string, file: File | null }, showMessage: (message: string) => void) {
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

function getMessage({ nameChecked, codeChecked, imageChecked, name, code, newName, newCode }: { nameChecked: boolean, codeChecked: boolean, imageChecked: boolean, name: string, code: string, newName: string, newCode: string }): string {
    const changeName = nameChecked ? `материал: "${name}"` : ""
    const changeCode = codeChecked ? `код:"${code}"` : ""
    const changeImage = imageChecked ? `изображение` : ""
    const changeName2 = nameChecked ? `"${newName}"` : ""
    const changeCode2 = codeChecked ? `код:"${newCode}"` : ""
    const sub1 = (nameChecked || codeChecked) && imageChecked ? "и" : ""
    const sub2 = nameChecked || codeChecked ? "на" : ""
    const message = `Заменить ${changeName} ${changeCode} ${sub2} ${changeName2} ${changeCode2} ${sub1} ${changeImage} ?`
    return message
}

function getAddMessage({ material, name, code }: { material: string, name: string, code: string }): string {
    const message = `Добавить материал ${material} - ${name}, код: ${code} ?`
    return message
}