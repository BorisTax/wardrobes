import { atom } from "jotai";
import { fetchGetData } from "../functions/fetch";
import { userAtom } from "./users";

export const downloadDatabaseAtom = atom(null, async (get, set) => {
    const { token } = get(userAtom)
    window.open(`api/database/download?token=${token}`);
})