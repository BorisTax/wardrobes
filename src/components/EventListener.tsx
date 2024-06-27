import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { userAtom, verifyUserAtom } from "../atoms/users";

export default function EventListener() {
  const user = useAtomValue(userAtom)
  const verifyUser = useSetAtom(verifyUserAtom)
  useEffect(() => {
    //verifyUser()
    const timer = setInterval(() => { 
      verifyUser()
     }, 60000)
    return () => { clearInterval(timer) }
  }, [user.name])

    return <div></div>
}