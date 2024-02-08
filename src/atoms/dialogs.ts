import { atom } from "jotai";
import React from "react";

export const loginDialogAtom = atom<React.RefObject<HTMLDialogElement> | null>(null)
export const editMaterialDialogAtom = atom<React.RefObject<HTMLDialogElement> | null>(null)
