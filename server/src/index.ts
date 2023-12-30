// Project imports
import { app } from './app';
import { PORT } from './configs/environment';
import { connectToDatabase } from './database/index';
import { connectToRedis } from './configs/redis';
import logger from './configs/winston';

app.listen(PORT, async () => {
  await connectToDatabase();
  await connectToRedis();
  logger.info(`Yomiko started on PORT: ${PORT}`);
});
