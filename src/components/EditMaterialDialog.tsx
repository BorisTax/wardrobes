import { useEffect, useRef, useState } from "react"
import { useAtom, useSetAtom } from "jotai"
import { editMaterialDialogAtom } from "../atoms/dialogs"
import { existMaterial, getFasadMaterial } from "../functions/functions"
import ComboBox from "./ComboBox"
import { ExtMaterial } from "../types/materials"
import { FasadMaterial } from "../types/enums"
import { Materials } from "../assets/data"
import { usedUrl } from "../options"
import { addMaterialAtom, deleteMaterialAtom, loadMaterialListAtom, materialListAtom } from "../atoms/materials"

type DialogProps = {
    dialogRef: React.RefObject<HTMLDialogElement>
}

export default function EditMaterialDialog(props: DialogProps) {
    const [materialList] = useAtom(materialListAtom)
    const loadMaterialList = useSetAtom(loadMaterialListAtom)
    const [baseMaterial, setBaseMaterial] = useState(FasadMaterial.DSP)
    const [extMaterialIndex, setExtMaterialIndex] = useState(0)
    const [state, setState] = useState<{ message: string, imageData: File | null }>({ message: "", imageData: null })
    const closeDialog = () => { props.dialogRef.current?.close() }
    const [_, setMaterialDialogRef] = useAtom(editMaterialDialogAtom)
    const deleteMaterial = useSetAtom(deleteMaterialAtom)
    const addMaterial = useSetAtom(addMaterialAtom)
    const extMaterials: ExtMaterial[] = materialList.get(baseMaterial) || [{ name: "", material: "", imageurl: "" }]
    const imageSrc = `${usedUrl}images/${extMaterials[extMaterialIndex].imageurl}`
    const nameRef = useRef<HTMLInputElement>(null)
    const codeRef = useRef<HTMLInputElement>(null)
    const imageRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        setMaterialDialogRef(props.dialogRef)
    }, [])
    return <dialog ref={props.dialogRef}>
        <div className="d-flex flex-nowrap gap-2 align-items-start">
            <div>
                <div className="property-grid">
                    <ComboBox title="Материал: " value={baseMaterial} items={Materials} onChange={(_, value: string) => { setBaseMaterial(getFasadMaterial(value)); setExtMaterialIndex(0) }} />
                    <ComboBox title="Цвет/Рисунок: " value={extMaterials[extMaterialIndex].name} items={extMaterials.map((m: ExtMaterial) => m.name)} onChange={(index, value) => { setExtMaterialIndex(index) }} />
                </div>
                <br />
                <input style={{ width: "200px", height: "200px", border: "1px solid black" }} name="image" type="image" alt="Нет изображения" src={imageSrc} />
            </div>
            <input type="button" value="Удалить" onClick={() => { deleteMaterial(extMaterials[extMaterialIndex]) }} />
        </div>
        <hr />
        <div className="d-flex flex-nowrap gap-2 align-items-start">
            <hr />
            <div className="property-grid">
                <span className="text-end text-nowrap">Новый:</span>
                <input type="text" ref={nameRef} />
                <span className="text-end text-nowrap">Код:</span>
                <input type="text" ref={codeRef} />
                <span className="text-end text-nowrap">Изображение</span>
                <input type="file" ref={imageRef} onChange={() => {
                    if (!(imageRef.current && imageRef.current.files)) return
                    const file = imageRef.current.files[0]
                    setState({ ...state, imageData: file });
                    // const reader = new FileReader();
                    // reader.readAsDataURL(file);
                    // reader.onload = function () {
                    //     console.log(file)
                    //     setState({ ...state, imageData: reader.result });
                    // };
                    // reader.onerror = function (error) {
                    //     console.log('Error: ', error);
                    // };
                }} />
            </div>
            <input type="button" value="Добавить" onClick={() => {
                const name = nameRef.current?.value || ""
                const code = codeRef.current?.value || ""
                if (existMaterial(name, baseMaterial, materialList)) setState({ ...state, message: "Материал уже существует" });
                else addMaterial({ name, material: baseMaterial, code1c: code, imageurl: "" }, state.imageData);
            }
            } />
        </div>
        <hr />
        <div className="d-flex flex-column gap-1 align-items-start">

            <input type="button" value="Закрыть" onClick={() => closeDialog()} />
        </div>
        <div>{state.message}</div>
    </dialog>
}