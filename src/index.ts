const express = require('express');
const app = express();

app.get('/', (_req: any, res: any) => {
  res.send('hello');
});

const PORT: number = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});