import { useAtomValue, useSetAtom } from "jotai"
import { calculateCombiSpecificationsAtom, specificationInProgress, totalPriceAtom } from "../../atoms/specification"
import { activeFasadAtom, activeRootFasadIndexAtom } from "../../atoms/fasades"
import ImageButton from "../inputs/ImageButton"

export default function FasadTotalPrice(){
    const fasad = useAtomValue(activeFasadAtom)
    const calculate = useSetAtom(calculateCombiSpecificationsAtom)
    const rootFasadIndex = useAtomValue(activeRootFasadIndexAtom)
    const loading = useAtomValue(specificationInProgress)
    const totalPrice = useAtomValue(totalPriceAtom)
    const fasadValue = fasad && (totalPrice && totalPrice[rootFasadIndex] || 0).toFixed(2)
    return <div className="d-flex justify-content-end text-primary gap-1"
        style={{ visibility: fasad ? "visible" : "hidden" }}>
        Стоимость фасада:{` ${loading ? "" : fasadValue}`}
        <ImageButton icon="update" disabled={loading} classes={(loading && "animate") || ""} onClick={() => calculate()} />
    </div>
}