import { PORT, NODE_ENV } from './util/config';
import { info, error } from './util/logger';
import app from './app';

const start = () => {
  try {
    app.listen(PORT, () => {
      info(`Server running, port: ${PORT} enviroment: ${NODE_ENV}`);
    });
  } catch(e) {
    error(e);
  }
};

start();
