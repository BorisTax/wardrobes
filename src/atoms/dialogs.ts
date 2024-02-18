import { Getter, Setter, atom } from "jotai";
import React from "react";

type MessageAtom = {
    dialogRef: React.RefObject<HTMLDialogElement> | null
    message: string
}
type ConfirmAtom = {
    dialogRef: React.RefObject<HTMLDialogElement> | null
    message: string
    onYesAction: () => void
    onNoAction?: () => void
}
const loginDialog = atom<React.RefObject<HTMLDialogElement> | null>(null)
export const loginDialogAtom = atom((get: Getter) => get(loginDialog), (get: Getter, set: Setter, loginDialogRef: React.RefObject<HTMLDialogElement> | null) => {
    set(loginDialog, loginDialogRef)
})
export const editMaterialDialogAtom = atom<React.RefObject<HTMLDialogElement> | null>(null)
export const editProfileDialogAtom = atom<React.RefObject<HTMLDialogElement> | null>(null)
const messageAtom = atom<MessageAtom>({ dialogRef: null, message: "" })
export const messageDialogAtom = atom((get) => get(messageAtom), (get, set, message: string) => {
    const state = get(messageAtom)
    set(messageAtom, { ...state, message })
})

export const messageDialogRefAtom = atom(null, (get, set, dialogRef: React.RefObject<HTMLDialogElement> | null) => {
    const state = get(messageAtom)
    set(messageAtom, { ...state, dialogRef })
})

const confirmAtom = atom<ConfirmAtom>({ dialogRef: null, message: "", onYesAction: () => { }, onNoAction: () => { } })

export const confirmDialogAtom = atom((get) => get(confirmAtom), (get, set, { message, onYesAction, onNoAction = () => { } }) => {
    const state = get(confirmAtom)
    set(confirmAtom, { ...state, message, onYesAction, onNoAction })
})

export const confirmDialogRefAtom = atom(null, (get, set, dialogRef: React.RefObject<HTMLDialogElement> | null) => {
    const state = get(confirmAtom)
    set(confirmAtom, { ...state, dialogRef })
})