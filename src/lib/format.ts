/** Format an indicative price in Jordanian dinar. */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-JO", {
    style: "currency",
    currency: "JOD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
