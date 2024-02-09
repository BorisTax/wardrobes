import { useAtom } from "jotai";
import { messageDialogAtom } from "../atoms/dialogs";

export default function useMessage() {
    const [{ dialogRef }, setMessage] = useAtom(messageDialogAtom)
    return (message: string) => {
        setMessage(message);
        dialogRef?.current?.showModal()
    }
}