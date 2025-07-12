export function formatPrice(price: number | string): string {
  const numericPrice = Number(price);
  if (isNaN(numericPrice)) {
    // Return a default or error format for invalid numbers
    return '₦--';
  }
  return `₦${numericPrice.toLocaleString('en-NG')}`;
}

export function formatPriceWithKobo(price: number | string): string {
  const numericPrice = Number(price);
  if (isNaN(numericPrice)) {
    return '₦--.--';
  }
  return `₦${numericPrice.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
