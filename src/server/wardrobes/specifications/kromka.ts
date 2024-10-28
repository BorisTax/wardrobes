import { KROMKA_SIDE, KROMKA_TYPE } from "../../../types/wardrobe";


export function singleLengthThickKromka(): KROMKA_SIDE {
    return { L1: KROMKA_TYPE.THICK, L2: KROMKA_TYPE.NONE, W1: KROMKA_TYPE.NONE, W2: KROMKA_TYPE.NONE };
}
export function singleLengthThinKromka(): KROMKA_SIDE {
    return { L1: KROMKA_TYPE.THIN, L2: KROMKA_TYPE.NONE, W1: KROMKA_TYPE.NONE, W2: KROMKA_TYPE.NONE };
}
export function singleLengthThickDoubleWidthThinKromka(): KROMKA_SIDE {
    return { L1: KROMKA_TYPE.THICK, L2: KROMKA_TYPE.NONE, W1: KROMKA_TYPE.THIN, W2: KROMKA_TYPE.THIN };
}
export function allThinKromka(): KROMKA_SIDE {
    return { L1: KROMKA_TYPE.THIN, L2: KROMKA_TYPE.THIN, W1: KROMKA_TYPE.THIN, W2: KROMKA_TYPE.THIN };
}
export function allNoneKromka(): KROMKA_SIDE {
    return { L1: KROMKA_TYPE.NONE, L2: KROMKA_TYPE.NONE, W1: KROMKA_TYPE.NONE, W2: KROMKA_TYPE.NONE };
}
export function consoleRoofKromka(): KROMKA_SIDE {
    return { L1: KROMKA_TYPE.THICK, L2: KROMKA_TYPE.THICK, W1: KROMKA_TYPE.THICK, W2: KROMKA_TYPE.THICK };
}
export function consoleShelfKromka(): KROMKA_SIDE {
    return { L1: KROMKA_TYPE.THICK, L2: KROMKA_TYPE.NONE, W1: KROMKA_TYPE.THICK, W2: KROMKA_TYPE.NONE };
}
export function consoleStandKromka(): KROMKA_SIDE {
    return { L1: KROMKA_TYPE.THICK, L2: KROMKA_TYPE.NONE, W1: KROMKA_TYPE.NONE, W2: KROMKA_TYPE.NONE };
}
export function consoleStandSideKromka(): KROMKA_SIDE {
    return { L1: KROMKA_TYPE.THICK, L2: KROMKA_TYPE.NONE, W1: KROMKA_TYPE.NONE, W2: KROMKA_TYPE.NONE };
}
export function pillarKromka(): KROMKA_SIDE {
    return { L1: KROMKA_TYPE.THIN, L2: KROMKA_TYPE.NONE, W1: KROMKA_TYPE.THIN, W2: KROMKA_TYPE.THIN };
}