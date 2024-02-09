import { useAtom } from "jotai";
import { confirmDialogAtom } from "../atoms/dialogs";

export default function useConfirm() {
    const [{ dialogRef }, setConfirm] = useAtom(confirmDialogAtom)
    return (message: string, onYesAction: () => void, onNoAction?: () => void) => {
        setConfirm({ message, onYesAction, onNoAction });
        dialogRef?.current?.showModal()
    }
}