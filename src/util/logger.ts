export const info = (...params: Array<string|Error>) => {
  console.log(...params);
};

export const error = (...params: Array<string|Error>) => {
  console.error(...params);
};
