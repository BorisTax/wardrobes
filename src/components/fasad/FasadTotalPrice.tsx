import { useAtomValue, useSetAtom } from "jotai"
import { calculateCombiSpecificationsAtom, specificationInProgress, totalPriceAtom } from "../../atoms/specification"
import { activeRootFasadIndexAtom } from "../../atoms/fasades"
import ImageButton from "../inputs/ImageButton"

export default function FasadTotalPrice() {
    const calculate = useSetAtom(calculateCombiSpecificationsAtom)
    const rootFasadIndex = useAtomValue(activeRootFasadIndexAtom)
    const loading = useAtomValue(specificationInProgress)
    const totalPrice = useAtomValue(totalPriceAtom)
    const fasadValue = (totalPrice && totalPrice[rootFasadIndex] || 0).toFixed(2)
    return <div className="d-flex justify-content-end align-items-center text-primary gap-1">
        Стоимость фасада:{` ${loading ? "" : fasadValue}`}
        <ImageButton title="Обновить" icon="update" disabled={loading} classes={(loading && "animate") || ""} onClick={() => calculate()} />
    </div>
}