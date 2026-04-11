export function currencyPrefixFromSettings(currencyCode: string | undefined): string {
  if (!currencyCode) return "$";
  try {
    const parts = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
    }).formatToParts(0);
    const sym = parts.find((p) => p.type === "currency");
    return sym?.value ?? currencyCode;
  } catch {
    return currencyCode;
  }
}
