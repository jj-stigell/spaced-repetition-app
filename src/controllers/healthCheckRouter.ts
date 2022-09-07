import Express from 'express';
const router = Express.Router();

router.get('/', (_req: Express.Request, res: Express.Response) => {
  res.send('ok');
});

export default router;
