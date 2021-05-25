export const formatDescription = <T>(
  values: T[],
  formatValue: (value: T) => string,
  delimeter: string
) => {
  const result = values.reduce((res, val) => {
    if (res.length === 0) {
      return formatValue(val);
    } else {
      return res + delimeter + formatValue(val);
    }
  }, "");
  return result;
};
