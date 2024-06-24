import { useEffect, useRef, useState } from "react"
import { useSetAtom } from "jotai"
import { loginDialogAtom } from "../../atoms/dialogs"
import onFetch from "../../functions/fetch"
import { Result } from "../../types/server"
import CheckBox from "../inputs/CheckBox"
import { userAtom } from "../../atoms/users"

export default function LoginDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const setUser = useSetAtom(userAtom)
    const [state, setState] = useState({ loading: false, message: "" })
    const closeDialog = () => { dialogRef.current?.close() }
    const setLoginDialogRef = useSetAtom(loginDialogAtom)
    const login = (name: string, password: string) => {
        setState({ loading: true, message: "" })
        const onResolve = (r: Result<string | null>) => { setUser(r.data as string); closeDialog() }
        const onReject = () => { setState({ loading: false, message: "Неверные имя пользователя и/или пароль" }) }
        const onCatch = () => { setState({ loading: false, message: "Ошибка сервера" }) }
        onFetch('/api/users/login', JSON.stringify({ name, password }), onResolve, onReject, onCatch)
    }
    useEffect(() => {
        setLoginDialogRef(dialogRef)
    }, [setLoginDialogRef, dialogRef])
    return <dialog ref={dialogRef} onClose={() => { setPassword("") }}>
        <form id="loginForm" onSubmit={(e) => {
            e.preventDefault(); 
            const formData = new FormData(document.getElementById("loginForm") as HTMLFormElement)
            login(formData.get("name") as string, formData.get("password") as string)
        }}>
            <div className="table-grid"> 
                <label htmlFor="name">Логин</label>
                <input id="name" name="name" required />
                <label htmlFor="pass">Пароль</label>
                <input id="pass" name="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value) }} required />
                <div></div>
                <div className="d-flex gap-1 align-items-baseline">
                    <CheckBox id="showPass" checked={showPassword} onChange={() => { setShowPassword(!showPassword) }} />
                    <label htmlFor="showPass">показать пароль</label>
                </div>
            </div>
            <br />
            <div className="d-flex flex-column gap-2">
                <input className="btn btn-primary" type="submit" value="Вход" />
                <input className="btn btn-secondary" type="button" value="Отмена" onClick={() => closeDialog()} />
                <div>{state.message}</div>
            </div>
        </form>
    </dialog>
}