import { DetailNames } from "../types/enums";
import { WARDROBE_TYPE } from "../types/wardrobe";

export const DetailNamesCaptions = {
    [DetailNames.WARDROBE_ROOF]: "Крыша-дно",
    [DetailNames.WARDROBE_STAND]: "Стойка",
    [DetailNames.WARDROBE_INNER_STAND]: "Стойка внутр",
    [DetailNames.WARDROBE_SHELF]: "Полка",
    [DetailNames.WARDROBE_SHELFPLAT]: "Полка плат",
    [DetailNames.WARDROBE_PILLAR]: "Перемычка",
}

export const WardrobeTypes: Map<string, string> = new Map()
WardrobeTypes.set("ШКАФ", WARDROBE_TYPE.WARDROBE)
WardrobeTypes.set("КОРПУС", WARDROBE_TYPE.CORPUS)
WardrobeTypes.set("СИСТЕМА", WARDROBE_TYPE.SYSTEM)

export const WardrobeTypesCaptions: Map<string, string> = new Map()
WardrobeTypesCaptions.set(WARDROBE_TYPE.WARDROBE, "ШКАФ")
WardrobeTypesCaptions.set(WARDROBE_TYPE.CORPUS, "КОРПУС")
WardrobeTypesCaptions.set(WARDROBE_TYPE.SYSTEM, "СИСТЕМА")