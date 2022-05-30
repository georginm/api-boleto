const isNumeric = (value: string) => {
  return /^\d+(?:\.\d+)?$/.test(value);
};

export { isNumeric };
