import { useSetAtom } from "jotai";
import WardrobePropertiesBar from "./WardrobePropertiesBar";
import PropertiesBar from "./PropertiesBar";
import RootFasadesContainer from "./fasad/RootFasadesContainer";
import { setActiveFasadAtom } from "../atoms/fasades";
import StatusBar from "./StatusBar";
import { isMobile } from "../functions/functions";

export default function CombiFasades() {
    const setActiveFasad = useSetAtom(setActiveFasadAtom)
    return <>
        <div className="main-container">
        {!isMobile() ? <StatusBar /> : <></>}
            <div className="combifasades-container" onClick={() => {
                setActiveFasad(null);
                }}>
                <div className='properties-container'>
                    <WardrobePropertiesBar />
                    <PropertiesBar />
                </div>
                <RootFasadesContainer />
            </div>
        </div>
    </>
}