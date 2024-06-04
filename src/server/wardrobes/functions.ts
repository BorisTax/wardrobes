export function getKarton(width: number, height: number){
    const wLess500_hLess2150 = [
        { width: 3001, value: 3.5 },
        { width: 2500, value: 3 },
        { width: 2100, value: 2.6 },
        { width: 1600, value: 2.5 },
    ]
    const wGreater500_hLess2150 = [
        { width: 3001, value: 4.5 },
        { width: 2800, value: 4 },
        { width: 2500, value: 3.5 },
        { width: 1600, value: 3 },
    ]
    const wLess500_hGreater2150 = [
        { width: 3001, value: 4.5 },
        { width: 2800, value: 4 },
        { width: 2500, value: 3.5 },
        { width: 1900, value: 3 },
    ]
    const wGreater500_hGreater2150 = [
        { width: 3001, value: 5 },
        { width: 2800, value: 4.5 },
        { width: 2500, value: 4 },
        { width: 2100, value: 3.5 },
        { width: 1600, value: 3 },
    ]
    if (width < 500 && height < 2150) return wLess500_hLess2150.findLast(i => i.width > width)?.value || 0;
    if (width >= 500 && height < 2150) return wGreater500_hLess2150.findLast(i => i.width > width)?.value || 0;
    if (width < 500 && height >= 2150) return wLess500_hGreater2150.findLast(i => i.width > width)?.value || 0;
    if (width >= 500 && height >= 2150) return wGreater500_hGreater2150.findLast(i => i.width > width)?.value || 0;
    return 0
}

export function getLegs(width: number) {
    const sizes = [
        { width: 3001, value: 16 },
        { width: 2800, value: 10 },
        { width: 2200, value: 8 },
        { width: 1400, value: 6 },
    ]
    return sizes.findLast((s => s.width > width))?.value || 0
};

export function getNails(width: number) {
    const sizes = [
        { width: 3001, value: 0.2 },
        { width: 2500, value: 0.15 },
        { width: 2100, value: 0.14 },
        { width: 1900, value: 0.11 },
        { width: 1600, value: 0.1 },
        { width: 1400, value: 0.095 },
    ]
    return sizes.findLast((s => s.width > width))?.value || 0
};

export function getSamorez16(width: number) {
    const sizes = [
        { width: 3001, value: 36 },
        { width: 2600, value: 28 },
        { width: 2200, value: 18 },
    ]
    return sizes.findLast((s => s.width > width))?.value || 0
};