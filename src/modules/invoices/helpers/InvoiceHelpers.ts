const isNumeric = (value: string): boolean => {
  return /^\d+(?:\.\d+)?$/.test(value);
};

const moduleOf11 = (digits: string[]): number => {
  const multipliers = [2, 3, 4, 5, 6, 7, 8, 9];

  const multiplyAndSum = digits.reduce((sum, element, index) => {
    const multiplier = multipliers[index % multipliers.length];
    return sum + parseInt(element, 10) * multiplier;
  }, 0);

  const rest = multiplyAndSum % 11;

  const result = 11 - rest;

  if (result === 0 || result === 10 || result === 11) return 1;

  return result;
};

const moduleOf10 = (digits: string[]): number => {
  const sumDigits = digits.reduce((sum, element, index) => {
    const multiplier = index % 2 === 0 ? 2 : 1;
    const result = multiplier * parseInt(element, 10);

    return result
      .toString()
      .split('')
      .reduce((newSum, element) => newSum + parseInt(element, 10), sum);
  }, 0);

  const verificationDigit = Math.abs((sumDigits % 10) - 10);

  return verificationDigit === 10 ? 0 : verificationDigit;
};

export { isNumeric, moduleOf10, moduleOf11 };
