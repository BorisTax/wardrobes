import { atom } from "jotai";
import { userAtom } from "./users";

export const downloadDatabaseAtom = atom(null, async (get) => {
    const { token } = get(userAtom)
    window.open(`${API_ROUTE}/database/download?token=${token}`);
})