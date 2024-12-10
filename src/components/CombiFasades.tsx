import WardrobePropertiesBar from "./WardrobePropertiesBar";
import PropertiesBar from "./PropertiesBar";
import RootFasadesContainer from "./fasad/RootFasadesContainer";
import CombiSpecification from "./CombiSpecification";

export default function CombiFasades() {
    return <>
        <div className="main-container">
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