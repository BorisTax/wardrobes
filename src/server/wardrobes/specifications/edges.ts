import { KROMKA_SIDE, KROMKA_TYPE } from "../../../types/wardrobe";


export function singleLengthThickEdge(): KROMKA_SIDE {
    return { L1: KROMKA_TYPE.THICK, L2: KROMKA_TYPE.NONE, W1: KROMKA_TYPE.NONE, W2: KROMKA_TYPE.NONE };
}
export function singleLengthThinEdge(): KROMKA_SIDE {
    return { L1: KROMKA_TYPE.THIN, L2: KROMKA_TYPE.NONE, W1: KROMKA_TYPE.NONE, W2: KROMKA_TYPE.NONE };
}
export function singleLengthThickDoubleWidthThinEdge(): KROMKA_SIDE {
    return { L1: KROMKA_TYPE.THICK, L2: KROMKA_TYPE.NONE, W1: KROMKA_TYPE.THIN, W2: KROMKA_TYPE.THIN };
}
export function allThinEdge(): KROMKA_SIDE {
    return { L1: KROMKA_TYPE.THIN, L2: KROMKA_TYPE.THIN, W1: KROMKA_TYPE.THIN, W2: KROMKA_TYPE.THIN };
}

export function consoleRoofEdge(): KROMKA_SIDE {
    return { L1: KROMKA_TYPE.THICK, L2: KROMKA_TYPE.THIN, W1: KROMKA_TYPE.THICK, W2: KROMKA_TYPE.THIN };
}
export function consoleShelfEdge(): KROMKA_SIDE {
    return { L1: KROMKA_TYPE.THICK, L2: KROMKA_TYPE.NONE, W1: KROMKA_TYPE.THICK, W2: KROMKA_TYPE.NONE };
}
export function consoleStandEdge(): KROMKA_SIDE {
    return { L1: KROMKA_TYPE.THICK, L2: KROMKA_TYPE.NONE, W1: KROMKA_TYPE.NONE, W2: KROMKA_TYPE.NONE };
}
export function consoleStandSideEdge(): KROMKA_SIDE {
    return { L1: KROMKA_TYPE.THICK, L2: KROMKA_TYPE.NONE, W1: KROMKA_TYPE.NONE, W2: KROMKA_TYPE.NONE };
}