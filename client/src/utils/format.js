export function formatCurrency(amount) {
  const value = Number(amount);

  if (isNaN(value)) return "Rs. 0.00";

  return `Rs. ${value.toLocaleString("en-NP", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);

  if (isNaN(date.getTime())) return "";

  return date.toLocaleString("en-NP", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const TX_TYPES = {
  1: "Deposit",
  2: "Withdraw",
  3: "Transfer",
};