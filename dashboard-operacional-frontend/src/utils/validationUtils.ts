const cleanCPF = (cpf: string): string => cpf.replace(/\D/g, "");

const allDigitsEqual = (cpf: string): boolean =>
  /^(\d)\1+$/.test(cpf);

const calculateCheckDigit = (cpfDigits: number[], factor: number): number => {
  const sum = cpfDigits.reduce((acc, digit, index) => acc + digit * (factor - index), 0);
  const result = (sum * 10) % 11;
  return result === 10 || result === 11 ? 0 : result;
};

export const isValidCPF = (cpf: string): boolean => {
  const cleaned = cleanCPF(cpf);

  if (cleaned.length !== 11 || allDigitsEqual(cleaned)) return false;

  const digits = cleaned.split("").map(Number);

  const firstDigit = calculateCheckDigit(digits.slice(0, 9), 10);
  const secondDigit = calculateCheckDigit(digits.slice(0, 10), 11);

  return firstDigit === digits[9] && secondDigit === digits[10];
};
