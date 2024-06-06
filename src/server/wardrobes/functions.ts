export function getKarton(width: number, height: number){
    const wLess500_hLess2150 = [
        { width: 1600, value: 2.5 },
        { width: 2100, value: 2.6 },
        { width: 2500, value: 3 },
        { width: 3001, value: 3.5 },
    ]
    const wGreater500_hLess2150 = [
        { width: 1600, value: 3 },
        { width: 2500, value: 3.5 },
        { width: 2800, value: 4 },
        { width: 3001, value: 4.5 },
    ]
    const wLess500_hGreater2150 = [
        { width: 1900, value: 3 },
        { width: 2500, value: 3.5 },
        { width: 2800, value: 4 },
        { width: 3001, value: 4.5 },
    ]
    const wGreater500_hGreater2150 = [
        { width: 1600, value: 3 },
        { width: 2100, value: 3.5 },
        { width: 2500, value: 4 },
        { width: 2800, value: 4.5 },
        { width: 3001, value: 5 },
    ]
    if (width < 500 && height < 2150) return wLess500_hLess2150.find(i => i.width > width)?.value || 0;
    if (width >= 500 && height < 2150) return wGreater500_hLess2150.find(i => i.width > width)?.value || 0;
    if (width < 500 && height >= 2150) return wLess500_hGreater2150.find(i => i.width > width)?.value || 0;
    if (width >= 500 && height >= 2150) return wGreater500_hGreater2150.find(i => i.width > width)?.value || 0;
    return 0
}

export function getLegs(width: number) {
    const sizes = [
        { width: 1400, value: 6 },
        { width: 2200, value: 8 },
        { width: 2800, value: 10 },
        { width: 3001, value: 16 },
    ]
    return sizes.find((s => s.width > width))?.value || 0
};

export function getNails(width: number) {
    const sizes = [
        { width: 1400, value: 0.095 },
        { width: 1600, value: 0.1 },
        { width: 1900, value: 0.11 },
        { width: 2100, value: 0.14 },
        { width: 2500, value: 0.15 },
        { width: 3001, value: 0.2 },
    ]
    return sizes.find((s => s.width > width))?.value || 0
};

export function getSamorez16(width: number) {
    const sizes = [
        { width: 2200, value: 18 },
        { width: 2600, value: 28 },
        { width: 3001, value: 36 },
    ]
    return sizes.find((s => s.width > width))?.value || 0
};