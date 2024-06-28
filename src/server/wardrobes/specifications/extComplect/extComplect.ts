import { CORPUS_SPECS } from "../../../../types/specification"
import { SpecificationMultiResult } from "../../../../types/wardrobe"
import { Profile } from "../../../../types/materials"
import { WardrobeData } from "../../../../types/wardrobe"
import { getDrawerSpecification } from "./drawer"
import { getConsoleSpecification } from "./console"

export async function getExtComplectSpecification(data: WardrobeData, profile: Profile): Promise<SpecificationMultiResult> {
    const result: SpecificationMultiResult = []
    if (data.extComplect.telescope > 0) result.push({ type: CORPUS_SPECS.EXT_TEL, spec: await getDrawerSpecification(data) })
    if (data.extComplect.console.count > 0) result.push({ type: CORPUS_SPECS.EXT_CONSOLE, spec: await getConsoleSpecification(data) })
    return result
}


