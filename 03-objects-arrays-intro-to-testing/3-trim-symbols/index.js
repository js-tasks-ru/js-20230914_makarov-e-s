/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    if ([null, undefined].includes(size)) return string;
    return [...string].reduce((result, letter) => {
        return result.slice(-size) !== letter.repeat(size)
            ? result + letter
            : result;
    }, '');
}
