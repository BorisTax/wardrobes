import { Getter, Setter, atom } from "jotai";
import React from "react";
import { loadSpecificationListAtom } from "./specification";
import { loadActiveUsersAtom, loadUsersAtom } from "./users";
import { loadTemplateListAtom } from "./templates";

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
export const rerenderDialogAtom = atom(0)

const loginDialog = atom<React.RefObject<HTMLDialogElement> | null>(null)
export const loginDialogAtom = atom((get: Getter) => get(loginDialog), (get: Getter, set: Setter, loginDialogRef: React.RefObject<HTMLDialogElement> | null) => {
    set(loginDialog, loginDialogRef)
})
export const editMaterialDialogAtom = atom<React.RefObject<HTMLDialogElement> | null>(null)
export const editProfileDialogAtom = atom<React.RefObject<HTMLDialogElement> | null>(null)
export const editPriceDialogAtom = atom<React.RefObject<HTMLDialogElement> | null>(null)
export const editSpecificationDialogAtom = atom<React.RefObject<HTMLDialogElement> | null>(null)
export const templatesDialogAtom = atom<React.RefObject<HTMLDialogElement> | null>(null)
export const verboseDialogAtom = atom<React.RefObject<HTMLDialogElement> | null>(null)
export const editDetailDialogAtom = atom<React.RefObject<HTMLDialogElement> | null>(null)
export const templatesDialogPropsAtom = atom(false)
export const showTemplatesDialogAtom = atom(null, (get, set, edit: boolean) => {
    const dialogRef = get(templatesDialogAtom)
    set(loadTemplateListAtom)
    set(templatesDialogPropsAtom, edit)
    dialogRef?.current?.showModal()
})
export const showDetailDialogAtom = atom(null, (get) => {
    const dialogRef = get(editDetailDialogAtom)
    dialogRef?.current?.showModal()
})
export const showVerboseDialogAtom = atom(null, (get) => {
    const dialogRef = get(verboseDialogAtom)
    //set(loadVerboseDataAtom, data, item)
    dialogRef?.current?.showModal()
})
export const specificationDialogAtom = atom<React.RefObject<HTMLDialogElement> | null>(null)
export const showSpecificationDialogAtom = atom(null, (get) => {
    const dialogRef = get(specificationDialogAtom)
    dialogRef?.current?.showModal()
})
export const showEditSpecificationDialogAtom = atom(null, (get, set) => {
    const dialogRef = get(editSpecificationDialogAtom)
    set(loadSpecificationListAtom)
    dialogRef?.current?.showModal()
})
export const schemaDialogAtom = atom<React.RefObject<HTMLDialogElement> | null>(null)
export const showSchemaDialogAtom = atom(null, (get, set) => {
    const dialogRef = get(schemaDialogAtom)
    dialogRef?.current?.showModal()
    set(rerenderDialogAtom, Math.random())
})
export const editUsersDialogAtom = atom<React.RefObject<HTMLDialogElement> | null>(null)
export const showEditUsersDialogAtom = atom(null, (get, set) => {
    const dialogRef = get(editUsersDialogAtom)
    set(loadUsersAtom)
    set(loadActiveUsersAtom)
    dialogRef?.current?.showModal()
})
export const settingsDialogAtom = atom<React.RefObject<HTMLDialogElement> | null>(null)
export const copyFasadDialogAtom = atom<React.RefObject<HTMLDialogElement> | null>(null)

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