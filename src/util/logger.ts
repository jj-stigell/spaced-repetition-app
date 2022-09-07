export const info = (...params: Array<string|unknown>) => {
  console.log(...params);
};

export const error = (...params: Array<string|unknown>) => {
  console.error(...params);
};
