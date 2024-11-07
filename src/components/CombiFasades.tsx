import WardrobePropertiesBar from "./WardrobePropertiesBar";
import PropertiesBar from "./PropertiesBar";
import RootFasadesContainer from "./fasad/RootFasadesContainer";
import StatusBar from "./StatusBar";
import { isMobile } from "../functions/functions";
import CombiSpecification from "./CombiSpecification";

export default function CombiFasades() {
    return <>
        <div className="main-container">
        {!isMobile() ? <StatusBar /> : <></>}
            <div className="combifasades-container">
                <div className='properties-container'>
                    <WardrobePropertiesBar />
                    <PropertiesBar />
                </div>
                <RootFasadesContainer />
                <CombiSpecification />
            </div>
        </div>
    </>
}