/**
 * Parses Polish-formatted price strings (e.g. "349,00 zł") to a float (PLN amount).
 */
export function parsePlPriceStringToNumber(value: string): number {
  const normalized = value
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, "")
    .replace(/zł/gi, "")
    .replace(",", ".");

  const n = Number.parseFloat(normalized);
  return Number.isFinite(n) ? n : 0;
}

export function resolveCartUnitPrice(price: number | string): number {
  if (typeof price === "number") {
    return Number.isFinite(price) ? price : 0;
  }
  return parsePlPriceStringToNumber(price);
}
