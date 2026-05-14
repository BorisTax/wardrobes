import { useState } from "react"
import { loadModuleDetails } from "../../atoms/modules/details"
import { ModuleDetailsTableSchema } from "../../types/schemas/moduleSchemas"

export default function useModuleDetails(){
    const [details, setDetails] = useState<ModuleDetailsTableSchema[]>([])
    const loadDetails = async (moduleId: number)=>{
        loadModuleDetails(moduleId).then(details => setDetails(details))
    }
    return [details, loadDetails]
}
