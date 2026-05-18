export function formatPlnAmount(amount: number): string {
  if (!Number.isFinite(amount)) {
    return "0,00 zł";
  }
  return `${amount.toFixed(2).replace(".", ",")} zł`;
}
