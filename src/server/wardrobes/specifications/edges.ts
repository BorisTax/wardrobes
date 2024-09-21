import { EDGE_SIDE, EDGE_TYPE } from "../../../types/wardrobe";


export function singleLengthThickEdge(): EDGE_SIDE {
    return { L1: EDGE_TYPE.THICK, L2: EDGE_TYPE.NONE, W1: EDGE_TYPE.NONE, W2: EDGE_TYPE.NONE };
}
export function singleLengthThinEdge(): EDGE_SIDE {
    return { L1: EDGE_TYPE.THIN, L2: EDGE_TYPE.NONE, W1: EDGE_TYPE.NONE, W2: EDGE_TYPE.NONE };
}
export function singleLengthThickDoubleWidthThinEdge(): EDGE_SIDE {
    return { L1: EDGE_TYPE.THICK, L2: EDGE_TYPE.NONE, W1: EDGE_TYPE.THIN, W2: EDGE_TYPE.THIN };
}
export function allThinEdge(): EDGE_SIDE {
    return { L1: EDGE_TYPE.THIN, L2: EDGE_TYPE.THIN, W1: EDGE_TYPE.THIN, W2: EDGE_TYPE.THIN };
}

export function consoleRoofEdge(): EDGE_SIDE {
    return { L1: EDGE_TYPE.THICK, L2: EDGE_TYPE.THIN, W1: EDGE_TYPE.THICK, W2: EDGE_TYPE.THIN };
}
export function consoleShelfEdge(): EDGE_SIDE {
    return { L1: EDGE_TYPE.THICK, L2: EDGE_TYPE.NONE, W1: EDGE_TYPE.THICK, W2: EDGE_TYPE.NONE };
}
export function consoleStandEdge(): EDGE_SIDE {
    return { L1: EDGE_TYPE.THICK, L2: EDGE_TYPE.NONE, W1: EDGE_TYPE.NONE, W2: EDGE_TYPE.NONE };
}
export function consoleStandSideEdge(): EDGE_SIDE {
    return { L1: EDGE_TYPE.THICK, L2: EDGE_TYPE.NONE, W1: EDGE_TYPE.NONE, W2: EDGE_TYPE.NONE };
}