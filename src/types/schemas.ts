import { SpecificationItem } from "./specification"
export type WardrobeTableSchema = {
    name: string,
    caption: string
}
export type WardrobeDetailSchema = {
    name: string,
    caption: string
}

export type DVPTableSchema = {
    width: number,
    length: number
}
export type WardrobeDetailTableSchema = {
    wardrobe: string,
    name: string,
    minwidth: number,
    maxwidth: number,
    minheight: number,
    maxheight: number,
    count: number,
    size: string,
    enable: number
}

export type WardrobeFurnitureTableSchema = {
    wardrobe: string,
    name: SpecificationItem,
    minwidth: number,
    maxwidth: number,
    minheight: number,
    maxheight: number,
    mindepth: number,
    maxdepth: number,
    count: number,
    size: string,
    enable: number
}