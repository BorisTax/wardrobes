import { useAtom } from "jotai";
import { notifyMessageAtom } from "../../atoms/messages";

export default function NotifyMessage(){
    const [message, setMessage] = useAtom(notifyMessageAtom)
    return <div className={message ? "notifyMessageOn" : "notifyMessageOff"} onClick={() => setMessage("")}>{message}</div>
}