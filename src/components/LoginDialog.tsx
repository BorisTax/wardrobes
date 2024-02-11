import { useEffect, useState } from "react"
import useFetch from "../custom-hooks/useFetch"
import { useAtom, useSetAtom } from "jotai"
import { setUserAtom } from "../atoms/users"
import { loginDialogAtom } from "../atoms/dialogs"

type DialogProps = {
    dialogRef: React.RefObject<HTMLDialogElement>
}

export default function LoginDialog(props: DialogProps) {
    const [password, setPassword] = useState("")
    const setUser = useSetAtom(setUserAtom)
    const [state, setState] = useState({ loading: false, message: "" })
    const closeDialog = () => { props.dialogRef.current?.close() }
    const [_, setLoginDialogRef] = useAtom(loginDialogAtom)
    const login = (name: string, password: string) => {
        setState({ loading: true, message: "" })
        const onResolve = (r: any) => { setUser({ name: r.name, role: r.role, token: r.token }); closeDialog() }
        const onReject = () => { setState({ loading: false, message: "Неверные имя пользователя и/или пароль" }) }
        const onCatch = () => { setState({ loading: false, message: "Ошибка сервера" }) }
        useFetch('api/users/login', JSON.stringify({ name, password }), onResolve, onReject, onCatch)
    }
    useEffect(() => {
        setLoginDialogRef(props.dialogRef)
    }, [])
    useEffect(() => { setPassword("") }, [props.dialogRef?.current?.open])
    return <dialog ref={props.dialogRef}>
        <form id="loginForm" onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(document.getElementById("loginForm") as HTMLFormElement)
            login(formData.get("name") as string, formData.get("password") as string)
        }}>
            <div className="property-grid">
                <label htmlFor="name">Логин</label>
                <input id="name" name="name" required />
                <label htmlFor="pass">Пароль</label>
                <input id="pass" name="password" type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} required />
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