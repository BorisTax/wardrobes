import React from "react";
import ImageButton from "./ImageButton";

type DialogWindowProps = {
    dialogRef: React.RefObject<HTMLDialogElement> 
    children: React.ReactNode
    title?: string
    menuButtons?: React.ReactNode
}

export default function DialogWindow(props: DialogWindowProps) {
    const closeDialog = () => { props.dialogRef.current?.close() }
    return <dialog ref={props.dialogRef}>
        <div className="dialog-header-bar">
            <div>{props.title || ""}</div>
            {props.menuButtons || <div></div>}
            <ImageButton title="Закрыть" icon='close' onClick={() => closeDialog()} />
        </div>
        <hr/>
        {props.children}
    </dialog>
}