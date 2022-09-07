const info = (...params: Array<string|unknown>) => {
  console.log(...params);
};

const error = (...params: Array<string|unknown>) => {
  console.error(...params);
};

export {
  info,
  error
};
