import { useEffect, useState } from "react";
import { ExtMap } from "../atoms/storage";
import { ModuleColorsTableSchema, ModuleMatBaseTableSchema, ModuleMaterialsTableSchema } from "../types/schemas/moduleSchemas";
import { loadModuleMatBases, loadModuleMatColors } from "../atoms/modules/materials";
export type ModuleMaterial = {
    name: string
    texture: boolean

}
export function useModuleMaterials(materials: ExtMap<ModuleMaterialsTableSchema>) {
    const [matBases, setMatBases] = useState<ExtMap<ModuleMatBaseTableSchema>>(new Map())
    const [matColors, setMatColors] = useState<ExtMap<ModuleColorsTableSchema>>(new Map())
    useEffect(() => {
        loadModuleMatBases().then(data => setMatBases(data))
        loadModuleMatColors().then(data => setMatColors(data))
    }, [])
    const getFullMaterialName = (id: number) => {
        const base=`${matBases.get(materials.get(id)?.baseId || 0)?.name}`
        const color = `${matColors.get(materials.get(id)?.colorId || 0)?.name}`
        return `${base}${color ? " " + color : ""}`
    }
    return { getFullMaterialName }
}