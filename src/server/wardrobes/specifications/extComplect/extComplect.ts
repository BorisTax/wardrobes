import { CORPUS_SPECS } from "../../../../types/specification"
import { SpecificationMultiResult } from "../../../../types/wardrobe"
import { Profile } from "../../../../types/materials"
import { WardrobeData } from "../../../../types/wardrobe"
import { getDrawerSpecification } from "./drawer"
import { getConsoleSpecification } from "./console"
import { getStandSpecification } from "./stand"
import { getBlinderSpecification } from "./blinder"
import { getShelfSpecification } from "./shelf"
import { getShelfPlatSpecification } from "./shelfPlat"
import { getPillarSpecification } from "./pillar"
import { getTrubaSpecification } from "./truba"
import { getTrempelSpecification } from "./trempel"
import { getLightSpecification } from "./light"

export async function getExtComplectSpecification(data: WardrobeData): Promise<SpecificationMultiResult> {
    const result: SpecificationMultiResult = []
    if (data.extComplect.telescope > 0) result.push({ type: CORPUS_SPECS.EXT_TEL, spec: await getDrawerSpecification(data) })
    if (data.extComplect.console.count > 0) result.push({ type: CORPUS_SPECS.EXT_CONSOLE, spec: await getConsoleSpecification(data) })
    if (data.extComplect.stand.count > 0) result.push({ type: CORPUS_SPECS.EXT_STAND, spec: await getStandSpecification(data) })
    if (data.extComplect.blinder > 0) result.push({ type: CORPUS_SPECS.EXT_BLINDER, spec: await getBlinderSpecification(data) })
    if (data.extComplect.shelf > 0) result.push({ type: CORPUS_SPECS.EXT_SHELF, spec: await getShelfSpecification(data) })
    if (data.extComplect.shelfPlat > 0) result.push({ type: CORPUS_SPECS.EXT_SHELFPLAT, spec: await getShelfPlatSpecification(data) })
    if (data.extComplect.pillar > 0) result.push({ type: CORPUS_SPECS.EXT_PILLAR, spec: await getPillarSpecification(data) })
    if (data.extComplect.truba > 0) result.push({ type: CORPUS_SPECS.EXT_TUBE, spec: await getTrubaSpecification(data) })
    if (data.extComplect.trempel > 0) result.push({ type: CORPUS_SPECS.EXT_TREMPEL, spec: await getTrempelSpecification(data) })
    if (data.extComplect.light > 0) result.push({ type: CORPUS_SPECS.EXT_LIGHT, spec: await getLightSpecification(data) })
    return result
}


