import React from "react";
import ImageButton from "../ImageButton";

type DialogWindowProps = {
    dialogRef: React.RefObject<HTMLDialogElement> 
    children: React.ReactNode
    title?: string
    menuButtons?: React.ReactNode
    onClose?: () => void
}

export default function DialogWindow(props: DialogWindowProps) {
    return <dialog ref={props.dialogRef}>
        <div className="dialog-header-bar">
            <div>{props.title || ""}</div>
            {props.menuButtons || <div></div>}
            <ImageButton title="Закрыть" icon='close' onClick={() => {
                if (props.onClose) props.onClose()
                props.dialogRef.current?.close()
            }} />
        </div>
        <hr/>
        {props.children}
    </dialog>
}