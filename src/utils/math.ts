/**
 * Calculates compound interest projected future wealth.
 */
export function calculateFutureValue(
  principal: number,
  monthlyContribution: number,
  annualRate: number,
  years: number
): number {
  const r = annualRate / 12;
  const n = years * 12;
  let total = principal;

  for (let i = 0; i < n; i++) {
    total = total * (1 + r) + monthlyContribution;
  }

  return total;
}

/**
 * Calculates PMT (payment) for standard loans.
 */
export function calculateLoanPMT(principal: number, annualRate: number, years: number): number {
  const r = annualRate / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}
