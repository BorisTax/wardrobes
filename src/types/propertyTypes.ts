export const PropertyTypes = {
    VERTEX: 'vertex',
    NUMBER: 'NUMBER',
    POSITIVE_NUMBER: 'POSITIVE_NUMBER',
    INTEGER_POSITIVE_NUMBER: 'INTEGER_POSITIVE_NUMBER',
    BOOL: 'BOOL',
    STRING: 'STRING',
    INPUT: 'INPUT',
    LIST: 'LIST'
};
export const RegExp = new Map<string, RegExp>()
RegExp.set(PropertyTypes.NUMBER, /^-?\d+\.?\d*$/)
RegExp.set(PropertyTypes.INTEGER_POSITIVE_NUMBER, /^[1-9]{1}\d*$/)
RegExp.set(PropertyTypes.POSITIVE_NUMBER, /^\d+\.?\d*$/)
RegExp.set(PropertyTypes.STRING, /.*/)