import '../../styles/schema.scss'
import { useLayoutEffect, useRef } from "react"
import { useAtomValue } from "jotai"
// @ts-ignore
import * as  html2image from 'html-to-image'
import download from 'downloadjs'
import jsPDF from 'jspdf'
import { rerenderDialogAtom } from "../../atoms/dialogs"
import { combiStateAtom } from "../../atoms/app"
import { combineColors } from "../../functions/schema"
import { FASAD_TYPE } from "../../types/enums"
import FasadState from '../../classes/FasadState'
import FasadSchemaSection from '../fasad/FasadSchemaSection'
import ImageButton from '../inputs/ImageButton'
import { profileAtom } from '../../atoms/materials/profiles'
import { charAtom } from '../../atoms/materials/chars'

export default function SchemaDialog() {
    const rerender = useAtomValue(rerenderDialogAtom)
    const tableRef = useRef<HTMLDivElement>(null)
    const viewRef = useRef<HTMLDivElement>(null)
    const sheetRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const orderRef = useRef<HTMLDivElement>(null)
    const { rootFasades, fasadCount, profile, wardHeight, wardWidth } = useAtomValue(combiStateAtom)
    const profiles = useAtomValue(profileAtom)
    const chars = useAtomValue(charAtom)
    const totalWidth = rootFasades.reduce((prev, r: FasadState) => r.width + prev, 0) + 5
    const ratio = totalWidth / rootFasades[0].height
    const DSPColors = [...combineColors(rootFasades, FASAD_TYPE.DSP)].join(", ")
    const mirrorColors = [...combineColors(rootFasades, FASAD_TYPE.MIRROR)].join(", ")
    const lacobelColors = [...combineColors(rootFasades, FASAD_TYPE.LACOBEL)].join(", ")
    const sandColors = [...combineColors(rootFasades, FASAD_TYPE.SAND)].join(", ")
    const FMPColors = [...combineColors(rootFasades, FASAD_TYPE.FMP)].join(", ")
    const viewStyle = { display: "grid", gridTemplateColumns: new Array(fasadCount).fill("1fr").join(' '), gap: "10px" }
    const fasades = rootFasades.map((r, index) => <FasadSchemaSection key={index} fasad={r} />)
    const profileName = chars.get(profiles.get(profile.id)?.charId || 0)?.name
    useLayoutEffect(() => {
        if (tableRef.current && orderRef.current && containerRef.current) {
            const height = tableRef.current.offsetHeight - orderRef.current.offsetHeight
            const width = height * ratio
            const padding = parseFloat(getComputedStyle(containerRef.current).padding)
            if (viewRef.current) viewRef.current.style.width = width + "px"
            if (viewRef.current) viewRef.current.style.height = height - padding * 2 + "px"
        }
    }, [rerender, ratio])
    return <div className='p-2'>
            <div>
                <ImageButton icon="pdf" title="Сохранить в PDF" caption="Сохранить в PDF" onClick={() => {
                    html2image.toPng(sheetRef.current as HTMLDivElement)
                        .then(function (dataUrl) {
                            const doc = new jsPDF({ orientation: "landscape" });
                            doc.addImage(dataUrl, 'PNG', 0, 0, 297, 210);
                            doc.save('Схема.pdf');
                        });
                }} />
            <ImageButton icon="png" title="Сохранить как изображение" caption="Сохранить как изображение" onClick={() => {
                    html2image.toPng(sheetRef.current as HTMLDivElement)
                        .then(function (dataUrl) {
                            download(dataUrl, 'Схема.png');
                        });
                }} />
            </div>
            <div className='schema-background'>
                <div ref={sheetRef} className='schema-sheet'>
                    <div className="schema-container">
                        <div className='schema-left'>
                            <div ref={orderRef} className='schema-order'>
                                {" "}
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
                            <div className='schema-table-row'>{`1. Ширина:`}<span className='schema-table-data'>{wardWidth}</span></div>
                            <div>{`1.1 Цельный или из двух шкафов:`}</div>
                            <div className='schema-table-row'>{`2. Глубина:`}</div>
                            <div className='schema-table-row'>{`3. Высота:`}<span className='schema-table-data'>{wardHeight}</span></div>
                            <div>{`2. Цвет ДСП`}</div>
                            <div className='schema-table-row'>{`1. ДСП корпус:`}</div>
                            <div className='schema-table-row'>{`2. ДСП дополн:`}</div>
                            <div>{`3. Кромка ПВХ(стандарт):`}</div>
                            <div>{`4. Дополнительно`}</div>
                            <div className='schema-table-row'>{`1. Консоль:`}</div>
                            <div className='schema-table-row'>{`2. Козырек:`}</div>
                            <div className='schema-table-row'>{`3. Освещение:`}</div>
                            <div className='schema-table-row'>{`4. Ящичный блок:`}</div>
                            <div className='schema-table-row'>{`5. Полки (плательный отдел):`}</div>
                            <div className='schema-table-row'>{`6. Полки (полочный отдел):`}</div>
                            <div className='schema-table-row'>{`7. Пантограф:`}</div>
                            <div className='schema-table-row'>{`8. Труба:`}</div>
                            <div className='schema-table-row'>{`9. Тремпеледержатель:`}</div>
                            <div className='schema-table-row'>{`10. Стойка:`}</div>
                            <div>{`5. Фасад (кол-во):`}<span className='schema-table-data'>{fasadCount}</span></div>
                            <div className='schema-table-row'>{`1. Цвет профиля:`}<span className='schema-table-data'>{profileName}</span></div>
                            <div className='schema-table-row'>{`2. Цвет зеркала:`}<span className='schema-table-data'>{mirrorColors}</span></div>
                            <div className='schema-table-row'>{`3. Основа:`}<span className='schema-table-data'>{""}</span></div>
                            <div className='schema-table-row'>{`4. Рисунок:`}<span className='schema-table-data'>{sandColors}</span></div>
                            <div className='schema-table-row'>{`5. ДСП:`}<span className='schema-table-data'>{DSPColors}</span></div>
                            <div className='schema-table-row'>{`6. Лакобель:`}<span className='schema-table-data'>{lacobelColors}</span></div>
                            <div className='schema-table-row'>{`7. ФМП:`}<span className='schema-table-data'>{FMPColors}</span></div>
                        </div>
                    </div>
                </div>
            </div>
    </div>
}
