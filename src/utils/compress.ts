import pako from 'pako';

/**
 * Returns correct draw.io encoded version of the compressed string
 */
export function compress(data) {
  if (data == null || data.length === 0 || typeof (pako) === 'undefined') {
    return data;
  } else {
    return Buffer.from(pako.deflateRaw(
      new TextEncoder().encode(data))).toString('base64');
  }
}
