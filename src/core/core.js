
export const FS = '\u001c';
export const US = '\u001f';
export const STX = '\u0002';
export const ETX = '\u0003';
export const _STX = 2;
export const _ETX = 3;

// strings

/**
 * 
 * @param {Array<number> | string} data 
 * @returns {Uint8Array | string}
 */
export function STX_ETX_LRC(data) {
    if (typeof data === 'string')
        return new TextDecoder().decode(STX_ETX_LRC(toBytes(data)));

    const uBound = data.length;
    if (uBound < 0)
        return data;
    const ret = [_STX];
    ret.push(...data);
    ret.push(_ETX);
    const lrc = LRC(ret, 1);
    ret.push(lrc);
    return Uint8Array.from(ret);
}

/**
 * 
 * @param {Array<number>} data 
 * @param {number} leftOffset 
 * @param {number} rightOffset 
 * @returns {number}
 */
export function LRC(data, leftOffset = 0, rightOffset = 0) {
    let lrc = 0;
    for (let i = leftOffset; i < data.length - rightOffset; i++)
        lrc ^= data[i];

    return lrc;
}

/**
 * 
 * @param {string} s 
 * @returns {Uint8Array}
 */
export function toBytes(s) {
    if (typeof (s) !== 'string')
        return null;
    return new TextEncoder().encode(s);
}

// dates

/**
 * 
 * @param {Date} date 
 * @returns {string} date in yyyyMMddHHmmss format (following .NET's format)
 */
export function getDateyyyyMMddHHmmss(date) {
    return `${date.getFullYear()}${padZeros(date.getMonth() + 1, 2)}${padZeros(date.getDate(), 2)}${padZeros(date.getHours(), 2)}${padZeros(date.getMinutes(), 2)}${padZeros(date.getSeconds(), 2)}`;
}

//numbers

/**
 * 
 * @param {number} num 
 * @param {number} length 
 * @returns {string}
 */
function padZeros(num, length) {
    return Array(Math.max(length - String(num).length + 1, 0)).join(0) + num;
}
