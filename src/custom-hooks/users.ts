import { useEffect, useState } from "react";
import { ExtMap } from "../atoms/storage";
import { UserSchema } from "../types/schemas/userSchemas";
import { loadUsers } from "../atoms/users/users";

export function useUsers(){
    const [users, setUsers] = useState<ExtMap<UserSchema>>(new Map())
    useEffect(()=>{
        loadUsers().then(data => setUsers(data))
    })
    return users
}