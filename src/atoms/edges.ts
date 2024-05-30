import { atom } from "jotai";
import { Edge } from "../server/types/materials";
import { FetchResult, fetchData, fetchGetData } from "../functions/fetch";
import { userAtom } from "./users";
import { TableFields } from "../server/types/server";
import { AtomCallbackResult } from "../types/atoms";

export const edgeListAtom = atom<Edge[]>([])

export const loadEdgeListAtom = atom(null, async (_, set) => {
    try {
        const { success, data }: FetchResult = await fetchGetData('api/materials/edge')
        if(success) set(edgeListAtom, data as Edge[]);
    } catch (e) { console.error(e) }
})

export const deleteEdgeAtom = atom(null, async (get, set, edge: Edge, callback: AtomCallbackResult) => {
    const user = get(userAtom)
    const result = await fetchData("api/materials/edge", "DELETE", JSON.stringify({ name: edge.name, token: user.token }))
    await set(loadEdgeListAtom)
    callback({ success: result.success as boolean, message: result.message as string })
})

export const addEdgeAtom = atom(null, async (get, set, {name, dsp, code}: Edge, callback: AtomCallbackResult) => {
    const user = get(userAtom)
    const data = {
        [TableFields.NAME]: name,
        [TableFields.DSP]: dsp,
        [TableFields.CODE]: code,
        [TableFields.TOKEN]: user.token
    }
    try {
        const result = await fetchData("api/materials/edge", "POST", JSON.stringify(data))
        await set(loadEdgeListAtom)
        callback({ success: result.success as boolean, message: result.message as string })
    } catch (e) { console.error(e) }
})

export const updateEdgeAtom = atom(null, async (get, set, { name, dsp, newName, code }, callback: AtomCallbackResult) => {
    const user = get(userAtom)
    const data = {
        [TableFields.NAME]: name,
        [TableFields.NEWNAME]: newName,
        [TableFields.DSP]: dsp,
        [TableFields.CODE]: code,
        [TableFields.TOKEN]: user.token
    }
    try {
        const result = await fetchData("api/materials/edge", "PUT", JSON.stringify(data))
        await set(loadEdgeListAtom)
        callback({ success: result.success as boolean, message: result.message as string })
    } catch (e) { console.error(e) }
})