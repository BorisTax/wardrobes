import { useState } from "react"
import { DefaultMap } from "../../atoms/storage"
import { loadModuleIdNameData } from "../../atoms/modules/idNameData"
import { IdNameRoutes } from "../../components/Modules/EditModuleIdName"

export default function useModuleIdNameData(route: IdNameRoutes): [DefaultMap, () => Promise<void>] {
    const [data, setData] = useState<DefaultMap>(new Map())
    const loadData = async () => {
        const data = await loadModuleIdNameData(route)
        setData(data)
    }
    return [data, loadData]
}
