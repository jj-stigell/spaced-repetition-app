import express, { Request, Response } from "express";
import POSTGRE_URL from "./util/config";
const app = express();

app.get('/', (_req: Request, res: Response) => {
  res.send('hello');
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(POSTGRE_URL);
});
