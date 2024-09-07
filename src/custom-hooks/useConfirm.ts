import { useAtom } from "jotai";
import { confirmDialogAtom } from "../atoms/dialogs";

export default function useConfirm() {
    const [{ dialogRef }, setConfirm] = useAtom(confirmDialogAtom)
    return async (message: string) => {
        return new Promise<boolean>((resolve)=>{
            setConfirm({ message, onYesAction: () => resolve(true), onNoAction: () => resolve(false) });
            dialogRef?.current?.showModal()
        })
    }
}