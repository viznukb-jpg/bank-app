export function formatCurrency(amount: number | null | undefined): string {
  const value = amount ?? 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}
