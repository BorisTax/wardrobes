import { atom } from "jotai";
import Shape from "../classes/corpus/shape";
import { appDataAtom } from "./app";

export const shapesAtom = atom((get) => {
    return get(appDataAtom).corpus.shapes
})

export const selectedShapesAtom = atom<Set<Shape>>(new Set<Shape>())

