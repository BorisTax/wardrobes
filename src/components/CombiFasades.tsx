import WardrobePropertiesBar from "./WardrobePropertiesBar";
import PropertiesBar from "./PropertiesBar";
import RootFasadesContainer from "./fasad/RootFasadesContainer";
import CombiSpecification from "./CombiSpecification";
import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { loadInitialCombiStateAtom } from "../atoms/app";
import { userAtom } from "../atoms/users";
import { loadAllDataAtom } from "../atoms/storage";

export default function CombiFasades() {
    const user = useAtomValue(userAtom)
    const loadInitialAppState = useSetAtom(loadInitialCombiStateAtom)
    const loadAllData = useSetAtom(loadAllDataAtom)
    useEffect(() => {
        loadAllData()
        loadInitialAppState()
    }, [user.name])
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