import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";
import { getInitialPermissions, loadActiveUsersAtom, standbyUserAtom, userAtom, verifyUserAtom } from "../atoms/users";
import { RESOURCE, UserRoles } from "../types/user";
import { waitForMessageFromServer } from "../functions/user";
import useMessage from "../custom-hooks/useMessage";
import { SERVER_EVENTS } from "../types/enums";

export default function EventListener() {
  const [user, setUserDirectly] = useAtom(userAtom)
  const perm = user.permissions.get(RESOURCE.USERS)
  const loadActiveUsers = useSetAtom(loadActiveUsersAtom)
  const verifyUser = useSetAtom(verifyUserAtom)
  const standbyUser = useSetAtom(standbyUserAtom)
  const showMessage = useMessage()
  useEffect(() => {
    const timer = setInterval(() => { 
      verifyUser()
      standbyUser()
     }, 60000)
    return () => { clearInterval(timer) }
  }, [user])
  useEffect(() => {
    if (user.role.name !== UserRoles.ANONYM) waitForMessageFromServer(user.token, (message, data) => {
      switch (message) {
        case SERVER_EVENTS.LOGOUT:
          if (user.role.name === "") return true
          if (data === user.token) {
            setUserDirectly({ name: "", role: { name: "" }, token: "", permissions: getInitialPermissions() })
            showMessage("Сеанс завершен администратором")
            return true
          } else if (perm?.read) loadActiveUsers()
          break;
        case SERVER_EVENTS.UPDATE_ACTIVE_USERS:
          if (perm?.read) loadActiveUsers()
          break;
      }
      return false
    })
  }, [user.name])
    return <></>
}