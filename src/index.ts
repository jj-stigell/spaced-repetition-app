import { PORT } from './util/config';
import { info, error } from './util/logger';
import app from './app';

const start = () => {
  try {
    app.listen(PORT, () => {
      info(`Server running on port ${PORT}`);
    });
  } catch(e) {
    error(e);
  }
};

start();
