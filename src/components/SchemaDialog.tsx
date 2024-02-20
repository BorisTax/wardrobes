import '../styles/schema.scss'
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { rerenderDialogAtom, schemaDialogAtom } from "../atoms/dialogs"
import { appDataAtom } from "../atoms/app"
import { combineColors } from "../functions/schema"
import { FasadMaterial } from "../types/enums"
import Fasad from '../classes/Fasad'
import FasadSchemaSection from './FasadSchemaSection'

export default function SchemaDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const rerender = useAtomValue(rerenderDialogAtom)
    const tableRef = useRef<HTMLDivElement>(null)
    const viewRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const orderRef = useRef<HTMLDivElement>(null)
    const { rootFasades, fasadCount, order, profile, type, wardHeight, wardWidth } = useAtomValue(appDataAtom)
    const totalWidth = rootFasades.reduce((prev, r: Fasad) => r.Width + prev, 0) + 5
    const ratio = totalWidth / rootFasades[0].Height
    const closeDialog = () => { dialogRef.current?.close() }
    const setSchemaDialogRef = useSetAtom(schemaDialogAtom)
    const DSPColors = [...combineColors(rootFasades, FasadMaterial.DSP)].join(", ")
    const mirrorColors = [...combineColors(rootFasades, FasadMaterial.MIRROR)].join(", ")
    const lacobelColors = [...combineColors(rootFasades, FasadMaterial.LACOBEL), ...combineColors(rootFasades, FasadMaterial.LACOBELGLASS)].join(", ")
    const sandColors = [...combineColors(rootFasades, FasadMaterial.SAND)].join(", ")
    const sandBases = [...combineColors(rootFasades, FasadMaterial.SAND, true)].join(", ")
    const FMPColors = [...combineColors(rootFasades, FasadMaterial.FMP)].join(", ")
    const viewStyle = { display: "grid", gridTemplateColumns: new Array(fasadCount).fill("1fr").join(' '), gap: "10px" }
    const fasades = rootFasades.map(r => <FasadSchemaSection fasad={r} />)
    useLayoutEffect(() => {
        if (tableRef.current && orderRef.current && containerRef.current) {
            const height = tableRef.current.offsetHeight - orderRef.current.offsetHeight
            const width = height * ratio
            const padding = parseFloat(getComputedStyle(containerRef.current).padding)
            if (viewRef.current) viewRef.current.style.width = width + "px"
            if (viewRef.current) viewRef.current.style.height = height - padding * 2+ "px"
        }
    }, [rerender])
    useEffect(() => {
        setSchemaDialogRef(dialogRef)
    }, [dialogRef])
    return <dialog ref={dialogRef}>
        <div className="schema-container">
            <div className='schema-left'>
                <div ref={orderRef} className='schema-order'>
                    {order}
                </div>
                <div ref={containerRef} className={`schema-view-container`}>
                    <div ref={viewRef} className='schema-view' style={viewStyle}>
                        {fasades}
                    </div>
                </div>
            </div>
            <div ref={tableRef} className="schema-table">
                <div>{`Заказ принят:`}</div>
                <div>{`1. Габариты изделия (общий)`}</div>
                <div className='ps-3'>{`1. Ширина: ${wardWidth}`}</div>
                <div>{`1.1 Цельный или из двух шкафов:`}</div>
                <div className='ps-3'>{`2. Глубина:`}</div>
                <div className='ps-3'>{`3. Высота: ${wardHeight}`}</div>
                <div>{`2. Цвет ДСП`}</div>
                <div className='ps-3'>{`1. ДСП корпус:`}</div>
                <div className='ps-3'>{`2. ДСП дополн:`}</div>
                <div>{`3. Кромка ПВХ(стандарт):`}</div>
                <div>{`4. Дополнительно`}</div>
                <div className='ps-3'>{`1. Консоль:`}</div>
                <div className='ps-3'>{`2. Козырек:`}</div>
                <div className='ps-3'>{`3. Освещение:`}</div>
                <div className='ps-3'>{`4. Ящичный блок:`}</div>
                <div className='ps-3'>{`5. Полки (плательный отдел):`}</div>
                <div className='ps-3'>{`6. Полки (полочный отдел):`}</div>
                <div className='ps-3'>{`7. Пантограф:`}</div>
                <div className='ps-3'>{`8. Труба:`}</div>
                <div className='ps-3'>{`9. Тремпеледержатель:`}</div>
                <div className='ps-3'>{`10. Стойка:`}</div>
                <div>{`5. Фасад (кол-во): ${fasadCount}`}</div>
                <div className='ps-3'>{`1. Цвет профиля: ${profile.name}`}</div>
                <div className='ps-3'>{`2. Цвет зеркала: ${mirrorColors}`}</div>
                <div className='ps-3'>{`3. Основа: ${sandBases}`}</div>
                <div className='ps-3'>{`4. Рисунок: ${sandColors}`}</div>
                <div className='ps-3'>{`5. ДСП: ${DSPColors}`}</div>
                <div className='ps-3'>{`6. Лакобель: ${lacobelColors}`}</div>
                <div className='ps-3'>{`7. ФМП: ${FMPColors}`}</div>
            </div>
        </div>
        <div className="d-flex flex-column gap-1 align-items-start">
            <input type="button" value="Сохранить" onClick={() => { }} />
            <input type="button" value="Закрыть" onClick={() => closeDialog()} />
        </div>
    </dialog>
}
