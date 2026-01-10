import { atom } from "jotai";
import { API_ROUTE } from "../types/routes";

export const downloadDatabaseAtom = atom(null, async (get) => {
    window.open(`${API_ROUTE}/database/download`);
})