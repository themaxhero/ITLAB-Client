export function formatMoney(symbol: string,
    value: number,
    decimalSplit: string = "."){
    const first = Math.floor(value / 100);
    const str = String(value)
    const second = str.slice(str.length - 2);
    return `${symbol} ${first}${decimalSplit}${second}`
}