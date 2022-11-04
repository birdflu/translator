export function getDefaultColorKeyValue(offset: number, key: string, value: string, color: number) {
  return getShiftedSymbolColorKeyValue(offset, " ", key, value, color)
}

export function getShiftedSymbolColorKeyValue(offset: number,
                                              shiftSymbol: string,
                                              key: string,
                                              value: string, color: number) {
  return slip(offset, shiftSymbol) + `${key}: \x1b[${color}m${value}\x1b[0m`;
}

export function getColorKeyValue(key: string, value: any, color: number) {
  return `${key}: \x1b[${color}m${value}\x1b[0m`;
}

function slip(count: number, shiftSymbol: string) {
  let str = '';
  for (let i = 0; i < count; i++) {
    str = str + shiftSymbol;
  }
  return str;
}
