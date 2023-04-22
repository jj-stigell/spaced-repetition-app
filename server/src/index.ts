// Project imports
import { app } from './app';
import { PORT } from './configs/environment';
import { connectToDatabase } from './database/index';
import logger from './configs/winston';

app.listen(PORT, async () => {
  await connectToDatabase();
  logger.info(`Application started on PORT: ${PORT} 🎉`);
});
