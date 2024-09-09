import { useAtomValue, useSetAtom } from "jotai";
import { DETAIL_NAME, WARDROBE_KIND, WARDROBE_TYPE } from "../types/wardrobe";
import { detailAtom, loadDetailAtom } from "../atoms/wardrobe";
import { useEffect } from "react";

export const useDetail = (detailName: DETAIL_NAME, wardType: WARDROBE_TYPE, kind: WARDROBE_KIND, width: number, height: number) => {
    const loadDetail = useSetAtom(loadDetailAtom)
    const detail = useAtomValue(detailAtom)
    useEffect(() => {
        loadDetail(detailName, wardType, kind, width, height)
    }, [detailName, kind, width, height, loadDetail])
    return detail
}