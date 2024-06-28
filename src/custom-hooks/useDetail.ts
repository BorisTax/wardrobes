import { useAtomValue, useSetAtom } from "jotai";
import { DETAIL_NAME, WARDROBE_KIND } from "../types/wardrobe";
import { detailAtom, loadDetailAtom } from "../atoms/wardrobe";
import { useEffect } from "react";

export const useDetail = (detailName: DETAIL_NAME, kind: WARDROBE_KIND, width: number, height: number) => {
    const loadDetail = useSetAtom(loadDetailAtom)
    const detail = useAtomValue(detailAtom)
    useEffect(() => {
        loadDetail(detailName, kind, width, height)
    }, [detailName, kind, width, height])
    return detail
}