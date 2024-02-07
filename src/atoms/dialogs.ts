import { atom } from "jotai";
import React from "react";

export const loginDialogAtom = atom<React.RefObject<HTMLDialogElement> | null>(null)

